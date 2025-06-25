import { useState } from "react";

export default function useGeolocation() {
  const [position, setPosition] = useState({
    latitude: 17.9757,
    longitude: 102.6331,
  });

  // Function to fetch current location once
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("Error retrieving geolocation:", error);
      }
    );
  };

  return { position, fetchLocation };
}
