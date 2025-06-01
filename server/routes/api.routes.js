const express = require('express');
const router = express.Router();

const PortController = require('../controllers/port.controller');
const ShipController = require('../controllers/ship.controller');
const RouteController = require('../controllers/route.controller');

// Port routes
router.get('/ports', PortController.getPorts);
router.get('/ports/:id', PortController.getPortById);

// Ship and cargo type routes
router.get('/ship-types', ShipController.getShipTypes);
router.get('/cargo-types', ShipController.getCargoTypes);

// Route computation
router.post('/compute-route', RouteController.computeRoute);

module.exports = router;
