import axios from 'axios';

export async function getWeather(location = 'London') {
  try {
    const geo = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`);
    const { latitude, longitude } = geo.data.results[0];
    const weather = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const temp = weather.data.current_weather.temperature;
    const wind = weather.data.current_weather.windspeed;
    return `Current weather in ${location}: ${temp}°C, wind speed ${wind} km/h.`;
  } catch (e) {
    return `Weather fetch error: ${e.message}`;
  }
}