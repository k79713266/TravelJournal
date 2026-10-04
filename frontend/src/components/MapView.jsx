import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";

function MapUpdater({ locations }) {
  const map = useMap();

  useEffect(() => {
    const positions = Object.values(locations);

    if (positions.length > 0) {
      map.fitBounds(positions, {
        padding: [50, 50],
      });
    }
  }, [locations, map]);

  return null;
}

function MapView({ trips }) {
  const defaultPosition = [22.9734, 78.6569];

  const [locations, setLocations] = useState({});

  useEffect(() => {
    const findLocations = async () => {
      const newLocations = {};

      // Duplicate destinations ko ek hi baar search karenge
      const destinations = [
        ...new Set(
          trips
            .map((trip) => trip.destination?.trim())
            .filter(Boolean)
        ),
      ];

      for (const destination of destinations) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              destination
            )}&limit=1`
          );

          const data = await response.json();

          if (data.length > 0) {
            newLocations[destination.toLowerCase()] = [
              parseFloat(data[0].lat),
              parseFloat(data[0].lon),
            ];
          }

          // Nominatim par unnecessary requests avoid karne ke liye
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(
            `Location not found for ${destination}:`,
            error
          );
        }
      }

      setLocations(newLocations);
    };

    if (trips.length > 0) {
      findLocations();
    }
  }, [trips]);
console.log("TRIPS:", trips);
console.log("LOCATIONS:", locations);
  return (
    <div className="map-container">
      <MapContainer
        center={defaultPosition}
        zoom={5}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
<MapUpdater locations={locations} />

        {trips.map((trip) => {
          const destination = trip.destination
            ?.toLowerCase()
            .trim();

          const position =
            locations[destination] || defaultPosition;

            console.log("MARKER:", trip.destination, position);

          return (
            <Marker
              key={trip._id}
              position={position}
            >
              <Popup>
                📍 <strong>{trip.destination}</strong>
                <br />
                ⭐ Rating: {trip.rating}/5
                <br />
                💰 Expense: ₹{trip.expense || 0}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;