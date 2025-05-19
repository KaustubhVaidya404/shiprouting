import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./map.module.css";

// Fix for Leaflet default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create a custom icon using emoji
const createEmojiIcon = (emoji) => {
  return new L.DivIcon({
    html: `<div style="font-size: 24px; line-height: 24px;">${emoji}</div>`,
    className: "emoji-icon",
  });
};

const MapClickHandler = ({
  setStartPosition,
  setEndPosition,
  startPosition,
  endPosition,
}) => {
  useMapEvents({
    click(e) {
      if (!startPosition) {
        setStartPosition(e.latlng);
      } else if (!endPosition) {
        setEndPosition(e.latlng);
      }
    },
  });
  return null;
};

const MapComponent = ({ onPositionsChange, routeData }) => {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [info, setInfo] = useState({ startInfo: "", endInfo: "" });

  // Update the parent component when positions change
  useEffect(() => {
    if (startPosition && endPosition) {
      onPositionsChange({
        startLat: startPosition.lat,
        startLng: startPosition.lng,
        endLat: endPosition.lat,
        endLng: endPosition.lng,
        startInfo: info.startInfo,
        endInfo: info.endInfo,
      });
    }
  }, [startPosition, endPosition, info, onPositionsChange]);

  const handleMarkerClick = (positionType) => {
    if (positionType === "start") {
      setStartPosition(null);
      setInfo((prevInfo) => ({ ...prevInfo, startInfo: "" }));
    } else if (positionType === "end") {
      setEndPosition(null);
      setInfo((prevInfo) => ({ ...prevInfo, endInfo: "" }));
    }
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  // Create route path coordinates from route data if available
  const routePath = routeData?.route?.map((point) => [point[0], point[1]]) || [];

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={[-20, 80]} // Center in the Indian Ocean region
        zoom={4}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapClickHandler
          setStartPosition={setStartPosition}
          setEndPosition={setEndPosition}
          startPosition={startPosition}
          endPosition={endPosition}
        />

        {startPosition && (
          <Marker
            position={startPosition}
            icon={createEmojiIcon("🚩")}
            eventHandlers={{
              click: () => handleMarkerClick("start"),
            }}
          >
            <Popup>
              Starting Point
              <br />
              Info: {info.startInfo || "N/A"}
            </Popup>
          </Marker>
        )}

        {endPosition && (
          <Marker
            position={endPosition}
            icon={createEmojiIcon("🏁")}
            eventHandlers={{
              click: () => handleMarkerClick("end"),
            }}
          >
            <Popup>
              Ending Point
              <br />
              Info: {info.endInfo || "N/A"}
            </Popup>
          </Marker>
        )}

        {/* Display the route if available */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}

        {/* Display waypoints if available */}
        {routePath.length > 2 &&
          routePath.slice(1, -1).map((point, index) => (
            <Marker
              key={`waypoint-${index}`}
              position={point}
              icon={createEmojiIcon("⚓")}
            >
              <Popup>Waypoint {index + 1}</Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className={styles.mapControls}>
        <div>
          <label>
            Starting Point Info:
            <input
              type="text"
              name="startInfo"
              value={info.startInfo}
              onChange={handleInfoChange}
              disabled={!startPosition}
              className={styles.inputField}
            />
          </label>
        </div>
        <div>
          <label>
            Ending Point Info:
            <input
              type="text"
              name="endInfo"
              value={info.endInfo}
              onChange={handleInfoChange}
              disabled={!endPosition}
              className={styles.inputField}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
