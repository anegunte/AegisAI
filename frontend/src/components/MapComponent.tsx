"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// SVG Icons customized using Tailwind CSS classes inside Leaflet divIcon
const createCustomIcon = (colorClass: string, symbol: string) => {
  return L.divIcon({
    html: `
      <div class="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-lg ${colorClass} text-white">
        <span class="text-[14px] font-bold">${symbol}</span>
        <span class="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b border-white ${colorClass}"></span>
      </div>
    `,
    className: "custom-leaflet-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -42]
  });
};

const hospitalIcon = createCustomIcon("bg-rose-600", "H");
const shelterIcon = createCustomIcon("bg-amber-500", "S");
const centerIcon = createCustomIcon("bg-blue-600", "★");
const disasterIcon = createCustomIcon("bg-gray-950 border-red-500 border-3", "☠");

interface MapComponentProps {
  latitude: number;
  longitude: number;
  disasterType: string;
  location: string;
  population: number;
  severity: string;
}

interface EmergencyNode {
  name: string;
  lat: number;
  lng: number;
  type: "hospital" | "shelter" | "command";
  capacity?: string;
  status: string;
}

export default function MapComponent({ latitude, longitude, disasterType, location, population, severity }: MapComponentProps) {
  const [nodes, setNodes] = useState<EmergencyNode[]>([]);
  const [radius, setRadius] = useState<number>(2000);

  // Generate dynamic emergency coordinates relative to inputs
  useEffect(() => {
    // Determine impact radius
    const scale = severity.toLowerCase() === "critical" ? 4000 : severity.toLowerCase() === "high" ? 2800 : 1500;
    setRadius(scale);

    // Generate offsets
    const generatedNodes: EmergencyNode[] = [
      {
        name: `Aegis Command Center - Node ${location.split(",")[0]}`,
        lat: latitude + 0.003,
        lng: longitude - 0.004,
        type: "command",
        status: "Active - Tactical Control"
      },
      {
        name: `${location.split(",")[0]} General Hospital (Red Zone Sector)`,
        lat: latitude + 0.012,
        lng: longitude + 0.008,
        type: "hospital",
        capacity: "92% Occupied - Operating on Backup Power",
        status: "Medical Triage active"
      },
      {
        name: `District Trauma & Burn Center`,
        lat: latitude - 0.009,
        lng: longitude - 0.011,
        type: "hospital",
        capacity: "68% Occupied",
        status: "Receiving Patients"
      },
      {
        name: `Sector Alpha Relief Camp`,
        lat: latitude - 0.005,
        lng: longitude + 0.012,
        type: "shelter",
        capacity: "Capacity: 1,500 / 2,000",
        status: "Shelter Operational"
      },
      {
        name: `Sector Beta Evacuation Shelter`,
        lat: latitude + 0.015,
        lng: longitude - 0.014,
        type: "shelter",
        capacity: "Capacity: 800 / 1,000",
        status: "Shelter Operational"
      },
      {
        name: `Central Municipal Stadium (Staging Depot)`,
        lat: latitude - 0.014,
        lng: longitude + 0.006,
        type: "shelter",
        capacity: "Water & Food Rations Depot",
        status: "Operational Logistics Hub"
      }
    ];

    setNodes(generatedNodes);
  }, [latitude, longitude, severity, location]);

  const mapCenter: [number, number] = [latitude, longitude];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xs border border-gray-200">
      
      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 z-10 rounded-xl bg-white/90 backdrop-blur-md p-4 shadow-md border border-gray-100 flex flex-col gap-2.5 text-xs font-semibold text-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-4.5 rounded-full bg-gray-950 flex items-center justify-center text-[10px] text-white font-bold">☠</div>
          <span>Impact Epicenter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-4.5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white">★</div>
          <span>Tactical Command</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-4.5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] text-white">H</div>
          <span>Medical Triage Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4.5 w-4.5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">S</div>
          <span>Evacuation Shelter</span>
        </div>
        <hr className="border-gray-200/60 my-0.5" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500/25 border border-red-500"></div>
          <span>Danger Zone ({radius / 1000}km)</span>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={13.5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Disaster Circle Zone */}
        <Circle
          center={mapCenter}
          pathOptions={{
            fillColor: "#EF4444",
            fillOpacity: 0.18,
            color: "#EF4444",
            weight: 2.5,
            dashArray: "6, 6"
          }}
          radius={radius}
        />

        {/* Epicenter Marker */}
        <Marker position={mapCenter} icon={disasterIcon}>
          <Popup className="custom-popup">
            <div className="p-1">
              <h3 className="font-bold text-gray-900 text-sm">{disasterType} Epicenter</h3>
              <p className="text-xs text-red-600 font-semibold mt-1 uppercase tracking-wider">{severity} Severity</p>
              <p className="text-xs text-gray-600 mt-1">Impact zone focused in {location}. Estimated {population.toLocaleString()} affected.</p>
            </div>
          </Popup>
        </Marker>

        {/* Node Markers */}
        {nodes.map((node, i) => {
          let icon = shelterIcon;
          if (node.type === "hospital") icon = hospitalIcon;
          if (node.type === "command") icon = centerIcon;

          return (
            <Marker key={i} position={[node.lat, node.lng]} icon={icon}>
              <Popup>
                <div className="p-1 min-w-[150px]">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight">{node.name}</h4>
                  <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mt-1.5 ${
                    node.type === "hospital" ? "bg-rose-50 text-rose-600" :
                    node.type === "command" ? "bg-blue-50 text-blue-600" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {node.status}
                  </span>
                  {node.capacity && (
                    <p className="text-xs text-gray-500 font-semibold mt-1.5">{node.capacity}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
