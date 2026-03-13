import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ForecastChart = ({ data }) => {
    // Format data for Recharts
    const chartData = data.slice(0, 24).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
    }));

    return (
        <div className="chart-wrapper" style={{ marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="time"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="temp"
                        stroke="#fff"
                        strokeWidth={4}
                        fill="url(#colorTemp)"
                        fillOpacity={0.5}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ForecastChart;
