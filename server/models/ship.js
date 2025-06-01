const db = require('./db');

class ShipModel {
  /**
   * Get all ship types
   * @returns {Promise<Array>} Array of ship types
   */
  async getAllShipTypes() {
    const result = await db.query('SELECT * FROM ship_types');
    return result.rows;
  }

  /**
   * Get ship type by ID
   * @param {string} id - Ship type ID
   * @returns {Promise<Object>} Ship type data
   */
  async getShipTypeById(id) {
    const result = await db.query('SELECT * FROM ship_types WHERE id = $1', [id]);
    return result.rows[0];
  }

  /**
   * Get all cargo types
   * @returns {Promise<Array>} Array of cargo types
   */
  async getAllCargoTypes() {
    const result = await db.query('SELECT * FROM cargo_types');
    return result.rows;
  }

  /**
   * Get cargo type by ID
   * @param {string} id - Cargo type ID
   * @returns {Promise<Object>} Cargo type data
   */
  async getCargoTypeById(id) {
    const result = await db.query('SELECT * FROM cargo_types WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new ShipModel();
