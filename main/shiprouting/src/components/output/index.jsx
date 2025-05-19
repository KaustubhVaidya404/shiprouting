import React from "react";
import styles from "./output.module.css"; // Import CSS module

const Output = ({ routeData }) => {
  // If no data is available yet
  if (!routeData || !routeData.metrics) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          Select start and end points on the map and calculate a route to see the results.
        </div>
      </div>
    );
  }
  
  const { metrics } = routeData;

  return (
    <div className={styles.container}>
      {/* 30% Section */}
      <div className={styles.estimatedArrival}>
        <h3>Estimated Arrival</h3>
        <h3>{metrics.estimatedArrival}</h3>
      </div>

      {/* 70% Section with details */}
      <div className={styles.details}>
        <div className={styles.squaresContainer}>
          {/* Metrics in small squares */}
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>{metrics.totalDistance} km</p>
          </div>
          <div className={styles.square}>
            <h4>Travel Time</h4>
            <p>{metrics.travelTime} hours</p>
          </div>
          <div className={styles.square}>
            <h4>Fuel Consumption</h4>
            <p>{metrics.fuelConsumption} units</p>
          </div>
          <div className={styles.square}>
            <h4>CO₂ Emissions</h4>
            <p>{metrics.co2Emissions} tons</p>
          </div>
          <div className={styles.square}>
            <h4>Port Fees</h4>
            <p>${metrics.portFees}</p>
          </div>
          <div className={styles.square}>
            <h4>Waypoints</h4>
            <p>{(routeData.route?.length || 2) - 2}</p>
          </div>
        </div>

        {/* Larger square for Estimated Cost */}
        <div className={styles.largeSquare}>
          <h4>Estimated Total Cost</h4>
          <p>${metrics.estimatedCost.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Output;
