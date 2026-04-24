"use client";

import { useState } from "react";
import { MapPin, Navigation, ShieldAlert, Loader2 } from "lucide-react";

export default function PoliceLocator({ dict }: { dict?: any }) {
  const [stations, setStations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const locatePolice = () => {
    setError("");
    setIsLoading(true);
    setHasSearched(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch("/api/police", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }),
          });
          const data = await res.json();
          if (res.ok && data.stations) {
            if (data.stations.length === 0) {
              setError("No police stations found within a 15km radius.");
            } else {
              setStations(data.stations);
            }
          } else {
            setError("Could not find nearby stations.");
          }
        } catch (err) {
          setError("Network error occurred.");
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError("Location permission denied. We need your location to find nearby stations.");
        setIsLoading(false);
      }
    );
  };

  const title = dict?.title || "Emergency SOS";
  const buttonText = dict?.button || "Find Nearest Police Station";
  const locatingText = dict?.locating || "Locating...";
  const routeText = dict?.route || "Route";
  const searchAgainText = dict?.search_again || "Search Again";

  return (
    <div className="bg-[#1a1311] rounded-2xl shadow-2xl border border-brand-gold/20 p-5 mt-6 w-full max-w-sm mx-auto relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="font-black text-brand-gold text-lg tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> {title}
        </h3>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />}
      </div>

      {!hasSearched || error ? (
        <button 
          onClick={locatePolice}
          disabled={isLoading}
          className="w-full bg-[#2a211e] hover:bg-brand-gold/10 border border-brand-gold/30 text-brand-text font-bold py-3 rounded-xl transition-all active:scale-95 text-sm uppercase tracking-wider"
        >
          {isLoading ? locatingText : buttonText}
        </button>
      ) : null}

      {error && <p className="text-red-400 text-xs font-semibold mt-3 text-center">{error}</p>}

      {stations.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {stations.map((station) => (
            <div key={station.id} className="flex items-center justify-between p-3 bg-[#2a211e] rounded-xl border border-brand-gold/10">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
                <span className="text-sm font-bold text-brand-text">{station.name}</span>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-brand-gold bg-brand-gold/10 px-3 py-2 rounded-lg hover:bg-brand-gold/20 transition-colors"
              >
                <Navigation className="w-3 h-3" /> {routeText}
              </a>
            </div>
          ))}
          <button 
            onClick={() => setHasSearched(false)} 
            className="text-xs text-gray-400 font-semibold text-center mt-2 hover:text-brand-gold"
          >
            {searchAgainText}
          </button>
        </div>
      )}
    </div>
  );
}
