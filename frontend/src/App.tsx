import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // Import the shadcn provider
import { AppSidebar } from "./components/AppSidebar"; // Import the component we just made
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      {/* The SidebarProvider controls the layout state (open/closed) */}
      <SidebarProvider>
        <div className="flex min-h-screen bg-zinc-950 text-zinc-50 w-full dark">
          
          {/* 1. The Sidebar */}
          <AppSidebar />

          {/* 2. The Main Content Area */}
          <main className="flex-1 overflow-x-hidden flex flex-col">
            
            {/* Mobile Sidebar Trigger (Only shows on small screens) */}
            <div className="md:hidden p-4 border-b border-zinc-800 bg-zinc-950 flex items-center">
              <SidebarTrigger className="text-zinc-100" />
              <span className="ml-3 font-bold text-zinc-100">CropHealth AI</span>
            </div>

            {/* Your Pages */}
            <div className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/diagnose" element={<Diagnosis />} />
                <Route path="/community" element={<Community />} />
              </Routes>
            </div>
            
          </main>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;