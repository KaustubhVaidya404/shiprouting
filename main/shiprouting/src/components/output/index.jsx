import React from "react";
import styles from "./output.module.css"; // Import CSS module

const Output = () => {
  return (
    <div className={styles.container}>
      {/* 30% Section */}
      <div className={styles.estimatedArrival}>
        <h3>Estimated Arrival Date</h3>
        <h3>12th October 2024</h3> {/* Placeholder date */}
      </div>

      {/* 70% Section with vertical divider */}
      <div className={styles.details}>
        <div className={styles.squaresContainer}>
          {/* Arrange six small squares */}
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>5000 km</p> {/* Placeholder distance */}
          </div>
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>3000 km</p> {/* Placeholder distance */}
          </div>
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>2000 km</p> {/* Placeholder distance */}
          </div>
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>1000 km</p> {/* Placeholder distance */}
          </div>
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>7000 km</p> {/* Placeholder distance */}
          </div>
          <div className={styles.square}>
            <h4>Total Distance</h4>
            <p>4000 km</p> {/* Placeholder distance */}
          </div>

          {/* Larger square for Estimated Cost, aligned on the right */}
          <div className={styles.largeSquare}>
            <h4>Estimated Cost</h4>
            <p>$15,000</p> {/* Placeholder cost */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
