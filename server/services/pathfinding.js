const EdgeModel = require('../models/edge');
const PortModel = require('../models/port');
const ShipModel = require('../models/ship');

class PathfindingService {
  /**
   * Calculate the Haversine distance between two points (great-circle distance)
   * @param {number} lat1 - Latitude of point 1 in degrees
   * @param {number} lon1 - Longitude of point 1 in degrees
   * @param {number} lat2 - Latitude of point 2 in degrees
   * @param {number} lon2 - Longitude of point 2 in degrees
   * @returns {number} Distance in nautical miles
   */
  haversineDistance(lat1, lon1, lat2, lon2) {
    // Convert degrees to radians
    const toRad = (value) => (value * Math.PI) / 180;
    
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    // Earth radius in nautical miles
    const R = 3440.065; // 6371 km converted to nautical miles
    return R * c;
  }

  /**
   * Compute route using A* algorithm
   * @param {Object} params - Route parameters
   * @returns {Promise<Object>} Computed route
   */
  async computeRoute(params) {
    const {
      startPortId,
      endPortId,
      shipTypeId,
      cargoTypeId,
      weights = { distance: 0.5, time: 0.3, risk: 0.1, cargoPenalty: 0.1 },
      avoid = { suez: false, panama: false, piracy: false }
    } = params;

    // Validate ports
    const startPort = await PortModel.getPortById(startPortId);
    const endPort = await PortModel.getPortById(endPortId);
    
    if (!startPort || !endPort) {
      throw new Error('Start or end port not found');
    }
    
    // Get ship data
    const shipType = await ShipModel.getShipTypeById(shipTypeId);
    if (!shipType) {
      throw new Error(`Ship type not found: ${shipTypeId}`);
    }
    
    // Get valid edges based on ship and cargo
    const validEdges = await EdgeModel.getValidEdges(shipTypeId, cargoTypeId);
    
    // Build graph representation
    const graph = this.buildGraph(validEdges, avoid);
    
    // Run A* algorithm
    const route = this.aStarSearch(
      graph,
      startPortId,
      endPortId,
      startPort,
      endPort,
      shipType,
      weights
    );
    
    if (!route) {
      throw new Error('No valid route found with given constraints');
    }
    
    return this.formatRouteResponse(route, startPort, endPort, shipType);
  }

  /**
   * Build graph representation from edges
   * @param {Array} edges - Array of edge objects
   * @param {Object} avoid - Avoidance flags for canals
   * @returns {Object} Graph representation
   */
  buildGraph(edges, avoid) {
    const graph = {};
    
    // Process each edge
    edges.forEach(edge => {
      // Skip edges based on avoidance flags
      if ((avoid.suez && edge.is_canal_suez) || 
          (avoid.panama && edge.is_canal_panama) || 
          (avoid.piracy && edge.risk_factor > 0.6)) {
        return;
      }
      
      // Initialize node if not exists
      if (!graph[edge.start_port_id]) {
        graph[edge.start_port_id] = {
          neighbors: [],
          lat: edge.start_lat,
          long: edge.start_long,
          name: edge.start_port_name
        };
      }
      
      // Add edge to graph
      graph[edge.start_port_id].neighbors.push({
        node: edge.end_port_id,
        distance: edge.distance_nm,
        risk: edge.risk_factor,
        lat: edge.end_lat,
        long: edge.end_long,
        name: edge.end_port_name,
        depth: edge.min_depth_m,
        isCanalSuez: edge.is_canal_suez,
        isCanalPanama: edge.is_canal_panama
      });
    });
    
    return graph;
  }

