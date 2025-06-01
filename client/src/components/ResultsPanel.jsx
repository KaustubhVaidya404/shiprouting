import React, { useState } from 'react';

const ResultsPanel = ({ route }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  if (!route) return null;
  
  // Format time display
  const formatTime = (hours) => {
    if (hours === null || hours === undefined) return "N/A";
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days} days, ${remainingHours} hours`;
  };

  // Safe number formatting
  const formatNumber = (value, decimals = 1) => {
    if (value === null || value === undefined) return "N/A";
    return value.toFixed(decimals);
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
      
      <div className="p-4">
        {activeTab === 'summary' && (
          <div>
            <div className="mb-2">
              <span className="font-medium">Total Distance:</span> {formatNumber(route.totalDistanceNm)} nautical miles
            </div>
            <div className="mb-2">
              <span className="font-medium">Estimated Time:</span> {formatTime(route.totalTimeHours)}
            </div>
            <div className="mb-2">
              <span className="font-medium">Number of Waypoints:</span> {route.hops}
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
              className="mb-4 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                // Create CSV content
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
              }}
            >
              Download CSV
            </button>
            
            <div className="bg-gray-100 p-3 rounded overflow-auto max-h-40">
              <pre className="text-xs">{JSON.stringify(route, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
