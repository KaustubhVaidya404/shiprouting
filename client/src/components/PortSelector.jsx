import React, { useState, useEffect } from 'react';
import { fetchPorts } from '../services/api';

const PortSelector = ({ label, value, onChange }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPort, setSelectedPort] = useState(null);
  
  // Fetch port suggestions when search changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const { ports } = await fetchPorts({ search });
        setSuggestions(ports);
      } catch (error) {
        console.error('Error fetching port suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add debounce for search
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search]);
  
  // Handle selection of a port
  const handleSelect = (port) => {
    setSelectedPort(port);
    setSearch(port.name);
    setSuggestions([]);
    onChange(port);
  };
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search ports..."
        />
        
        {isLoading && (
          <div className="absolute right-3 top-2">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-auto">
            {suggestions.map(port => (
              <div
                key={port.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(port)}
              >
                <div className="font-medium">{port.name}</div>
                <div className="text-sm text-gray-500">{port.id} - {port.country}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedPort && (
        <div className="mt-2 text-sm text-gray-500">
          Selected: {selectedPort.name} ({selectedPort.id}) - Lat: {selectedPort.latitude}, Long: {selectedPort.longitude}
        </div>
      )}
    </div>
  );
};

export default PortSelector;
