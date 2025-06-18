const WeatherService = require('../services/weather');

class WeatherController {
  async getWeather(req, res) {
    try {
      const { lat, lon } = req.query;
      if (!lat || !lon) {
        return res.status(400).json({ error: 'lat and lon required' });
      }
      const weather = await WeatherService.getWeatherByCoords(lat, lon);
      res.json(weather);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch weather' });
    }
  }
}

module.exports = new WeatherController();
