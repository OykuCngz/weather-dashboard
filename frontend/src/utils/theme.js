export const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
};

export const getThemeByCondition = (condition) => {
    const raw = condition?.toLowerCase() || '';

    if (raw.includes('clear')) return 'theme-sunny';
    if (raw.includes('clouds')) return 'theme-cloudy';
    if (raw.includes('rain') || raw.includes('drizzle')) return 'theme-rainy';
    if (raw.includes('snow')) return 'theme-snowy';
    if (raw.includes('thunder')) return 'theme-stormy';
    if (raw.includes('mist') || raw.includes('fog')) return 'theme-misty';

    return 'theme-default';
};

export const aqiMap = {
    1: { label: 'Good', color: '#10b981', desc: 'Air is clean and safe.', indexBase: 20 },
    2: { label: 'Fair', color: '#84cc16', desc: 'Acceptable quality.', indexBase: 60 },
    3: { label: 'Moderate', color: '#f59e0b', desc: 'Sensitive groups should limit exposure.', indexBase: 120 },
    4: { label: 'Poor', color: '#ef4444', desc: 'Health effects may be experienced.', indexBase: 180 },
    5: { label: 'Very Poor', color: '#b91c1c', desc: 'Health warning: serious effects!', indexBase: 250 }
};

export const getAqiInfo = (aqiLevel, pm25) => {
    const info = aqiMap[aqiLevel] || { label: 'Unknown', color: '#666', desc: '', indexBase: 0 };
    // OpenWeather API gives 1-5 scale. Let's make an artificial 0-500 scale based on PM2.5 to make it look realistic.
    // If no PM2.5 data (fallback), just use the indexBase.
    let index = info.indexBase;
    
    if (pm25 !== undefined) {
        // Standard EPA approximation based on PM2.5
        if (pm25 <= 12.0) index = Math.round((50 / 12) * pm25);
        else if (pm25 <= 35.4) index = Math.round(((49) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
        else if (pm25 <= 55.4) index = Math.round(((49) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
        else if (pm25 <= 150.4) index = Math.round(((49) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
        else if (pm25 <= 250.4) index = Math.round(((99) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
        else index = Math.round(((199) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
    }
    
    return { ...info, index };
};
