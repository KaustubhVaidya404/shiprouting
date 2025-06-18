import React from 'react';

const ParameterControls = ({ weights, avoid, onWeightsChange, onAvoidChange }) => {
  // Handle weight slider changes
  const handleWeightChange = (key, value) => {
    const newValue = parseFloat(value);
    
    // Update the changed weight
    const updatedWeights = { ...weights, [key]: newValue };
    
    // Normalize weights to sum to 1.0
    const sum = Object.values(updatedWeights).reduce((acc, val) => acc + val, 0);
    
    if (sum !== 0) {
      // Normalize only if sum is not zero
      const normalizedWeights = {};
      for (const [k, v] of Object.entries(updatedWeights)) {
        normalizedWeights[k] = v / sum;
      }
      onWeightsChange(normalizedWeights);
    } else {
      // If all weights are 0, reset to defaults
      onWeightsChange({
        distance: 0.5,
        time: 0.3,
        risk: 0.1,
        cargoPenalty: 0.1
      });
    }
  };

  // Handle toggle changes
  const handleToggleChange = (key) => {
    onAvoidChange({ ...avoid, [key]: !avoid[key] });
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Routing Parameters</h3>
      
      {/* Weight sliders */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Priority Weights</h4>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="distance-weight" className="text-sm">Distance Weight</label>
            <span className="text-sm font-medium">{(weights.distance * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            id="distance-weight"
            min="0"
            max="1"
            step="0.01"
            value={weights.distance}
            onChange={(e) => handleWeightChange('distance', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Distance Weight"
          />
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="time-weight" className="text-sm">Time Weight</label>
            <span className="text-sm font-medium">{(weights.time * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            id="time-weight"
            min="0"
            max="1"
            step="0.01"
            value={weights.time}
            onChange={(e) => handleWeightChange('time', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Time Weight"
          />
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="risk-weight" className="text-sm">Risk Weight</label>
            <span className="text-sm font-medium">{(weights.risk * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            id="risk-weight"
            min="0"
            max="1"
            step="0.01"
            value={weights.risk}
            onChange={(e) => handleWeightChange('risk', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Risk Weight"
          />
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="cargo-penalty-weight" className="text-sm">Cargo Penalty Weight</label>
            <span className="text-sm font-medium">{(weights.cargoPenalty * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            id="cargo-penalty-weight"
            min="0"
            max="1"
            step="0.01"
            value={weights.cargoPenalty}
            onChange={(e) => handleWeightChange('cargoPenalty', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Cargo Penalty Weight"
          />
        </div>
      </div>
      
      {/* Avoidance toggles */}
      <div>
        <h4 className="text-md font-medium mb-2">Avoidance Options</h4>
        
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="avoid-suez"
            checked={avoid.suez}
            onChange={() => handleToggleChange('suez')}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            aria-label="Avoid Suez Canal"
          />
          <label htmlFor="avoid-suez" className="ml-2 text-sm font-medium text-gray-700">
            Avoid Suez Canal
          </label>
        </div>
        
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="avoid-panama"
            checked={avoid.panama}
            onChange={() => handleToggleChange('panama')}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            aria-label="Avoid Panama Canal"
          />
          <label htmlFor="avoid-panama" className="ml-2 text-sm font-medium text-gray-700">
            Avoid Panama Canal
          </label>
        </div>
        
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="avoid-piracy"
            checked={avoid.piracy}
            onChange={() => handleToggleChange('piracy')}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            aria-label="Avoid High Piracy Risk Zones"
          />
          <label htmlFor="avoid-piracy" className="ml-2 text-sm font-medium text-gray-700">
            Avoid High Piracy Risk Zones
          </label>
        </div>

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="avoid-weather"
            checked={avoid.weather || false}
            onChange={() => onAvoidChange({ ...avoid, weather: !avoid.weather })}
            className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
            aria-label="Avoid Severe Weather"
          />
          <label htmlFor="avoid-weather" className="ml-2 text-sm font-medium text-gray-700">
            Avoid Severe Weather
          </label>
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;
