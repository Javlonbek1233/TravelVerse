import { Map, Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from "lucide-react";
import { useState } from "react";

interface MapViewProps {
  locations: { lat: number; lng: number; title: string }[];
}

export default function MapView({ locations }: MapViewProps) {
  const [viewport, setViewport] = useState({
    latitude: locations[0]?.lat || 0,
    longitude: locations[0]?.lng || 0,
    zoom: 12
  });

  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="w-full h-full bg-white/5 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4 border border-white/10">
        <MapPin className="w-12 h-12 text-white/20" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold uppercase tracking-tighter italic">Map Access Required</h3>
          <p className="text-white/40 text-sm max-w-xs mx-auto">Please add your Mapbox API Key as VITE_MAPBOX_TOKEN in the Secrets panel to enable the interactive map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={token}
      >
        <NavigationControl position="top-right" />
        {locations.map((loc, idx) => (
          <Marker 
            key={idx} 
            latitude={loc.lat} 
            longitude={loc.lng}
          >
            <div className="group relative">
              <div className="bg-orange-500 p-2 rounded-full shadow-lg shadow-orange-500/50 transform group-hover:scale-125 transition-transform">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {loc.title}
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
