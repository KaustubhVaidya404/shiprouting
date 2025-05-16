import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const MapComponent = () => {
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [info, setInfo] = useState({ startInfo: "", endInfo: "" });

  const handleMarkerClick = (positionType) => {
    if (positionType === "start") {
      setStartPosition(null);
      setInfo((prevInfo) => ({ ...prevInfo, startInfo: "" }));
    } else if (positionType === "end") {
      setEndPosition(null);
      setInfo((prevInfo) => ({ ...prevInfo, endInfo: "" }));
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  return (
    <div>
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
      </MapContainer>

      {!confirmed && (
        <div style={{ marginTop: "10px" }}>
          <div>
            <label>
              Starting Point Info:
              <input
                type="text"
                name="startInfo"
                value={info.startInfo}
                onChange={handleInfoChange}
                disabled={!startPosition}
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
              />
            </label>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!startPosition || !endPosition}
          >
            Confirm Points
          </button>
        </div>
      )}

      {confirmed && (
        <div style={{ marginTop: "10px" }}>
          <h3>Points Confirmed</h3>
          <p>
            Starting Point:{" "}
            {startPosition
              ? `${startPosition.lat}, ${startPosition.lng}`
              : "N/A"}
          </p>
          <p>
            Ending Point:{" "}
            {endPosition ? `${endPosition.lat}, ${endPosition.lng}` : "N/A"}
          </p>
          <p>Starting Point Info: {info.startInfo || "N/A"}</p>
          <p>Ending Point Info: {info.endInfo || "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
