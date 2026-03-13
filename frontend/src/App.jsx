import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sun, Wind, Droplets, Thermometer, MapPin, 
    Calendar, AlertCircle, Navigation, Activity, Waves
} from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import ForecastChart from './components/ForecastChart';
import ErrorBoundary from './components/ErrorBoundary';
import { getThemeByCondition, getAqiInfo } from './utils/theme';

import './App.css';

const Sidebar = () => (
    <div className="sidebar glass">
        <div className="sidebar-top">
            <div className="sidebar-logo">
                <div className="logo-icon">⚡</div>
            </div>
            <nav className="nav-menu">
                <button className="nav-item active"><Calendar size={22} /></button>
                <button className="nav-item"><Sun size={22} /></button>
                <button className="nav-item"><MapPin size={22} /></button>
                <button className="nav-item"><AlertCircle size={22} /></button>
                <button className="nav-item"><Navigation size={22} /></button>
            </nav>
        </div>
        <div className="sidebar-bottom">
            <button className="nav-item"><Waves size={22} /></button>
            <div className="user-profile">
                <img src="https://i.pravatar.cc/150?u=antigravity" alt="User" />
                <div className="online-status"></div>
            </div>
        </div>
    </div>
);

const App = () => {
    const {
        weather, loading, error,
        units, setUnits, history, fetchWeather
    } = useWeather('London');

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleUnits = () => setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');

    const convertTemp = (temp) => {
        if (units === 'metric') return Math.round(temp);
        return Math.round((temp * 9 / 5) + 32);
    };

    const themeClass = weather ? getThemeByCondition(weather.current.description) : 'theme-default';

    return (
        <ErrorBoundary>
            <div className={`app-layout ${themeClass}`}>
                <Sidebar />
                <div className="dashboard-container">
                    <header className="header">
                        <div className="header-left">
                            <div className="logo-group">
                                <motion.h1
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                >
                                    SkyPulse
                                </motion.h1>
                            </div>
                            {weather && (
                                <div className="location-context">
                                    <h2>{weather.location.name.toUpperCase()}, {weather.location.country}</h2>
                                    <span>{currentTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} | {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                            )}
                        </div>

                        <div className="header-right">
                            <button className="header-icon-btn"><Activity size={20} /></button>
                            <button className="header-icon-btn"><Wind size={20} /></button>
                            <div className="search-wrapper">
                                <SearchBar
                                    onSearch={fetchWeather}
                                    history={history}
                                    loading={loading}
                                />
                            </div>
                            <button className="unit-toggle" onClick={toggleUnits}>
                                {units === 'metric' ? '°C' : '°F'}
                            </button>
                        </div>
                    </header>

                    <main className="main-content">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="dashboard-grid"
                                >
                                    <div className="skeleton-card weather-gradient" style={{ gridColumn: 'span 8', height: '400px' }}></div>
                                    <div className="skeleton-card glass" style={{ gridColumn: 'span 4', height: '400px' }}></div>
                                </motion.div>
                            ) : weather ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="dashboard-grid"
                                >
                                    {/* Current Weather Card */}
                                    <div className="card-current weather-gradient">
                                        <div className="card-label">Current Weather</div>
                                        <div className="weather-main-content">
                                            <div className="weather-left-side">
                                                <div className="temp-main">
                                                    <span className="temp-val">{convertTemp(weather.current.temp)}°</span>
                                                    {weather.current.icon && (
                                                        <img
                                                            src={`http://openweathermap.org/img/wn/${weather.current.icon}@4x.png`}
                                                            alt="weather icon"
                                                            className="main-icon"
                                                        />
                                                    )}
                                                </div>
                                                <div className="weather-desc-text">
                                                    {weather.current.description}
                                                </div>
                                            </div>
                                            <div className="weather-right-side">
                                                <div className="detail-row">
                                                    <span>Felt like:</span>
                                                    <strong>{convertTemp(weather.current.feels_like)}°</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Wind:</span>
                                                    <strong>{weather.current.wind_speed} km/h SW</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Humidity:</span>
                                                    <strong>{weather.current.humidity}%</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Visibility:</span>
                                                    <strong>{weather.current.visibility ? (weather.current.visibility / 1000).toFixed(1) : '10'} km</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Air Quality Card */}
                                    <div className="card-pollution glass">
                                        <div className="card-label">Air Quality Index</div>
                                        <div className="aqi-meter-new">
                                            <div className="aqi-gauge">
                                                <svg viewBox="0 0 100 50">
                                                    <path
                                                        d="M 10 50 A 40 40 0 0 1 90 50"
                                                        fill="none"
                                                        stroke="rgba(255,255,255,0.1)"
                                                        strokeWidth="8"
                                                    />
                                                    <path
                                                        d="M 10 50 A 40 40 0 0 1 90 50"
                                                        fill="none"
                                                        stroke="url(#aqiGradient)"
                                                        strokeWidth="8"
                                                        strokeDashoffset={125.6 * (1 - (weather.pollution.main.aqi / 5))}
                                                        strokeDasharray="125.6"
                                                    />
                                                    <defs>
                                                        <linearGradient id="aqiGradient">
                                                            <stop offset="0%" stopColor="#0ea5e9" />
                                                            <stop offset="50%" stopColor="#22c55e" />
                                                            <stop offset="100%" stopColor="#ef4444" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="aqi-value-center">
                                                    <span className="aqi-num">{weather.pollution.main.aqi * 20}</span>
                                                    <span className="aqi-text">{getAqiInfo(weather.pollution.main.aqi).label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="aqi-footer">
                                            <div className="aqi-detail">AQI: <strong>{weather.pollution.main.aqi * 20} {getAqiInfo(weather.pollution.main.aqi).label}</strong></div>
                                            <div className="pollutants-inline">
                                                <span>PM2.5: <strong>{weather.pollution.components.pm2_5} μg/m³</strong></span>
                                                <span>O₃: <strong>{weather.pollution.components.o3} ppb</strong></span>
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
                                </motion.div>
                            ) : error ? (
                                <motion.div className="glass error-box">{error}</motion.div>
                            ) : null}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default App;
