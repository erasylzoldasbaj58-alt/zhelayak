"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export default function Map({ from, to }: { from: string; to: string }) {
  const [map, setMap] = useState<any>(null);
  const [routingControl, setRoutingControl] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 1. Сіздің орналасқан жеріңізді алу
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Геолокация қатесі:", error.message);
          // Қате болса, Алматы орталығын қолданамыз
          setUserLocation({ lat: 43.238949, lng: 76.889709 });
        }
      );
    } else {
      setUserLocation({ lat: 43.238949, lng: 76.889709 });
    }
  }, []);

  // 2. Картаны құру
  useEffect(() => {
    if (!userLocation) return;
    const L = require("leaflet");
    require("leaflet-routing-machine");

    const container = document.getElementById("map") as HTMLElement;
    if (!container || (container as any)._leaflet_id) return;

    const newMap = L.map("map").setView(
      [userLocation.lat, userLocation.lng],
      14
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(newMap);

    // 3. Сіздің орныңызды көрсететін көк нүкте
    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `<div style="background: #4285F4; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 10px rgba(66,133,244,0.8);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(newMap)
      .bindPopup("📍 Сіз осындасыз");

    // 4. Айналадағы 200 метрлік шеңбер (көк)
    L.circle([userLocation.lat, userLocation.lng], {
      color: "#4285F4",
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      radius: 200,
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [userLocation]);

  // 5. Жолды сызу
  useEffect(() => {
    if (!map || !from || !to || !userLocation) return;
    const L = require("leaflet");

    if (routingControl) {
      map.removeControl(routingControl);
    }

    const newRoutingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(userLocation.lat + 0.015, userLocation.lng + 0.02),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "#FFD700", opacity: 0.9, weight: 5 }],
      },
    }).addTo(map);

    const container = newRoutingControl.getContainer();
    if (container) {
      container.style.display = "none";
    }

    setRoutingControl(newRoutingControl);
  }, [map, from, to, userLocation]);

  if (!userLocation) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#222",
          color: "#FFD700",
          fontSize: 14,
        }}
      >
        📍 Орналасқан жеріңіз анықталуда...
      </div>
    );
  }

  return <div id="map" style={{ height: "100%", width: "100%", zIndex: 1 }} />;
}