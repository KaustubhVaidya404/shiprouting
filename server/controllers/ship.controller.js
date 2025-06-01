const ShipModel = require('../models/ship');

class ShipController {
  /**
   * Get all ship types
   */
  async getShipTypes(req, res) {
    try {
      const shipTypes = await ShipModel.getAllShipTypes();
      res.json({ shipTypes });
    } catch (error) {
      console.error('Error fetching ship types:', error);
      res.status(500).json({ error: 'Failed to fetch ship types' });
    }
  }

  /**
   * Get all cargo types
   */
  async getCargoTypes(req, res) {
    try {
      const cargoTypes = await ShipModel.getAllCargoTypes();
      res.json({ cargoTypes });
    } catch (error) {
      console.error('Error fetching cargo types:', error);
      res.status(500).json({ error: 'Failed to fetch cargo types' });
    }
  }
}

module.exports = new ShipController();
