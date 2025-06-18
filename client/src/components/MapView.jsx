import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchWeather } from '../services/api';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Define custom icons for different port types
const defaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Fix default icon for all markers
L.Marker.prototype.options.icon = defaultIcon;

// Map controller component to handle view changes
function MapViewController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
}

const MapView = ({ route, isLoading }) => {
  const [mapCenter, setMapCenter] = useState([20, 0]); // Default center
  const [zoom, setZoom] = useState(2); // Default zoom
  const mapRef = useRef(null);
  const [weatherData, setWeatherData] = useState({});

  // Update map center when route changes
  useEffect(() => {
    if (route && route.nodes && route.nodes.length > 0) {
      // Center map on first node
      const firstNode = route.nodes[0];
      if (firstNode && firstNode.latitude && firstNode.longitude) {
        setMapCenter([firstNode.latitude, firstNode.longitude]);
        setZoom(4);
      }
    }
  }, [route]);

  // Fetch weather for route nodes
  useEffect(() => {
    const fetchAllWeather = async () => {
      if (!route || !route.nodes) return;
      const promises = route.nodes.map(async (node) => {
        if (!node.latitude || !node.longitude) return null;
        try {
          const weather = await fetchWeather(node.latitude, node.longitude);
          return { portId: node.portId, weather };
        } catch {
          return null;
        }
      });
      const results = await Promise.all(promises);
      const weatherMap = {};
      results.forEach(item => {
        if (item && item.portId) weatherMap[item.portId] = item.weather;
      });
      setWeatherData(weatherMap);
    };
    fetchAllWeather();
  }, [route]);

  // Extract route coordinates for the polyline
  const getRouteCoordinates = () => {
    if (!route || !route.nodes) return [];
    return route.nodes
      .filter(node => node && node.latitude != null && node.longitude != null)
      .map(node => [node.latitude, node.longitude]);
  };

  // Safe number formatting
  const formatNumber = (value, decimals = 4) => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(decimals);
  };

  return (
    <div className="h-full w-full relative" style={{ minHeight: '500px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-[1000]">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Calculating optimal route...</p>
          </div>
        </div>
      )}

      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        ref={mapRef}
      >
        <MapViewController center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {route && route.nodes && route.nodes.map((node, index) => {
          if (!node || node.latitude == null || node.longitude == null) return null;
          const weather = weatherData[node.portId];
          return (
            <Marker 
              key={`${node.portId || 'port'}-${index}`}
              position={[node.latitude, node.longitude]} 
              icon={defaultIcon}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{node.name || 'Unknown'} ({node.portId || 'N/A'})</h3>
                  <p>Position: {formatNumber(node.latitude)}, {formatNumber(node.longitude)}</p>
                  <p>Distance from start: {formatNumber(node.cumulativeDistanceNm, 1)} nm</p>
                  <p>ETA: {node.etaHours != null ? `${(node.etaHours / 24).toFixed(1)} days (${formatNumber(node.etaHours, 1)} hours)` : 'N/A'}</p>
                  {weather && (
                    <div className="mt-2">
                      <div>
                        <img src={`https://openweathermap.org/img/wn/${weather.weather.icon}@2x.png`} alt={weather.weather.description} style={{ display: 'inline', verticalAlign: 'middle' }} />
                        <span className="ml-2">{weather.weather.main}, {weather.temp}°C, Wind: {weather.wind.speed} m/s</span>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
              <Tooltip permanent={index === 0 || index === (route.nodes.length - 1)}>
                {node.name || 'Unknown Port'}
              </Tooltip>
            </Marker>
          );
        })}
        
        {route && route.nodes && route.nodes.length > 1 && (
          <Polyline 
            positions={getRouteCoordinates()} 
            color="blue" 
            weight={3} 
            opacity={0.7}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
