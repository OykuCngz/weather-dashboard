import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sun, Wind, Droplets, Thermometer, MapPin, 
    Calendar, AlertCircle, Navigation, Activity, Waves,
    Settings, X, Sunrise, Sunset, Compass
} from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import ForecastChart from './components/ForecastChart';
import ErrorBoundary from './components/ErrorBoundary';
import { getThemeByCondition, getAqiInfo } from './utils/theme';

import './App.css';

const Sidebar = ({ activeTab, onTabClick, onLocationClick, onProfileClick, onMarineClick }) => (
    <div className="sidebar glass">
        <div className="sidebar-top">
            <div className="sidebar-logo">
                <div className="logo-icon">⚡</div>
            </div>
            <nav className="nav-menu">
                <button onClick={() => onTabClick('forecast')} className={`nav-item ${activeTab === 'forecast' ? 'active' : ''}`} title="Forecast"><Calendar size={22} /></button>
                <button onClick={() => onTabClick('current')} className={`nav-item ${activeTab === 'current' ? 'active' : ''}`} title="Current Weather"><Sun size={22} /></button>
                <button onClick={() => onTabClick('search')} className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} title="Search Location"><MapPin size={22} /></button>
                <button onClick={() => onTabClick('aqi')} className={`nav-item ${activeTab === 'aqi' ? 'active' : ''}`} title="Air Quality"><AlertCircle size={22} /></button>
                <button onClick={onLocationClick} className="nav-item" title="My Location"><Navigation size={22} /></button>
            </nav>
        </div>
        <div className="sidebar-bottom">
            <button className="nav-item" onClick={onMarineClick} title="Marine & Atmosphere"><Waves size={22} /></button>
            <div className="user-profile" onClick={onProfileClick}>
                <img src="https://i.pravatar.cc/150?u=antigravity" alt="User" title="Settings & Profile" style={{ cursor: 'pointer' }} />
                <div className="online-status"></div>
            </div>
        </div>
    </div>
);

const App = () => {
    const {
        weather, loading, error,
        units, setUnits, history, fetchWeather, fetchByCoords
    } = useWeather('London');

    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('current');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showMarineModal, setShowMarineModal] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleUnits = () => setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');

    const getCityTime = (date, offset) => {
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        return new Date(utc + (1000 * offset));
    };

    const displayTime = weather ? getCityTime(currentTime, weather.location.timezone) : currentTime;

    const convertTemp = (temp) => {
        if (units === 'metric') return Math.round(temp);
        return Math.round((temp * 9 / 5) + 32);
    };

    const scrollToSection = (id) => {
        setActiveTab(id);
        if (id === 'search') {
            const searchInput = document.querySelector('.search-inner input');
            if (searchInput) searchInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleLocationClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                fetchByCoords(pos.coords.latitude, pos.coords.longitude);
            }, () => {
                alert("Location permission denied or unavailable.");
            });
        }
    };

    const themeClass = weather ? getThemeByCondition(weather.current.description) : 'theme-default';

    return (
        <ErrorBoundary>
            <div className={`app-layout ${themeClass}`}>
                <Sidebar 
                    activeTab={activeTab} 
                    onTabClick={scrollToSection} 
                    onLocationClick={handleLocationClick} 
                    onProfileClick={() => setShowProfileModal(true)}
                    onMarineClick={() => setShowMarineModal(true)}
                />
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
                                    <span>{displayTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })} | {displayTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                </div>
                            )}
                        </div>

                        <div className="header-right">
                            <button onClick={() => scrollToSection('aqi')} className="header-icon-btn" title="Air Quality Details"><Activity size={20} /></button>
                            <button onClick={() => scrollToSection('current')} className="header-icon-btn" title="Wind Details"><Wind size={20} /></button>
                            <div className="search-wrapper" id="search">
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
                                    <div className="card-current weather-gradient" id="current">
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
                                    <div className="card-pollution glass" id="aqi">
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
                                    <div className="card-forecast glass" id="forecast">
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

                {/* Profile / Settings Modal */}
                <AnimatePresence>
                    {showProfileModal && (
                        <motion.div 
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProfileModal(false)}
                        >
                            <motion.div 
                                className="modal-content"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 10 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h2><Settings size={24} color="var(--accent-primary)" /> Settings</h2>
                                    <button className="modal-close" onClick={() => setShowProfileModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="settings-row">
                                        <span className="settings-label"><img src="https://i.pravatar.cc/150?u=antigravity" alt="avatar" style={{width: 30, borderRadius: '50%'}} /> Antigravity User</span>
                                        <span style={{color: 'green', fontSize: '14px', fontWeight: 'bold'}}>Online</span>
                                    </div>
                                    <div className="settings-row">
                                        <span className="settings-label"><Thermometer size={18} /> Temperature Unit</span>
                                        <button className="unit-toggle" onClick={toggleUnits}>
                                            {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
                                        </button>
                                    </div>
                                    <div className="settings-row">
                                        <span className="settings-label"><Activity size={18} /> API Performance</span>
                                        <strong style={{color: 'var(--accent-primary)'}}>Excellent</strong>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Marine & Atmosphere Modal */}
                <AnimatePresence>
                    {showMarineModal && weather && (
                        <motion.div 
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMarineModal(false)}
                        >
                            <motion.div 
                                className="modal-content"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 10 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h2><Waves size={24} color="var(--accent-primary)" /> Marine & Geo</h2>
                                    <button className="modal-close" onClick={() => setShowMarineModal(false)}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {weather.current.sea_level && (
                                        <div className="marine-stat">
                                            <span className="marine-icon"><Waves size={22} /> Sea Level</span>
                                            <span className="marine-value">{weather.current.sea_level} hPa</span>
                                        </div>
                                    )}
                                    {weather.current.grnd_level && (
                                        <div className="marine-stat">
                                            <span className="marine-icon"><Compass size={22} /> Ground Level</span>
                                            <span className="marine-value">{weather.current.grnd_level} hPa</span>
                                        </div>
                                    )}
                                    {weather.current.sunrise && (
                                        <div className="marine-stat">
                                            <span className="marine-icon"><Sunrise size={22} /> Sunrise</span>
                                            <span className="marine-value">{getCityTime(new Date(weather.current.sunrise * 1000), weather.location.timezone).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    )}
                                    {weather.current.sunset && (
                                        <div className="marine-stat">
                                            <span className="marine-icon"><Sunset size={22} /> Sunset</span>
                                            <span className="marine-value">{getCityTime(new Date(weather.current.sunset * 1000), weather.location.timezone).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </ErrorBoundary>
    );
};

export default App;
