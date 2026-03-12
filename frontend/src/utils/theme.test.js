import { expect, test } from 'vitest';
import { kelvinToCelsius, getThemeByCondition } from './theme';

test('converts Kelvin to Celsius correctly', () => {
    expect(kelvinToCelsius(300)).toBe(27);
    expect(kelvinToCelsius(273.15)).toBe(0);
});

test('returns correct theme for weather condition', () => {
    expect(getThemeByCondition('clear sky')).toBe('theme-sunny');
    expect(getThemeByCondition('broken clouds')).toBe('theme-cloudy');
    expect(getThemeByCondition('heavy rain')).toBe('theme-rainy');
    expect(getThemeByCondition('unknown')).toBe('theme-default');
});
