import { Home, Stethoscope, Globe2, Sprout, Activity } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"; // Make sure this path matches your shadcn installation!

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "AI Diagnosis", url: "/diagnose", icon: Stethoscope },
  { title: "Global Intel", url: "/community", icon: Globe2 },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar variant="inset" className="border-r border-zinc-800 bg-zinc-950 dark">
      
      {/* Top Logo Area */}
      <SidebarHeader className="p-5 border-b border-zinc-800/50">
        <div className="flex items-center gap-3 font-bold text-xl text-zinc-100 tracking-tight">
          <div className="p-1.5 bg-green-500/10 rounded-lg">
            <Sprout className="text-green-500" size={24} />
          </div>
          CropHealth AI
        </div>
      </SidebarHeader>

      {/* Main Navigation Links */}
      <SidebarContent className="bg-zinc-950 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">
            Platform Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`px-3 py-5 rounded-lg transition-all ${
                      location.pathname === item.url 
                        ? "bg-zinc-800 text-zinc-50 font-medium" 
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* "No Login" Footer: System Status Indicator */}
      <SidebarFooter className="p-4 border-t border-zinc-800/50 bg-zinc-950">
        <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-3">
            <Activity size={16} className="text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">System Status</span>
              <span className="text-[10px] text-zinc-500">CNN Model Online</span>
            </div>
          </div>
          {/* Pulsing Green Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
        </div>
      </SidebarFooter>

    </Sidebar>
  );
}