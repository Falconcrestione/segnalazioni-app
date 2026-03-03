"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzMShBzXcSZO4QOIGcoY51S1NO2V7yzSNHy17_ErHnTT7E-a-xiz12SVX1wsrVh6v4I/exec";

export default function MapPage() {
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const intervalRef = useRef<any>(null);

  const [mode, setMode] = useState<"today" | "historical">("today");
  const [date, setDate] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [devicesInfo, setDevicesInfo] = useState<any[]>([]);
  const [deviceList, setDeviceList] = useState<string[]>([]);

  const colors = [
    "#e74c3c","#3498db","#2ecc71","#f39c12",
    "#9b59b6","#1abc9c","#34495e","#d35400"
  ];

  // Inizializzazione Leaflet lato client
  useEffect(() => {
    async function init() {
      const L = (await import("leaflet")).default;
      leafletRef.current = L;

      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([38.377, 15.904], 13);

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          { attribution: "© OpenStreetMap" }
        ).addTo(mapRef.current);

        startTodayMode();
        loadDeviceList();
      }
    }

    init();
  }, []);

  function clearMap() {
    layersRef.current.forEach(layer =>
      mapRef.current?.removeLayer(layer)
    );
    layersRef.current = [];
    setDevicesInfo([]);
  }

  function startTodayMode() {
    if (!leafletRef.current) return;

    setMode("today");
    clearInterval(intervalRef.current);
    clearMap();
    loadToday();
    intervalRef.current = setInterval(loadToday, 10000);
  }

  function startHistoricalMode() {
    if (!leafletRef.current) return;
    if (!date) return alert("Seleziona una data");

    setMode("historical");
    clearInterval(intervalRef.current);
    clearMap();
    loadHistorical();
  }

  async function loadDeviceList() {
    try {
      const res = await fetch(WEBAPP_URL + "?action=getPoints");
      const data = await res.json();
      setDeviceList(Object.keys(data));
    } catch (err) {
      console.error("Errore caricamento device:", err);
    }
  }

  async function loadToday() {
    const res = await fetch(WEBAPP_URL + "?action=getPoints");
    const data = await res.json();
    drawData(data);
  }

  async function loadHistorical() {
    let url =
      WEBAPP_URL +
      "?action=getHistorical&date=" +
      date;

    if (deviceFilter)
      url += "&device=" + deviceFilter;

    const res = await fetch(url);
    const data = await res.json();
    drawData(data);
  }

  function haversine(lat1:number, lon1:number, lat2:number, lon2:number) {
    const R = 6371000;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a =
      Math.sin(dLat/2)**2 +
      Math.cos(lat1*Math.PI/180) *
      Math.cos(lat2*Math.PI/180) *
      Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }

  function calculateBearing(lat1:number, lon1:number, lat2:number, lon2:number) {
    const y = Math.sin((lon2-lon1)*Math.PI/180) * Math.cos(lat2*Math.PI/180);
    const x =
      Math.cos(lat1*Math.PI/180) * Math.sin(lat2*Math.PI/180) -
      Math.sin(lat1*Math.PI/180) *
      Math.cos(lat2*Math.PI/180) *
      Math.cos((lon2-lon1)*Math.PI/180);
    return (Math.atan2(y,x) * 180/Math.PI + 360) % 360;
  }

  function drawData(data:any) {
    const L = leafletRef.current;
    if (!L) return;

    clearMap();
    let colorIndex = 0;
    let info:any[] = [];

    for (let device in data) {
      const points = data[device];
      if (!points || points.length < 2) continue;

      const color = colors[colorIndex % colors.length];
      colorIndex++;

      const latlngs = points.map((p:any)=>[p.lat,p.lng]);

      const poly = L.polyline(latlngs,{color})
        .addTo(mapRef.current);
      layersRef.current.push(poly);

      let total = 0;
      for (let i=1;i<points.length;i++){
        total += haversine(
          points[i-1].lat,
          points[i-1].lng,
          points[i].lat,
          points[i].lng
        );
      }

      const last = points[points.length-1];
      const prev = points[points.length-2];
      const bearing = calculateBearing(
        prev.lat,prev.lng,last.lat,last.lng
      );

      const icon = L.divIcon({
        html: `
          <div style="
            width:0;
            height:0;
            border-left:10px solid transparent;
            border-right:10px solid transparent;
            border-bottom:20px solid ${color};
            transform: rotate(${bearing}deg);
          "></div>
        `,
        iconSize:[20,20],
        iconAnchor:[10,10]
      });

      const marker = L.marker([last.lat,last.lng],{icon})
        .addTo(mapRef.current)
        .bindPopup(`${device}<br>${(total/1000).toFixed(2)} km`);

      layersRef.current.push(marker);

      info.push({
        name: device,
        distance:(total/1000).toFixed(2),
        color,
        points:points.length
      });
    }

    setDevicesInfo(info);
    // 🔹 AUTOPOSIZIONA LA MAPPA SUI PUNTI TRACCIATI
if (mapRef.current && Object.keys(data).length > 0) {
  const L = leafletRef.current;
  const allLatLngs: [number, number][] = [];

  for (let device in data) {
    const points = data[device];
    if (!points || points.length === 0) continue;
    points.forEach((p: { lat: number; lng: number }) => allLatLngs.push([p.lat, p.lng]));
  }

  if (allLatLngs.length > 0) {
    const bounds = L.latLngBounds(allLatLngs);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }
}
  }

  return (
    <>
     <div style={{
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 300,
  background: "#f4f6f9",
  padding: 20,
  zIndex: 1000,
  overflowY: "auto",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
}}>

  <h2 style={{
    marginBottom: 20,
    color: "#2c3e50"
  }}>
    🚗 Tracking
  </h2>

  {/* CARD CONTROLLI */}
  <div style={{
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }}>

    <button
      onClick={startTodayMode}
      style={{
        width: "100%",
        padding: 10,
        marginBottom: 10,
        background: "#3498db",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600
      }}
    >
      🔴 Oggi (Live)
    </button>

    <input
      type="date"
      value={date}
      onChange={e=>setDate(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 10,
        borderRadius: 6,
        border: "1px solid #ddd"
      }}
    />

    <input
      type="text"
      placeholder="Seleziona device"
      value={deviceFilter}
      onChange={e=>setDeviceFilter(e.target.value)}
      list="devices"
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 10,
        borderRadius: 6,
        border: "1px solid #ddd"
      }}
    />

    <datalist id="devices">
      {deviceList.map(device => (
        <option key={device} value={device} />
      ))}
    </datalist>

    <button
      onClick={startHistoricalMode}
      style={{
        width: "100%",
        padding: 10,
        marginBottom: 10,
        background: "#2ecc71",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600
      }}
    >
      📅 Carica Storico
    </button>

    <button
      onClick={clearMap}
      style={{
        width: "100%",
        padding: 8,
        background: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer"
      }}
    >
      ♻ Reset
    </button>

  </div>

  {/* MODALITÀ */}
  <div style={{
    marginBottom: 15,
    fontSize: 14
  }}>
    Modalità:
    <span style={{
      marginLeft: 8,
      padding: "4px 8px",
      borderRadius: 20,
      background: mode === "today" ? "#e74c3c" : "#2ecc71",
      color: "#fff",
      fontSize: 12
    }}>
      {mode === "today" ? "LIVE" : "STORICO"}
    </span>
  </div>

  {/* LISTA DEVICE */}
  {devicesInfo.map(d => (
    <div
      key={d.name}
      style={{
        background: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        borderLeft: `5px solid ${d.color}`
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 5 }}>
        {d.name}
      </div>

      <div style={{ fontSize: 13, color: "#555" }}>
        📍 {d.distance} km
      </div>

      <div style={{ fontSize: 13, color: "#555" }}>
        📊 {d.points} punti
      </div>
    </div>
  ))}

</div>
     <div id="map" style={{ height:"100vh", marginLeft:300 }} />
    </>
  );
}