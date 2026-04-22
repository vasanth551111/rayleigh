"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Video, 
  FileText, 
  Map, 
  LineChart, 
  Briefcase, 
  GraduationCap, 
  Bell, 
  User, 
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Mock Interview", href: "/dashboard/interview", icon: Video },
  { name: "Resume Analyzer", href: "/dashboard/resume", icon: FileText },
  { name: "Skill Roadmap", href: "/dashboard/roadmap", icon: Map },
  { name: "Progress Tracker", href: "/dashboard/progress", icon: LineChart },
  { name: "Job Opportunities", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Learning Hub", href: "/dashboard/learning", icon: GraduationCap },
];

const secondaryNavItems = [
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: "3" },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-border bg-card/50 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-40 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Rayleigh</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3 custom-scrollbar">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-2">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                <span>{item.name}</span>
                {item.name === "AI Mock Interview" && !isActive && (
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                )}
              </div>
            </Link>
          );
        })}

        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 mt-6">
          Preferences
        </div>
        {secondaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary/20 text-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-4 border border-primary/20 mb-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">Unlock unlimited AI interviews.</p>
          <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8">
            Upgrade Now
          </Button>
        </div>

        <Link href="/">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer">
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
