const db = require('./db');

class EdgeModel {
  /**
   * Get all edges (shipping lanes)
   * @returns {Promise<Array>} Array of edges
   */
  async getAllEdges() {
    const result = await db.query('SELECT * FROM edges');
    return result.rows;
  }

  /**
   * Get edges from a specific port
   * @param {string} portId - Starting port ID
   * @returns {Promise<Array>} Array of edges from the port
   */
  async getEdgesFromPort(portId) {
    const result = await db.query(
      'SELECT e.*, p.name as end_port_name, p.latitude as end_lat, p.longitude as end_long ' +
      'FROM edges e ' +
      'JOIN ports p ON e.end_port_id = p.id ' +
      'WHERE e.start_port_id = $1',
      [portId]
    );
    return result.rows;
  }

  /**
   * Get edges with restrictions based on ship and cargo type
   * @param {string} shipTypeId - Ship type ID
   * @param {string} cargoTypeId - Cargo type ID
   * @returns {Promise<Array>} Array of valid edges for the ship/cargo combination
   */
  async getValidEdges(shipTypeId, cargoTypeId) {
    // Get ship draft
    const shipResult = await db.query('SELECT max_draft_m FROM ship_types WHERE id = $1', [shipTypeId]);
    if (shipResult.rows.length === 0) {
      throw new Error(`Ship type not found: ${shipTypeId}`);
    }
    const shipDraft = shipResult.rows[0].max_draft_m;

    // Get cargo forbidden edges
    const cargoResult = await db.query('SELECT forbidden_edges FROM cargo_types WHERE id = $1', [cargoTypeId]);
    if (cargoResult.rows.length === 0) {
      throw new Error(`Cargo type not found: ${cargoTypeId}`);
    }
    const forbiddenEdges = cargoResult.rows[0].forbidden_edges || [];

    // Query for valid edges
    let query = `
      SELECT e.*, 
             start_p.name as start_port_name, start_p.latitude as start_lat, start_p.longitude as start_long,
             end_p.name as end_port_name, end_p.latitude as end_lat, end_p.longitude as end_long
      FROM edges e
      JOIN ports start_p ON e.start_port_id = start_p.id
      JOIN ports end_p ON e.end_port_id = end_p.id
      WHERE e.min_depth_m >= $1
    `;

    const queryParams = [shipDraft];
    
    // Add cargo restrictions
    if (forbiddenEdges.length > 0) {
      query += ` AND e.id != ALL($2)`;
      queryParams.push(forbiddenEdges);
    }
    
    // Add hazardous cargo check
    if (cargoTypeId.startsWith('HAZ_')) {
      query += ` AND e.forbidden_for_hazard = FALSE`;
    }
    
    const result = await db.query(query, queryParams);
    return result.rows;
  }
}

module.exports = new EdgeModel();
