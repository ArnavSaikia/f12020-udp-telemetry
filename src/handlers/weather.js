const WEATHER_DESCRIPTIONS = {
    0: 'clear', 1: 'light cloud', 2: 'overcast', 3: 'light rain', 4: 'heavy rain', 5: 'storm',
};

export function getWeatherStatus(raceState) {
    const session = raceState.session;
    if (!session) return "No weather data yet.";

    const description = WEATHER_DESCRIPTIONS[session.weather] ?? 'unknown';
    const upcomingRain = session.weatherForecastSamples.find((s) => s.weather >= 3);
    const forecastNote = upcomingRain && session.weather < 3
        ? ` Rain is forecast in about ${upcomingRain.timeOffset} minutes.`
        : '';

    return `Currently ${description}, track temp ${session.trackTemperature} degrees.${forecastNote}`;
}