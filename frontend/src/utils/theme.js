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
    1: { label: 'Good', color: '#10b981', desc: 'Air is clean and safe.' },
    2: { label: 'Fair', color: '#84cc16', desc: 'Acceptable quality.' },
    3: { label: 'Moderate', color: '#f59e0b', desc: 'Sensitive groups should limit exposure.' },
    4: { label: 'Poor', color: '#ef4444', desc: 'Health effects may be experienced.' },
    5: { label: 'Very Poor', color: '#b91c1c', desc: 'Health warning: serious effects!' }
};

export const getAqiInfo = (aqi) => aqiMap[aqi] || { label: 'Unknown', color: '#666', desc: '' };
