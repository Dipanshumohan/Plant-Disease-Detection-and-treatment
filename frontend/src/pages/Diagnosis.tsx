import { useState } from 'react';
import { UploadCloud, Loader2, AlertCircle, Search, X, Map as MapIcon, CheckCircle2 } from 'lucide-react';
import Map, { Marker } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';

export default function Diagnosis() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: string; treatment: string; image_url: string } | null>(null);
  
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [markerPos, setMarkerPos] = useState({ lat: 28.6139, lng: 77.2090 }); 
  const [viewState, setViewState] = useState({ longitude: 77.2090, latitude: 28.6139, zoom: 4 });
  const [locationName, setLocationName] = useState<string>("Location not set");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true`);
        const data = await res.json();
        setSearchResults(data.features);
      } catch (error) {
        console.error("Search failed", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPlace = (place: any) => {
    const [lng, lat] = place.center;
    setMarkerPos({ lat, lng });
    setViewState({ longitude: lng, latitude: lat, zoom: 12 });
    setLocationName(place.place_name);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleSubmit = async () => {
    if (!selectedImage) return alert("Please upload an image first!");
    setIsAnalyzing(true);
    
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const aiResponse = await fetch("http://localhost:8000/predict", { method: "POST", body: formData });
      if (!aiResponse.ok) throw new Error("Network error");
      const aiData = await aiResponse.json();
      setResult(aiData);

      // Save the location AND the Cloudinary image URL to MongoDB!
      const reportData = {
        disease: aiData.disease,
        confidence: aiData.confidence,
        treatment: aiData.treatment,
        lat: markerPos.lat,
        lng: markerPos.lng,
        image_url: aiData.image_url 
      };

      await fetch("http://localhost:8000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });

    } catch (error) {
      alert("Failed to process. Ensure Python backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 min-h-screen bg-zinc-950 w-full">
      <div className="w-full max-w-xl flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-50 tracking-tight">Diagnosis Engine</h1>
          <p className="text-zinc-400 mt-1 text-sm">Upload a sample and select the origin farm.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-xs">1</span> 
            Upload Leaf Sample
          </h2>
          <label className="flex flex-col items-center justify-center h-48 bg-zinc-950/50 rounded-lg cursor-pointer hover:bg-zinc-900/50 transition-colors border border-dashed border-zinc-700">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center text-zinc-500">
                <UploadCloud size={32} className="text-zinc-400 mb-3" />
                <span className="text-sm font-medium text-zinc-300">Click to browse images</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-100 mb-3 flex items-center gap-2">
             <span className="flex items-center justify-center w-5 h-5 rounded bg-zinc-800 text-zinc-400 text-xs">2</span> 
             Farm Location
          </h2>
          <button onClick={() => setIsMapModalOpen(true)} className="w-full flex items-center justify-between bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-lg transition-colors group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-zinc-900 rounded-md group-hover:bg-zinc-700 transition-colors">
                <MapIcon size={18} className="text-zinc-400 group-hover:text-zinc-100" />
              </div>
              <div className="flex flex-col items-start text-left truncate">
                <span className="text-xs text-zinc-500 font-medium">Coordinates / Address</span>
                <span className="text-sm text-zinc-100 truncate w-48 sm:w-64">{locationName}</span>
              </div>
            </div>
            <div className="text-xs font-semibold bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded">
              Edit Map
            </div>
          </button>
        </div>

        <button onClick={handleSubmit} disabled={isAnalyzing || !selectedImage} className="w-full py-4 bg-zinc-100 text-zinc-900 rounded-xl text-sm font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg">
          {isAnalyzing ? <><Loader2 className="animate-spin" size={18} /> Processing Cloud Upload...</> : 'Generate AI Report'}
        </button>

        {result && (
          <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 border-b border-zinc-800 flex items-start gap-4 bg-zinc-800/20">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <AlertCircle size={24} className={result.disease.includes("healthy") ? "text-green-400" : "text-red-400"} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Diagnosis Result</p>
                <h3 className="text-xl font-bold text-zinc-100">{result.disease.replace(/_/g, ' ')}</h3>
                <p className="text-sm text-zinc-400 mt-1">Confidence Score: <span className="text-zinc-300 font-mono">{result.confidence}</span></p>
              </div>
            </div>
            <div className="p-5 bg-zinc-950/50">
              <h4 className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Recommended Treatment</h4>
              <p className="text-zinc-300 text-sm leading-relaxed">{result.treatment}</p>
            </div>
          </div>
        )}
      </div>

      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Pinpoint Location</h3>
                <p className="text-xs text-zinc-500">Search for a region or click the map to drop the pin.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={14} className="text-zinc-500" />
                  </div>
                  <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Search city or region..." className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-zinc-500 transition-colors" />
                  {searchResults.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
                      {searchResults.map((place) => (
                        <li key={place.id} onClick={() => handleSelectPlace(place)} className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700/50 last:border-0 truncate">
                          {place.place_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button onClick={() => setIsMapModalOpen(false)} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <Map 
                {...viewState} 
                onMove={evt => setViewState(evt.viewState)} 
                onClick={(e) => {
                  const { lng, lat } = e.lngLat;
                  setMarkerPos({ lng, lat });
                  setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                }}
                mapStyle="mapbox://styles/mapbox/dark-v11" 
                mapboxAccessToken={MAPBOX_TOKEN} 
                cursor="crosshair"
              >
                <Marker longitude={markerPos.lng} latitude={markerPos.lat} draggable={true} onDragEnd={(e) => { setMarkerPos({ lng: e.lngLat.lng, lat: e.lngLat.lat }); setLocationName(`${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`); }}>
                  <MapPin size={40} color="#ffffff" fill="#000000" className="transform hover:scale-110 cursor-grab active:cursor-grabbing drop-shadow-2xl" />
                </Marker>
              </Map>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button onClick={() => setIsMapModalOpen(false)} className="bg-zinc-100 text-zinc-900 font-bold px-6 py-3 rounded-full shadow-2xl hover:bg-white transition-all flex items-center gap-2">
                  <CheckCircle2 size={18} /> Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}