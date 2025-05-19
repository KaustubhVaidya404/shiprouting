import React, { useState, useEffect } from "react";
import styles from "./input.module.css";
import { getPorts } from "../../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputForm = ({ onSubmit, mapPositions }) => {
  const [formData, setFormData] = useState({
    originCountry: "",
    destinationCountry: "",
    originPort: "",
    destinationPort: "",
    goodsType: "liquid",
    volume: "",
    routeType: {
      shortest: false,
      fastest: false,
      economic: false,
      safest: false,
    },
    departureDate: new Date(),
  });

  const [ports, setPorts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch ports data when component mounts
  useEffect(() => {
    const fetchPortsData = async () => {
      try {
        setLoading(true);
        const portsData = await getPorts();
        setPorts(portsData);
      } catch (error) {
        console.error("Failed to fetch ports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortsData();
  }, []);

  // Update form when map positions change
  useEffect(() => {
    if (mapPositions) {
      // Find the closest ports to the selected positions
      if (ports.length > 0) {
        // This is a simplified approach - in a real app, you'd want a more sophisticated matching
        setFormData(prev => ({
          ...prev,
          originPort: mapPositions.startInfo || prev.originPort,
          destinationPort: mapPositions.endInfo || prev.destinationPort
        }));
      }
    }
  }, [mapPositions, ports]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      routeType: {
        ...formData.routeType,
        [name]: checked,
      },
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      departureDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine form data with map positions
    const submissionData = {
      ...formData,
      startLat: mapPositions?.startLat,
      startLng: mapPositions?.startLng,
      endLat: mapPositions?.endLat,
      endLng: mapPositions?.endLng,
      preferences: formData.routeType
    };
    
    onSubmit(submissionData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h3>Route Parameters</h3>
      </div>
      
      <div className={styles.row}>
        <div className={styles.column}>
          <label>Origin Country</label>
          <input 
            type="text" 
            name="originCountry"
            value={formData.originCountry}
            onChange={handleInputChange}
            placeholder="Origin Country" 
            className={styles.input}
          />
        </div>
        <div className={styles.column}>
          <label>Destination Country</label>
          <input 
            type="text" 
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleInputChange}
            placeholder="Destination Country" 
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.column}>
          <label>Origin Port</label>
          <input 
            type="text" 
            name="originPort"
            value={formData.originPort}
            onChange={handleInputChange}
            placeholder="Origin Port" 
            className={styles.input}
          />
        </div>
        <div className={styles.column}>
          <label>Destination Port</label>
          <input 
            type="text" 
            name="destinationPort"
            value={formData.destinationPort}
            onChange={handleInputChange}
            placeholder="Destination Port" 
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.fullWidth}>
        <label>Types of Goods</label>
        <select 
          name="goodsType"
          value={formData.goodsType}
          onChange={handleInputChange}
          className={styles.select}
        >
          <option value="liquid">Liquid Goods</option>
          <option value="solid">Solid Goods</option>
          <option value="bulk">Bulk Goods</option>
          <option value="electronic">Electronic Goods</option>
          <option value="transportation">Transportation Good</option>
          <option value="mega-bulk">Mega Bulk Goods</option>
          <option value="refrigerated">Refrigerated Goods</option>
          <option value="hazardous">Hazardous Goods</option>
          <option value="livestock">Livestock Goods</option>
        </select>
      </div>

      <div className={styles.fullWidth}>
        <label>Volume (cubic meters)</label>
        <input 
          type="number" 
          name="volume"
          value={formData.volume}
          onChange={handleInputChange}
          placeholder="Volume" 
          className={styles.input}
        />
      </div>

      <div className={styles.fullWidth}>
        <label>Route Type</label>
        <div className={styles.checkboxes}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="shortest"
              checked={formData.routeType.shortest}
              onChange={handleCheckboxChange}
            /> 
            Shortest
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="fastest"
              checked={formData.routeType.fastest}
              onChange={handleCheckboxChange}
            /> 
            Fastest
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="economic"
              checked={formData.routeType.economic}
              onChange={handleCheckboxChange}
            /> 
            Economic
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              name="safest"
              checked={formData.routeType.safest}
              onChange={handleCheckboxChange}
            /> 
            Safest
          </label>
        </div>
      </div>

      <div className={styles.fullWidth}>
        <label>Departure Date</label>
        <DatePicker
          selected={formData.departureDate}
          onChange={handleDateChange}
          className={styles.input}
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit" className={styles.submitButton}>
          Calculate Route
        </button>
      </div>
    </form>
  );
};

export default InputForm;
