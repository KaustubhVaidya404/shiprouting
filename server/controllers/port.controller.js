const PortModel = require('../models/port');

class PortController {
  /**
   * Get ports with optional filtering
   */
  async getPorts(req, res) {
    try {
      const { search, country, limit, offset } = req.query;
      
      const filters = {
        search: search || '',
        country: country || '',
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };
      
      const result = await PortModel.getPorts(filters);
      
      res.json(result);
    } catch (error) {
      console.error('Error fetching ports:', error);
      res.status(500).json({ error: 'Failed to fetch ports' });
    }
  }

  /**
   * Get a port by ID
   */
  async getPortById(req, res) {
    try {
      const { id } = req.params;
      const port = await PortModel.getPortById(id);
      
      if (!port) {
        return res.status(404).json({ error: 'Port not found' });
      }
      
      res.json(port);
    } catch (error) {
      console.error('Error fetching port:', error);
      res.status(500).json({ error: 'Failed to fetch port' });
    }
  }
}

module.exports = new PortController();
