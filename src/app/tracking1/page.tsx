"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwpQLezbsELEppjmGQOsKXLXn1RBWfjd0hUC4zlpYraWTWmERbyMfiOFsw36MsQ4h3h/exec";

// UTENTI CON DISTRICT
const USERS = [
  { username: "superuser", password: "superpass", district: "ALL" },
  { username: "user1", password: "pass1", district: "DIST1" },
  { username: "user2", password: "pass2", district: "DIST2" },
  { username: "user3", password: "pass3", district: "DIST3" },
  { username: "user4", password: "pass4", district: "DIST4" },
  { username: "user5", password: "pass5", district: "DIST5" },
  { username: "user6", password: "pass6", district: "DIST6" },
  { username: "user7", password: "pass7", district: "DIST7" },
  { username: "user8", password: "pass8", district: "DIST8" },
  { username: "user9", password: "pass9", district: "DIST9" },
  { username: "user10", password: "pass10", district: "DIST10" },
  { username: "user11", password: "pass11", district: "DIST11" },
];

export default function MapPage() {
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const layersRef = useRef<any[]>([]);
  const intervalRef = useRef<any>(null);

  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"today" | "historical">("today");
  const [date, setDate] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [devicesInfo, setDevicesInfo] = useState<any[]>([]);
  const [deviceList, setDeviceList] = useState<string[]>([]);

  //const colors = [
    //"#e74c3c","#3498db","#2ecc71","#f39c12",
    //"#9b59b6","#1abc9c","#34495e","#d35400"
  //];

  function login() {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) return alert("Credenziali errate");
    setCurrentUser(user);
    setDistrictFilter(user.district);
    setLoggedIn(true);
  }

  useEffect(() => {
    if (!loggedIn) return;

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
  }, [loggedIn]);

  function clearMap() {
    layersRef.current.forEach(layer => mapRef.current?.removeLayer(layer));
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
      let devices = Object.keys(data);
      if (districtFilter !== "ALL") {
        devices = devices.filter(d => {
          return data[d]?.some((p:any)=> (p.district||"").trim().toUpperCase() === districtFilter.trim().toUpperCase());
        });
      }
      setDeviceList(devices);
    } catch (err) {
      console.error("Errore caricamento device:", err);
    }
  }

  async function loadToday() {
    try {
      const res = await fetch(WEBAPP_URL + "?action=getPoints");
      const data = await res.json();
      drawData(data);
    } catch(e) { console.error(e); }
  }

  async function loadHistorical() {
    try {
      let url = WEBAPP_URL + "?action=getHistorical&date=" + date;
      if (deviceFilter) url += "&device=" + deviceFilter;
      const res = await fetch(url);
      const data = await res.json();
      drawData(data);
    } catch(e) { console.error(e); }
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
  function getColorFromDevice(device:string){
  let hash = 0;
  for (let i = 0; i < device.length; i++) {
    hash = device.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue},70%,50%)`;
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

      const filteredPoints = districtFilter !== "ALL" 
        ? points.filter((p:any) => (p.district || "").trim().toUpperCase() === districtFilter.trim().toUpperCase())
        : points;

      if (filteredPoints.length < 2) continue;
     const color = getColorFromDevice(device);

      const latlngs = filteredPoints.map((p:any)=>[
        Number(String(p.lat).replace(",", ".")),
        Number(String(p.lng).replace(",", "."))
      ]);

      const poly = L.polyline(latlngs, { color }).addTo(mapRef.current);
      layersRef.current.push(poly);

      let total = 0;
      for (let i=1;i<filteredPoints.length;i++){
        total += haversine(
          Number(String(filteredPoints[i-1].lat).replace(",", ".")),
          Number(String(filteredPoints[i-1].lng).replace(",", ".")),
          Number(String(filteredPoints[i].lat).replace(",", ".")),
          Number(String(filteredPoints[i].lng).replace(",", "."))
        );
      }

      const last = filteredPoints[filteredPoints.length-1];
      const prev = filteredPoints[filteredPoints.length-2];
      const dist = haversine(
  Number(String(prev.lat).replace(",", ".")),
  Number(String(prev.lng).replace(",", ".")),
  Number(String(last.lat).replace(",", ".")),
  Number(String(last.lng).replace(",", "."))
);

let bearing = 0;

if (dist > 5) { // minimo 5 metri di movimento
  bearing = calculateBearing(
    Number(String(prev.lat).replace(",", ".")),
    Number(String(prev.lng).replace(",", ".")),
    Number(String(last.lat).replace(",", ".")),
    Number(String(last.lng).replace(",", "."))
  );
}

      const icon = L.divIcon({
  html: `
  <div style="transform: rotate(${bearing}deg);">
    <svg width="30" height="30" viewBox="0 0 24 24">
      <path fill="${color}" d="M18.92 6c-.28-.83-1.04-1.4-1.92-1.4H7c-.88 0-1.64.57-1.92 1.4L3 12v6c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-6l-2.08-6zM7 15c-.83 0-1.5-.67-1.5-1.5S6.17 12 7 12s1.5.67 1.5 1.5S7.83 15 7 15zm10 0c-.83 0-1.5-.67-1.5-1.5S16.17 12 17 12s1.5.67 1.5 1.5S17.83 15 17 15z"/>
    </svg>
  </div>
  `,
  iconSize:[30,30],
  iconAnchor:[15,15]
});

      const marker = L.marker([
        Number(String(last.lat).replace(",", ".")),
        Number(String(last.lng).replace(",", "."))
      ], { icon })
        .addTo(mapRef.current)
        .bindPopup(`${device} (${last.district})<br>${(total/1000).toFixed(2)} km`);

      layersRef.current.push(marker);

      info.push({
        name: device,
        distance:(total/1000).toFixed(2),
        color,
        points: filteredPoints.length
      });
    }

    setDevicesInfo(info);

    if (mapRef.current && info.length>0){
      const allLatLngs: [number, number][] = [];
      for (let device in data) {
        const pts = districtFilter !== "ALL" 
          ? data[device].filter((p:any)=> (p.district||"").trim().toUpperCase() === districtFilter.trim().toUpperCase())
          : data[device];
        pts.forEach((p:any)=>allLatLngs.push([
          Number(String(p.lat).replace(",", ".")),
          Number(String(p.lng).replace(",", "."))
        ]));
      }
      if (allLatLngs.length>0){
        const bounds = L.latLngBounds(allLatLngs);
        mapRef.current.fitBounds(bounds, { padding:[50,50] });
      }
    }
  }

  if (!loggedIn) {
    return (
      <div style={{padding:40}}>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={login}>Accedi</button>
      </div>
    );
  }

  return (
    <>
      <div style={{
        position: "absolute", left:0, top:0, bottom:0,
        width:300, background:"#f4f6f9", padding:20,
        zIndex:1000, overflowY:"auto", boxShadow:"2px 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{marginBottom:20,color:"#2c3e50"}}>🚗 Tracking</h2>

        {/* DISTRICT SELECT */}
        <div style={{marginBottom:10}}>
          <label>Distretto: </label>
          <select
            value={districtFilter}
            onChange={e=>{
              setDistrictFilter(e.target.value);
              startTodayMode();
            }}
            style={{width:"100%", padding:6, borderRadius:6, border:"1px solid #ddd"}}
          >
            {currentUser.district === "ALL" ? (
              <>
                <option value="ALL">Tutti</option>
                <option value="DIST1">DIST1</option>
                <option value="DIST2">DIST2</option>
              </>
            ) : (
              <option value={currentUser.district}>{currentUser.district}</option>
            )}
          </select>
        </div>

        <div style={{background:"#fff", padding:15, borderRadius:10, marginBottom:20, boxShadow:"0 4px 10px rgba(0,0,0,0.05)"}}>
          <button onClick={startTodayMode} style={{width:"100%", padding:10, marginBottom:10, background:"#3498db", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:600}}>🔴 Oggi (Live)</button>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%", padding:8, marginBottom:10, borderRadius:6, border:"1px solid #ddd"}} />
          <input type="text" placeholder="Seleziona device" value={deviceFilter} onChange={e=>setDeviceFilter(e.target.value)} list="devices" style={{width:"100%", padding:8, marginBottom:10, borderRadius:6, border:"1px solid #ddd"}} />
          <datalist id="devices">{deviceList.map(d=><option key={d} value={d} />)}</datalist>
          <button onClick={startHistoricalMode} style={{width:"100%", padding:10, marginBottom:10, background:"#2ecc71", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontWeight:600}}>📅 Carica Storico</button>
          <button onClick={clearMap} style={{width:"100%", padding:8, background:"#e74c3c", color:"#fff", border:"none", borderRadius:6, cursor:"pointer"}}>♻ Reset</button>
        </div>

        <div style={{marginBottom:15,fontSize:14}}>
          Modalità:
          <span style={{marginLeft:8,padding:"4px 8px",borderRadius:20, background:mode==="today"?"#e74c3c":"#2ecc71", color:"#fff", fontSize:12}}>
            {mode==="today"?"LIVE":"STORICO"}
          </span>
        </div>

        {devicesInfo.map(d=>(
          <div key={d.name} style={{background:"#fff", padding:12, borderRadius:10, marginBottom:12, boxShadow:"0 4px 10px rgba(0,0,0,0.05)", borderLeft:`5px solid ${d.color}`}}>
            <div style={{fontWeight:700, marginBottom:5}}>{d.name}</div>
            <div style={{fontSize:13, color:"#555"}}>📍 {d.distance} km</div>
            <div style={{fontSize:13, color:"#555"}}>📊 {d.points} punti</div>
          </div>
        ))}
      </div>

      <div id="map" style={{ height:"100vh", marginLeft:300 }} />
    </>
  );
}