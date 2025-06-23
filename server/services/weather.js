const axios = require('axios');
const db = require('../models/db');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

class WeatherService {
  /**
   * Get current weather for given coordinates, with DB caching
   * @param {number} lat
   * @param {number} lon
   * @returns {Promise<Object>}
   */
  async getWeatherByCoords(lat, lon) {
    // Try to get recent weather from DB (within 1 hour)
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    const cached = await db.query(
      `SELECT * FROM weather_snapshots WHERE lat=$1 AND lon=$2 AND timestamp > $3 ORDER BY timestamp DESC LIMIT 1`,
      [lat, lon, oneHourAgo]
    );
    if (cached.rows.length > 0) {
      return cached.rows[0].data;
    }

    // Fetch from OpenWeatherMap
    if (!OPENWEATHER_API_KEY) throw new Error('Missing OpenWeatherMap API key');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const { data } = await axios.get(url);

    // Store in DB
    await db.query(
      `INSERT INTO weather_snapshots (lat, lon, timestamp, data) VALUES ($1, $2, $3, $4)`,
      [lat, lon, data.dt, data]
    );

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
