import React, { useState } from "react";
import MapComponent from "./components/Map";
import InputForm from "./components/input/index.jsx";
import Output from "./components/output/index.jsx";
import { calculateRoute } from "./api";
import "./App.css";

function App() {
  const [mapPositions, setMapPositions] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePositionsChange = (positions) => {
    setMapPositions(positions);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate the data
      if (!mapPositions?.startLat || !mapPositions?.endLat) {
        setError("Please select start and end points on the map");
        return;
      }
      
      const result = await calculateRoute(formData);
      setRouteData(result);
    } catch (err) {
      setError(`Error calculating route: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Ship Routing Optimizer</h1>
        <p>Find the optimal maritime routes across the Indian Ocean</p>
      </header>

      <main className="app-main">
        <div className="app-section">
          <h2 className="section-title">Route Planning</h2>
          <div className="two-column-layout">
            <div className="map-column">
              <MapComponent 
                onPositionsChange={handlePositionsChange} 
                routeData={routeData}
              />
            </div>
            <div className="form-column">
              <InputForm 
                onSubmit={handleFormSubmit} 
                mapPositions={mapPositions}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="loading-indicator">
            Calculating optimal route...
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="app-section">
          <h2 className="section-title">Route Analysis</h2>
          <Output routeData={routeData} />
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2023 Ship Routing Optimizer | A maritime logistics solution</p>
      </footer>
    </div>
  );
}

export default App;