  /**
   * A* search algorithm implementation
   * @param {Object} graph - Graph representation
   * @param {string} start - Start node ID
   * @param {string} goal - Goal node ID
   * @param {Object} startPort - Start port data
   * @param {Object} endPort - End port data
   * @param {Object} shipType - Ship type data
   * @param {Object} weights - Weight parameters for cost function
   * @returns {Object|null} Path or null if no path found
   */
  aStarSearch(graph, start, goal, startPort, endPort, shipType, weights) {
    // Priority queue using a simple array with sort
    const openSet = [{ 
      node: start, 
      gScore: 0, 
      fScore: this.heuristic(startPort, endPort, shipType),
      path: [start],
      cumulativeDistance: 0,
      etaHours: 0
    }];
    
    // Set of visited nodes
    const closedSet = new Set();
    
    while (openSet.length > 0) {
      // Sort by fScore and take the lowest one
      openSet.sort((a, b) => a.fScore - b.fScore);
      const current = openSet.shift();
      
      // If goal reached, return the path
      if (current.node === goal) {
        return current;
      }
      
      // Mark as visited
      closedSet.add(current.node);
      
      // If node not in graph, skip
      if (!graph[current.node]) {
        continue;
      }
      
      // Check neighbors
      for (const neighbor of graph[current.node].neighbors) {
        // Skip if already visited
        if (closedSet.has(neighbor.node)) {
          continue;
        }
        
        // Calculate cost components
        const distanceCost = weights.distance * neighbor.distance;
        const timeCost = weights.time * (neighbor.distance / shipType.max_speed_knots);
        const riskCost = weights.risk * neighbor.risk * neighbor.distance;
        
        // For canal tolls or other special penalties
        let cargoPenalty = 0;
        if (neighbor.isCanalSuez) cargoPenalty += 100;
        if (neighbor.isCanalPanama) cargoPenalty += 100;
        
        // Total edge cost
        const edgeCost = distanceCost + timeCost + riskCost + (weights.cargoPenalty * cargoPenalty);
        
        // Calculate new g-score
        const tentativeGScore = current.gScore + edgeCost;
        
        // Find if neighbor is already in open set
        const neighborInOpenSet = openSet.find(item => item.node === neighbor.node);
        
        if (!neighborInOpenSet || tentativeGScore < neighborInOpenSet.gScore) {
          // Calculate distance and time
          const cumulativeDistance = current.cumulativeDistance + neighbor.distance;
          const etaHours = current.etaHours + (neighbor.distance / shipType.max_speed_knots);
          
          // Get neighbor port information
          const neighborPortData = {
            latitude: neighbor.lat,
            longitude: neighbor.long
          };
          
          // Calculate heuristic
          const hValue = this.heuristic(neighborPortData, endPort, shipType);
          
          // Create node data
          const nodeData = {
            node: neighbor.node,
            gScore: tentativeGScore,
            fScore: tentativeGScore + hValue,
            path: [...current.path, neighbor.node],
            cumulativeDistance: cumulativeDistance,
            etaHours: etaHours
          };
          
          // Update or add to open set
          if (neighborInOpenSet) {
            const index = openSet.indexOf(neighborInOpenSet);
            openSet[index] = nodeData;
          } else {
            openSet.push(nodeData);
          }
        }
      }
    }
    
    // No path found
    return null;
  }

  /**
   * Calculate heuristic (estimated cost to goal)
   * @param {Object} current - Current port data with lat/long
   * @param {Object} goal - Goal port data with lat/long
   * @param {Object} shipType - Ship type data
   * @returns {number} Heuristic value
   */
  heuristic(current, goal, shipType) {
    // Use Haversine distance as base heuristic
    const distance = this.haversineDistance(
      current.latitude, current.longitude,
      goal.latitude, goal.longitude
    );
    
    // Estimate time in hours
    const timeEstimate = distance / shipType.max_speed_knots;
    
    // Combined heuristic
    return distance + timeEstimate;
  }

  /**
   * Format route response for API
   * @param {Object} routeResult - A* search result
   * @param {Object} startPort - Start port data
   * @param {Object} endPort - End port data
   * @param {Object} shipType - Ship type data
   * @returns {Object} Formatted route response
   */
  async formatRouteResponse(routeResult, startPort, endPort, shipType) {
    // Get all ports in the path
    const portIds = routeResult.path;
    const nodes = [];
    
    // Add start port
    nodes.push({
      portId: startPort.id,
      name: startPort.name,
      latitude: parseFloat(startPort.latitude),
      longitude: parseFloat(startPort.longitude),
      cumulativeDistanceNm: 0,
      etaHours: 0
    });
    
    // Add intermediate waypoints
    let currentDistance = 0;
    let currentEta = 0;
    
    for (let i = 1; i < portIds.length; i++) {
      const portId = portIds[i];
      if (portId === startPort.id) continue; // Skip if it's the start port again
      
      const port = await PortModel.getPortById(portId);
      
      // Calculate segment distance between previous port and current port
      const prevPort = await PortModel.getPortById(portIds[i-1]);
      const segmentDistance = this.haversineDistance(
        parseFloat(prevPort.latitude), 
        parseFloat(prevPort.longitude),
        parseFloat(port.latitude), 
        parseFloat(port.longitude)
      );
      
      // Update cumulative values
      currentDistance += segmentDistance;
      currentEta += segmentDistance / shipType.max_speed_knots;
      
      nodes.push({
        portId: port.id,
        name: port.name,
        latitude: parseFloat(port.latitude),
        longitude: parseFloat(port.longitude),
        cumulativeDistanceNm: Math.round(currentDistance * 100) / 100,
        etaHours: Math.round(currentEta * 10) / 10
      });
    }
    
    // Use the final node's values for total distance/time
    const totalDistance = nodes.length > 1 ? nodes[nodes.length-1].cumulativeDistanceNm : 0;
    const totalTime = nodes.length > 1 ? nodes[nodes.length-1].etaHours : 0;
    
    // For debugging
    console.log('Total distance calculated:', totalDistance);
    console.log('A* cumulative distance:', routeResult.cumulativeDistance);
    
    return {
      route: {
        nodes,
        totalDistanceNm: totalDistance,
        totalTimeHours: totalTime,
        hops: nodes.length - 1
      }
    };
  }
}

module.exports = new PathfindingService();
