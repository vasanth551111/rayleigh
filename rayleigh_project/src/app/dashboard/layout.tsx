"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Search, MessageSquare, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">R</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-20 hidden md:flex items-center justify-between px-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search interviews, skills, jobs..." 
              className="pl-9 bg-muted/50 border-none h-10 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-background">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden lg:block">
              <div className="font-medium">John Doe</div>
              <div className="text-muted-foreground text-xs">Frontend Developer</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                <span className="font-bold text-sm">JD</span>
              </div>
            </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Floating AI Coach Button */}
      <Button 
        className="fixed bottom-6 right-6 h-14 rounded-full px-6 shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white z-50 animate-bounce hover:animate-none group"
      >
        <MessageSquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
        Ask Rayleigh
      </Button>
    </div>
  );
}
