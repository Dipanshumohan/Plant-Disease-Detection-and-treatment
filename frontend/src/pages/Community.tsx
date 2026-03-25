import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import { MapPin, AlertCircle, Loader2, Pill, Clock, Crosshair } from 'lucide-react';

export default function Community() {
  const [reports, setReports] = useState<any[]>([]);
  const [hoveredReport, setHoveredReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/reports");
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 w-full">
        <Loader2 className="animate-spin text-zinc-100 mb-4" size={40} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">
      <Map
        initialViewState={{ longitude: 78.9629, latitude: 20.5937, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {reports.map((report) => (
          <Marker key={report._id} longitude={report.lng} latitude={report.lat} anchor="bottom">
            <div 
              className="cursor-pointer"
              onMouseEnter={() => setHoveredReport(report)}
              onMouseLeave={() => setHoveredReport(null)}
            >
              <MapPin 
                size={32} 
                fill={report.disease.includes("healthy") ? "#ffffff" : "#3f3f46"} 
                color={report.disease.includes("healthy") ? "#18181b" : "#ffffff"} 
                className="transform transition-transform hover:scale-125 hover:-translate-y-2 drop-shadow-lg"
              />
            </div>
          </Marker>
        ))}

        {hoveredReport && (
          <Popup
            longitude={hoveredReport.lng}
            latitude={hoveredReport.lat}
            anchor="bottom"
            offset={30}
            closeButton={false}
            className="z-50"
            maxWidth="320px"
          >
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-4 w-full">
              
              {/* RENDERS THE CLOUDINARY IMAGE ON HOVER */}
              {hoveredReport.image_url && (
                <div className="w-full h-32 mb-3 rounded-md overflow-hidden border border-zinc-800">
                  <img 
                    src={hoveredReport.image_url} 
                    alt="Infected Leaf" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-3">
                <AlertCircle size={16} className={hoveredReport.disease.includes("healthy") ? "text-green-400" : "text-red-400"} />
                <h3 className="font-semibold text-zinc-100 text-sm truncate">
                  {hoveredReport.disease.replace(/_/g, ' ')}
                </h3>
              </div>
              
              <div className="space-y-2 mb-3">
                <p className="flex items-center gap-2 text-xs text-zinc-400">
                  <Crosshair size={12} /> {hoveredReport.lat.toFixed(4)}, {hoveredReport.lng.toFixed(4)}
                </p>
                <p className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock size={12} /> {new Date(hoveredReport.date).toLocaleString()}
                </p>
              </div>

              <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                  <Pill size={12} /> Required Treatment
                </p>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  {hoveredReport.treatment}
                </p>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      <div className="absolute top-6 left-6 bg-zinc-950/80 backdrop-blur-md p-5 rounded-xl border border-zinc-800 shadow-xl pointer-events-none">
        <h2 className="text-zinc-50 font-semibold tracking-tight mb-1">Global Outbreak Intel</h2>
        <p className="text-zinc-500 text-xs mb-4">Hover over markers to view diagnosis photos and treatment.</p>
        <div className="flex items-center gap-3 text-xs font-medium text-zinc-300">
          <span className="flex items-center gap-1"><MapPin size={14} fill="#3f3f46" color="#ffffff"/> Detected</span>
          <span className="flex items-center gap-1"><MapPin size={14} fill="#ffffff" color="#18181b"/> Healthy</span>
        </div>
      </div>
    </div>
  );
}