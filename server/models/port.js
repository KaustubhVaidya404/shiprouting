const db = require('./db');

class PortModel {
  /**
   * Get all ports with optional filtering
   * @param {Object} filters - Optional filter parameters
   * @param {string} filters.search - Search by name or ID
   * @param {string} filters.country - Filter by country code
   * @param {number} filters.limit - Max number of results
   * @param {number} filters.offset - Pagination offset
   * @returns {Promise<Array>} Array of ports
   */
  async getPorts(filters = {}) {
    const { search, country, limit = 50, offset = 0 } = filters;
    
    let query = 'SELECT * FROM ports';
    const queryParams = [];
    
    // Build WHERE clause based on filters
    const conditions = [];
    
    if (search) {
      queryParams.push(`%${search}%`);
      queryParams.push(`%${search}%`);
      conditions.push(`(name ILIKE $${queryParams.length - 1} OR id ILIKE $${queryParams.length})`);
    }
    
    if (country) {
      queryParams.push(country);
      conditions.push(`country = $${queryParams.length}`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add pagination
    queryParams.push(limit);
    queryParams.push(offset);
    query += ` ORDER BY name LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
    
    // Get ports
    const result = await db.query(query, queryParams);
    
    // Get total count for pagination
    const countResult = await db.query('SELECT COUNT(*) FROM ports');
    
    return {
      ports: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  /**
   * Get a single port by ID
   * @param {string} id - Port ID
   * @returns {Promise<Object>} Port data
   */
  async getPortById(id) {
    const result = await db.query('SELECT * FROM ports WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = new PortModel();
