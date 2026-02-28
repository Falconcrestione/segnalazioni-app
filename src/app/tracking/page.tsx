"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbzMShBzXcSZO4QOIGcoY51S1NO2V7yzSNHy17_ErHnTT7E-a-xiz12SVX1wsrVh6v4I/exec";

export default function MapPage() {
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null); // 👈 QUI salviamo L
  const layersRef = useRef<any[]>([]);
  const intervalRef = useRef<any>(null);

  const [mode, setMode] = useState<"today" | "historical">("today");
  const [date, setDate] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [devicesInfo, setDevicesInfo] = useState<any[]>([]);

  const colors = [
    "#e74c3c","#3498db","#2ecc71","#f39c12",
    "#9b59b6","#1abc9c","#34495e","#d35400"
  ];

  // 👇 Caricamento Leaflet SOLO lato client
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
  }

  return (
    <>
      <div style={{
        position:"absolute",
        left:0,
        top:0,
        bottom:0,
        width:260,
        background:"#fff",
        padding:15,
        zIndex:1000,
        overflowY:"auto"
      }}>
        <h3>Tracking</h3>

        <button onClick={startTodayMode}>
          Oggi (Live)
        </button>

        <hr/>

        <input
          type="date"
          value={date}
          onChange={e=>setDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Device (opzionale)"
          value={deviceFilter}
          onChange={e=>setDeviceFilter(e.target.value)}
        />

        <button onClick={startHistoricalMode}>
          Carica Storico
        </button>

        <button onClick={clearMap}>
          Reset
        </button>

        <hr/>

        <b>Modalità:</b> {mode}

        <hr/>

        {devicesInfo.map(d=>(
          <div key={d.name} style={{marginBottom:10}}>
            <div style={{
              width:12,
              height:12,
              background:d.color,
              display:"inline-block",
              marginRight:6
            }}/>
            <b>{d.name}</b><br/>
            {d.distance} km<br/>
            {d.points} punti
          </div>
        ))}
      </div>

      <div id="map" style={{height:"100vh", marginLeft:260}} />
    </>
  );
}