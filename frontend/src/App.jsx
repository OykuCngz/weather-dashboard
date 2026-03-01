import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Sun, Cloud, CloudRain, Wind, Droplets,
    Thermometer, ShieldAlert, Navigation, Calendar,
    Activity, MapPin, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = 'http://localhost:8000/api';

const App = () => {
    const [city, setCity] = useState('London');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (cityName) => {
        setLoading(true);
        setError(null);
        try {
            const resp = await axios.get(`${API_BASE}/weather?city=${cityName}`);
            setWeather(resp.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to fetch weather data. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather('London');
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const input = e.target.elements.city.value.trim();
        if (input) fetchWeather(input);
    };

    const aqiMap = {
        1: { label: 'Good', color: '#10b981', desc: 'Air is clean.' },
        2: { label: 'Fair', color: '#84cc16', desc: 'Acceptable quality.' },
        3: { label: 'Moderate', color: '#f59e0b', desc: 'Sensitive groups warned.' },
        4: { label: 'Poor', color: '#ef4444', desc: 'Unhealthy for all.' },
        5: { label: 'Very Poor', color: '#b91c1c', desc: 'Health alert!' }
    };

    const getAqiInfo = (aqi) => aqiMap[aqi] || { label: 'Unknown', color: '#666', desc: '' };

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="logo-group">
                    <h1>SkyPulse</h1>
                    <span className="badge">LIVE</span>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-inner">
                        <Search className="search-icon" size={20} />
                        <input
                            name="city"
                            type="text"
                            placeholder="Search your city..."
                            required
                        />
                        {loading ? <Loader2 className="spinner" size={18} /> : <button type="submit">Search</button>}
                    </div>
                </form>
            </header>

            <main className="main-content">
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="error-box glass"
                        >
                            <AlertCircle size={24} />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {weather && !loading && (
                        <motion.div
                            className="dashboard-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card-current glass">
                                <div className="card-header">
                                    <div className="city-info">
                                        <MapPin size={16} />
                                        <h2>{weather.location.name}, {weather.location.country}</h2>
                                    </div>
                                    <span className="date-time">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                                </div>

                                <div className="weather-main">
                                    <div className="temp-group">
                                        <span className="temp">{Math.round(weather.current.temp)}°</span>
                                        <span className="desc">{weather.current.description}</span>
                                    </div>
                                    <div className="weather-icon-lg">
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weather.current.icon}@4x.png`}
                                            alt="weather"
                                        />
                                    </div>
                                </div>

                                <div className="weather-stats">
                                    <div className="stat-item">
                                        <Thermometer size={18} />
                                        <div className="stat-info">
                                            <span>Feels Like</span>
                                            <strong>{Math.round(weather.current.feels_like)}°</strong>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Droplets size={18} />
                                        <div className="stat-info">
                                            <span>Humidity</span>
                                            <strong>{weather.current.humidity}%</strong>
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <Wind size={18} />
                                        <div className="stat-info">
                                            <span>Wind</span>
                                            <strong>{weather.current.wind_speed} m/s</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-pollution glass">
                                <h3>Air Quality Index</h3>
                                <div className="aqi-meter">
                                    <div
                                        className="aqi-value"
                                        style={{ '--aqi-color': getAqiInfo(weather.pollution.main.aqi).color }}
                                    >
                                        <span>{weather.pollution.main.aqi}</span>
                                        <small>AQI</small>
                                    </div>
                                    <div className="aqi-status">
                                        <h4 style={{ color: getAqiInfo(weather.pollution.main.aqi).color }}>
                                            {getAqiInfo(weather.pollution.main.aqi).label}
                                        </h4>
                                        <p>{getAqiInfo(weather.pollution.main.aqi).desc}</p>
                                    </div>
                                </div>

                                <div className="pollution-grid">
                                    <div className="pollutant">
                                        <span>PM2.5</span>
                                        <strong>{weather.pollution.components.pm2_5}</strong>
                                    </div>
                                    <div className="pollutant">
                                        <span>PM10</span>
                                        <strong>{weather.pollution.components.pm10}</strong>
                                    </div>
                                    <div className="pollutant">
                                        <span>CO</span>
                                        <strong>{weather.pollution.components.co}</strong>
                                    </div>
                                    <div className="pollutant">
                                        <span>NO2</span>
                                        <strong>{weather.pollution.components.no2}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="card-forecast glass">
                                <div className="section-header">
                                    <Calendar size={18} />
                                    <h3>24-Hour Forecast</h3>
                                </div>
                                <div className="forecast-scroll">
                                    {weather.forecast.map((item, idx) => (
                                        <div key={idx} className="forecast-item">
                                            <span>{new Date(item.dt * 1000).getHours()}:00</span>
                                            <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="icon" />
                                            <strong>{Math.round(item.main.temp)}°</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card-details glass">
                                <div className="detail-item">
                                    <Activity size={18} />
                                    <div className="detail-info">
                                        <span>Pressure</span>
                                        <strong>{weather.current.pressure} hPa</strong>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Navigation size={18} />
                                    <div className="detail-info">
                                        <span>Geo Location</span>
                                        <strong>{weather.location.lat.toFixed(2)}, {weather.location.lon.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;
