"use client";

import { useEffect, useRef } from "react";

interface Mezzo {
  identificativo_squadra: string;
  comune: string;
  tipoMezzo: string;
  targa: string;
  latitudine?: number;
  longitudine?: number;
}

interface Props {
  mezzi: Mezzo[];
}

export default function MapAIB({ mezzi }: Props) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let map: any;

    async function initMap() {
      if (typeof window === "undefined") return;

      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      // Fix marker Leaflet in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current) {
        mapRef.current.remove();
      }

      map = L.map("mapAIB", {
        zoomControl: true,
      }).setView([39.3, 16.3], 8);

      mapRef.current = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            "&copy; OpenStreetMap contributors",
        }
      ).addTo(map);

      const bounds: any[] = [];

      mezzi.forEach((m) => {
        if (!m.latitudine || !m.longitudine) return;

        const marker = L.marker([
          m.latitudine,
          m.longitudine,
        ]).addTo(map);

        marker.bindPopup(`
          <div style="min-width:180px">
            <b>${m.identificativo_squadra}</b>
            <hr />
            🚒 ${m.tipoMezzo}<br/>
            🚗 ${m.targa}<br/>
            📍 ${m.comune}
          </div>
        `);

        bounds.push([
          m.latitudine,
          m.longitudine,
        ]);
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, {
          padding: [40, 40],
        });
      }
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mezzi]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "10px",
        marginBottom: "20px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <h2
        style={{
          marginBottom: "10px",
          color: "#003366",
        }}
      >
        🗺️ Dislocazione Mezzi AIB
      </h2>

      <div
        id="mapAIB"
        style={{
          width: "100%",
          height: "550px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      />
    </div>
  );
  }
