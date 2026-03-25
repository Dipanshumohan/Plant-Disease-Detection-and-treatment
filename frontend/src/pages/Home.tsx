import { ArrowRight, Activity, Globe2, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-950 flex flex-col items-center pt-20 px-4">
      
      {/* Hero Section */}
      <div className="max-w-4xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8 animate-in fade-in slide-in-from-bottom-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          CNN Model v1.0 Online
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-50 tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4">
          Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">Crop Health</span> Intelligence.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6">
          Upload leaf samples to instantly detect diseases using advanced machine learning, and track global agricultural outbreaks in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8">
          <a href="/diagnose" className="flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Run Diagnosis <ArrowRight size={18} />
          </a>
          <a href="/community" className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-100 border border-zinc-800 px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all">
            View Live Map
          </a>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 mb-20">
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
            <Activity size={24} className="text-zinc-100" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-3">AI Diagnostics</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Powered by a custom Convolutional Neural Network trained on thousands of varied leaf samples for rapid, high-accuracy detection.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
            <Globe2 size={24} className="text-zinc-100" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-3">Live Tracking</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Every diagnosis is geolocated and securely stored in MongoDB, updating our global Mapbox interface in real-time.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900 transition-colors">
          <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6">
            <ShieldCheck size={24} className="text-zinc-100" />
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-3">Treatment Protocols</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instantly receive scientifically-backed agricultural treatments to isolate outbreaks and save infected crops.
          </p>
        </div>

      </div>
    </div>
  );
}