import React, { useEffect, useState } from 'react';
import { FaShip, FaRegClock, FaMapMarkedAlt, FaDownload, FaTable, FaChartBar } from 'react-icons/fa';
import { fetchWeather } from '../services/api';

const ResultsPanel = ({ route }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [startWeather, setStartWeather] = useState(null);
  const [endWeather, setEndWeather] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!route || !route.nodes || route.nodes.length === 0) return;
      try {
        const start = route.nodes[0];
        const end = route.nodes[route.nodes.length - 1];
        const [w1, w2] = await Promise.all([
          fetchWeather(start.latitude, start.longitude),
          fetchWeather(end.latitude, end.longitude)
        ]);
        setStartWeather(w1);
        setEndWeather(w2);
      } catch {
        setStartWeather(null);
        setEndWeather(null);
      }
    };
    fetchWeatherData();
  }, [route]);

  if (!route) return null;
  
  // Format time display
  const formatTime = (hours) => {
    if (hours === null || hours === undefined) return "N/A";
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days} days, ${remainingHours} hours`;
  };

  // Safe number formatting - improved to handle string values
  const formatNumber = (value, decimals = 1) => {
    // First ensure value is a number (convert from string if needed)
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    
    // Check if we have a valid number after conversion
    if (isNaN(num) || num === null || num === undefined) {
      console.log('Invalid number value:', value); // Debug log
      return "N/A";
    }
    
    return num.toFixed(decimals);
  };

  // Debug log to inspect route object
  console.log('Route object:', route);
  console.log('Total distance type:', typeof route.totalDistanceNm);
  console.log('Total distance value:', route.totalDistanceNm);

  // Handle CSV download
  const handleDownloadCsv = () => {
    if (!route.nodes || route.nodes.length === 0) return;
    
    const headers = "Port,ID,Latitude,Longitude,Distance (nm),ETA (hours)\n";
    const rows = route.nodes.map(node => 
      `${node.name || 'Unknown'},${node.portId || 'N/A'},${node.latitude || 0},${node.longitude || 0},${node.cumulativeDistanceNm || 0},${node.etaHours || 0}`
    ).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'route_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">Route Results</h3>
      </div>
      
      <div className="flex border-b">
        <button
          className={`py-2 px-4 flex-1 text-center ${activeTab === 'summary' ? 'bg-white font-medium' : 'bg-gray-50'}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`py-2 px-4 flex-1 text-center ${activeTab === 'waypoints' ? 'bg-white font-medium' : 'bg-gray-50'}`}
          onClick={() => setActiveTab('waypoints')}
        >
          Waypoints
        </button>
        <button
          className={`py-2 px-4 flex-1 text-center ${activeTab === 'export' ? 'bg-white font-medium' : 'bg-gray-50'}`}
          onClick={() => setActiveTab('export')}
        >
          Export
        </button>
      </div>
      
      <div className="p-5">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-blue-500 mb-1">Total Distance</div>
                <div className="text-2xl font-bold text-blue-800">
                  {route.totalDistanceNm ? formatNumber(route.totalDistanceNm) : "N/A"} nm
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-green-500 mb-1">Estimated Time</div>
                <div className="text-2xl font-bold text-green-800">{formatTime(route.totalTimeHours)}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="text-purple-500 mb-1">Waypoints</div>
                <div className="text-2xl font-bold text-purple-800">{route.hops}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-sky-50 p-3 rounded border">
                <div className="font-medium mb-1">Start Port Weather</div>
                {startWeather ? (
                  <div>
                    <img src={`https://openweathermap.org/img/wn/${startWeather.weather.icon}@2x.png`} alt={startWeather.weather.description} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    <span className="ml-2">{startWeather.weather.main}, {startWeather.temp}°C, Wind: {startWeather.wind.speed} m/s</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
              <div className="bg-sky-50 p-3 rounded border">
                <div className="font-medium mb-1">End Port Weather</div>
                {endWeather ? (
                  <div>
                    <img src={`https://openweathermap.org/img/wn/${endWeather.weather.icon}@2x.png`} alt={endWeather.weather.description} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    <span className="ml-2">{endWeather.weather.main}, {endWeather.temp}°C, Wind: {endWeather.wind.speed} m/s</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'waypoints' && (
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {route.nodes && route.nodes.map((node, index) => (
                  <tr key={`${node.portId || 'port'}-${index}`}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">{node.name || 'Unknown'} ({node.portId || 'N/A'})</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{formatNumber(node.cumulativeDistanceNm)} nm</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{formatTime(node.etaHours)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'export' && (
          <div>
            <button 
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
              onClick={handleDownloadCsv}
            >
              <FaDownload className="mr-2" /> Download as CSV
            </button>
            
            <div className="flex flex-col space-y-2">
              <div className="font-medium text-slate-700 flex items-center">
                <FaTable className="mr-2" /> Raw Route Data:
              </div>
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200 overflow-auto max-h-40">
                <pre className="text-xs">{JSON.stringify(route, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
