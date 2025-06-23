const PathfindingService = require('../services/pathfinding');

class RouteController {
  /**
   * Compute a route based on input parameters
   */
  async computeRoute(req, res) {
    try {
      const {
        startPortId,
        endPortId,
        shipTypeId,
        cargoTypeId,
        weights,
        avoid
      } = req.body;
      
      // Validate required fields
      if (!startPortId || !endPortId || !shipTypeId || !cargoTypeId) {
        return res.status(400).json({ 
          error: 'Missing required parameters: startPortId, endPortId, shipTypeId, cargoTypeId are required' 
        });
      }
      
      const result = await PathfindingService.computeRoute({
        startPortId,
        endPortId,
        shipTypeId,
        cargoTypeId,
        weights,
        avoid
      });

      // Add fuel consumption to response if available
      if (result.route && result.route.nodes && result.route.nodes.length > 0) {
        result.route.totalFuelTons = result.route.nodes[result.route.nodes.length - 1].fuelTons || null;
      }

      res.json(result);
    } catch (error) {
      console.error('Error computing route:', error);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message.includes('No valid route found')) {
        return res.status(422).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to compute route' });
    }
  }
}

module.exports = new RouteController();
