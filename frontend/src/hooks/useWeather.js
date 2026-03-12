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
            // In a real app, you'd have a separate endpoint for coords or handle it in backend
            // For now, let's assume city search is the primary way, 
            // but we'll simulate fetching for the user's location name
            const geoResp = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=f57263f431ed5e3e39c84442f3b3a145`);
            if (geoResp.data?.[0]?.name) {
                fetchWeather(geoResp.data[0].name);
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

    return { weather, loading, error, fetchWeather, history, units, setUnits };
};
