import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const useWeather = (initialCity = 'London') => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [units, setUnits] = useState('metric');
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('weather_history');
        return saved ? JSON.parse(saved) : [];
    });

    const fetchWeather = useCallback(async (cityName) => {
        if (!cityName) return;
        setLoading(true);
        setError(null);
        try {
            const resp = await axios.get(`${API_BASE}/weather?city=${cityName}`);
            setWeather(resp.data);

            // Update history
            setHistory(prev => {
                const newHistory = [resp.data.location.name, ...prev.filter(c => c !== resp.data.location.name)].slice(0, 5);
                localStorage.setItem('weather_history', JSON.stringify(newHistory));
                return newHistory;
            });
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to fetch weather data. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchByCoords = useCallback(async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const geoResp = await axios.get(`${API_BASE}/reverse-geo?lat=${lat}&lon=${lon}`);
            if (geoResp.data?.name) {
                fetchWeather(geoResp.data.name);
            }
        } catch (err) {
            setError("Could not determine your location.");
        } finally {
            setLoading(false);
        }
    }, [fetchWeather]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                fetchByCoords(pos.coords.latitude, pos.coords.longitude);
            }, () => {
                fetchWeather(initialCity);
            });
        } else {
            fetchWeather(initialCity);
        }
    }, []); // Only on mount

    return { weather, loading, error, fetchWeather, fetchByCoords, history, units, setUnits };
};
