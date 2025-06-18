const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class WeatherService {
  /**
   * Get current weather for given coordinates
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<Object>}
   */
  async getWeatherByCoords(lat, lon) {
    if (!WEATHER_API_KEY) throw new Error('Missing OpenWeatherMap API key');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const { data } = await axios.get(url);
    return {
      temp: data.main.temp,
      wind: data.wind,
      weather: data.weather[0],
      clouds: data.clouds,
      timestamp: data.dt
    };
  }
}

module.exports = new WeatherService();
