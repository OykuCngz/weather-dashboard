import React, { useState } from 'react';
import {
    Sun, Calendar,
    Activity, MapPin, AlertCircle,
    Navigation, Waves, Thermometer, Wind, Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks & Utils
import { useWeather } from './hooks/useWeather';
import { getThemeByCondition, getAqiInfo } from './utils/theme';

// Components
import SearchBar from './components/SearchBar';
import ForecastChart from './components/ForecastChart';
import SkeletonLoader from './components/SkeletonLoader';
import ErrorBoundary from './components/ErrorBoundary';

import './App.css';

const App = () => {
    const {
        weather, loading, error,
        fetchWeather, history,
        units, setUnits
    } = useWeather('London');

    const toggleUnits = () => setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');

    const convertTemp = (temp) => {
        if (units === 'metric') return Math.round(temp);
        return Math.round((temp * 9 / 5) + 32);
    };

    const themeClass = weather ? getThemeByCondition(weather.current.description) : 'theme-default';

    return (
        <ErrorBoundary>
            <div className={`dashboard-container ${themeClass}`}>
                <header className="header">
                    <div className="logo-group">
                        <motion.h1
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            SkyPulse
                        </motion.h1>
                    </div>

                    <div className="header-controls">
                        <button className="unit-toggle glass" onClick={toggleUnits}>
                            {units === 'metric' ? '°C' : '°F'}
                        </button>
                        <SearchBar
                            onSearch={fetchWeather}
                            history={history}
                            loading={loading}
                        />
                    </div>
                </header>

                <main className="main-content">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="error-box glass"
                            >
                                <AlertCircle size={32} />
                                <p>{error}</p>
                                <button onClick={() => fetchWeather('London')}>Back to London</button>
                            </motion.div>
                        )}

                        {loading ? (
                            <SkeletonLoader key="skeleton" />
                        ) : weather ? (
                            <motion.div
                                key="dashboard"
                                className="dashboard-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Current Weather Card */}
                                <div className="card-current glass">
                                    <div className="card-header-top" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '2rem' }}>
                                        <div className="city-info" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} />
                                            <h2>{weather.location.name}, {weather.location.country}</h2>
                                        </div>
                                        <span className="date-time">
                                            {new Date().toLocaleDateString('en-GB', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>

                                    <div className="weather-main">
                                        <div className="temp-group">
                                            <span className="temp">{convertTemp(weather.current.temp)}°</span>
                                            <span className="desc">{weather.current.description}</span>
                                        </div>
                                        <div className="weather-icon-lg">
                                            {weather.current.icon ? (
                                                <motion.img
                                                    initial={{ rotate: -10, scale: 0.8 }}
                                                    animate={{ rotate: 0, scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 100 }}
                                                    src={`http://openweathermap.org/img/wn/${weather.current.icon}@4x.png`}
                                                    alt="weather icon"
                                                />
                                            ) : (
                                                <Sun size={120} color="#f59e0b" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="weather-stats">
                                        <div className="stat-item">
                                            <Thermometer size={20} style={{ color: '#60a5fa' }} />
                                            <div className="stat-info">
                                                <span>Feels Like</span>
                                                <strong>{convertTemp(weather.current.feels_like)}°</strong>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <Droplets size={20} style={{ color: '#60a5fa' }} />
                                            <div className="stat-info">
                                                <span>Humidity</span>
                                                <strong>{weather.current.humidity}%</strong>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <Wind size={20} style={{ color: '#60a5fa' }} />
                                            <div className="stat-info">
                                                <span>Wind</span>
                                                <strong>{weather.current.wind_speed} m/s</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Air Quality Card */}
                                <div className="card-pollution glass">
                                    <div className="section-header">
                                        <Waves size={18} />
                                        <h3>Air Quality Index</h3>
                                    </div>
                                    <div className="aqi-meter">
                                        <div
                                            className="aqi-circle"
                                            style={{ '--aqi-color': getAqiInfo(weather.pollution.main.aqi).color }}
                                        >
                                            <span className="aqi-number">{weather.pollution.main.aqi}</span>
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
                                    </div>
                                </div>

                                {/* Forecast & Chart Card */}
                                <div className="card-forecast glass">
                                    <div className="section-header">
                                        <Calendar size={18} />
                                        <h3>48-Hour Temperature Forecast</h3>
                                    </div>
                                    <ForecastChart data={weather.forecast} />
                                </div>

                                {/* Additional Details */}
                                <div className="card-details">
                                    <div className="glass detail-card">
                                        <Activity size={20} />
                                        <div className="stat-info">
                                            <span>Pressure</span>
                                            <strong>{weather.current.pressure} hPa</strong>
                                        </div>
                                    </div>
                                    <div className="glass detail-card">
                                        <Navigation size={20} />
                                        <div className="stat-info">
                                            <span>Visibility</span>
                                            <strong>{weather.current.visibility ? (weather.current.visibility / 1000).toFixed(1) : '10'} km</strong>
                                        </div>
                                    </div>
                                    <div className="glass detail-card">
                                        <Sun size={20} />
                                        <div className="stat-info">
                                            <span>UV Index</span>
                                            <strong>Moderate</strong>
                                        </div>
                                    </div>
                                    <div className="glass detail-card">
                                        <Wind size={20} />
                                        <div className="stat-info">
                                            <span>Cloudiness</span>
                                            <strong>{weather.current.description}</strong>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </main>
            </div>
        </ErrorBoundary>
    );
};

export default App;
