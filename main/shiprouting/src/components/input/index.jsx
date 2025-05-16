import React from "react";
import styles from "./input.module.css"

const Valss = () => {
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <div className={styles.column}>
          <label>Origin Country</label>
          <input type="text" placeholder="Origin Country" />
        </div>
        <div className={styles.column}>
          <label>Destination Country</label>
          <input type="text" placeholder="Destination Country" />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.column}>
          <label>Origin Port</label>
          <input type="text" placeholder="Origin Port" />
        </div>
        <div className={styles.column}>
          <label>Destination Port</label>
          <input type="text" placeholder="Destination Port" />
        </div>
      </div>

      <div className={styles.fullWidth}>
        <label>Types of Goods</label>
        <select>
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
        <label>Volume</label>
        <input type="text" placeholder="Volume" />
      </div>

      <div className={styles.fullWidth}>
        <label>Route Type</label>
        <div className={styles.checkboxes}>
          <label>
            <input type="checkbox" value="shortest" /> Shortest
          </label>
          <label>
            <input type="checkbox" value="fastest" /> Fastest
          </label>
          <label>
            <input type="checkbox" value="economic" /> Economic
          </label>
          <label>
            <input type="checkbox" value="safest" /> Safest
          </label>
        </div>
      </div>

      <div className={styles.fullWidth}>
        <label>Departure Date</label>
        <input type="text" placeholder="Departure Date" />
      </div>
    </form>
  );
};

export default Valss;
