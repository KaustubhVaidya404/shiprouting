import React, { useState, useEffect } from 'react';
import PortSelector from './PortSelector';
import ParameterControls from './ParameterControls';
import ResultsPanel from './ResultsPanel';
import MapView from './MapView';
import { fetchShipTypes, fetchCargoTypes, computeRoute } from '../services/api';

const RoutePlanner = () => {
  const [startPort, setStartPort] = useState(null);
  const [endPort, setEndPort] = useState(null);
  const [shipTypes, setShipTypes] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [selectedShipType, setSelectedShipType] = useState('');
  const [selectedCargoType, setSelectedCargoType] = useState('');
  const [weights, setWeights] = useState({
    distance: 0.5,
    time: 0.3,
    risk: 0.1,
    cargoPenalty: 0.1
  });
  const [avoid, setAvoid] = useState({
    suez: false,
    panama: false,
    piracy: true
  });
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch ship and cargo types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shipTypesData, cargoTypesData] = await Promise.all([
          fetchShipTypes(),
          fetchCargoTypes()
        ]);
        setShipTypes(shipTypesData.shipTypes);
        setCargoTypes(cargoTypesData.cargoTypes);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError('Failed to load ship or cargo types. Please refresh and try again.');
      }
    };
    
    fetchData();
  }, []);
  
  // Handle form submission
  const handleCalculateRoute = async () => {
    if (!startPort || !endPort || !selectedShipType || !selectedCargoType) {
      setError('Please select all required fields: start port, destination port, ship type, and cargo type.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await computeRoute({
        startPortId: startPort.id,
        endPortId: endPort.id,
        shipTypeId: selectedShipType,
        cargoTypeId: selectedCargoType,
        weights,
        avoid
      });
      
      setRouteResult(result.route);
    } catch (error) {
      console.error('Error calculating route:', error);
      setError(error.response?.data?.error || 'Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetForm = () => {
    setStartPort(null);
    setEndPort(null);
    setSelectedShipType('');
    setSelectedCargoType('');
    setWeights({
      distance: 0.5,
      time: 0.3,
      risk: 0.1,
      cargoPenalty: 0.1
    });
    setAvoid({
      suez: false,
      panama: false,
      piracy: true
    });
    setRouteResult(null);
    setError('');
  };
  
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Left Panel */}
      <div className="w-full md:w-1/3 p-4 bg-gray-50 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Route Planner</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Port Selection</h3>
          <PortSelector 
            label="Start Port" 
            value={startPort} 
            onChange={setStartPort} 
          />
          <PortSelector 
            label="Destination Port" 
            value={endPort} 
            onChange={setEndPort} 
          />
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ship & Cargo</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ship Type</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedShipType}
              onChange={(e) => setSelectedShipType(e.target.value)}
            >
              <option value="">Select Ship Type</option>
              {shipTypes.map(ship => (
                <option key={ship.id} value={ship.id}>
                  {ship.name} (Max Draft: {ship.max_draft_m}m, Speed: {ship.max_speed_knots}kts)
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Type</label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCargoType}
              onChange={(e) => setSelectedCargoType(e.target.value)}
            >
              <option value="">Select Cargo Type</option>
              {cargoTypes.map(cargo => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.name}
                </option>
              ))}
            </select>
            {selectedCargoType && (
              <p className="text-sm text-gray-500 mt-1">
                {cargoTypes.find(c => c.id === selectedCargoType)?.notes || ''}
              </p>
            )}
          </div>
        </div>
        
        <ParameterControls 
          weights={weights} 
          avoid={avoid}
          onWeightsChange={setWeights}
          onAvoidChange={setAvoid}
        />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            onClick={handleCalculateRoute}
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Route'}
          </button>
          
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleResetForm}
            disabled={loading}
          >
            Reset
          </button>
        </div>
        
        {routeResult && (
          <ResultsPanel route={routeResult} />
        )}
      </div>
      
      {/* Map Panel */}
      <div className="w-full md:w-2/3 h-[500px] md:h-[800px]">
        <MapView route={routeResult} isLoading={loading} />
      </div>
    </div>
  );
};

export default RoutePlanner;
