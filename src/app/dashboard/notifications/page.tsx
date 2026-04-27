"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, FileText, Settings as SettingsIcon, Loader2, BellOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const typeConfig: Record<string, { icon: any; className: string }> = {
  INTERVIEW_COMPLETED: { icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-500" },
  RESUME_ANALYZED: { icon: FileText, className: "bg-accent/20 text-accent" },
  JOB_MATCH: { icon: Bell, className: "bg-primary/20 text-primary" },
  SYSTEM: { icon: SettingsIcon, className: "bg-muted text-muted-foreground" },
  info: { icon: Bell, className: "bg-primary/20 text-primary" },
  success: { icon: CheckCircle2, className: "bg-emerald-500/20 text-emerald-500" },
};

function getTypeConfig(type: string) {
  return typeConfig[type] ?? typeConfig["info"];
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setNotifications(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n =>
      fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      }).catch(() => {})
    ));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
          <p className="text-muted-foreground text-lg">Stay updated on your progress and new opportunities.</p>
        </div>
        {notifications.some(n => !n.read) && (
          <Button variant="outline" onClick={markAllRead}>Mark all as read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BellOff className="h-14 w-14 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">No notifications yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Notifications will appear here as you complete interviews and analyze your resume.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const cfg = getTypeConfig(notification.type);
            const Icon = cfg.icon;
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                <Card className={`glass-card overflow-hidden transition-colors ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : 'bg-card/40'}`}>
                  <CardContent className="p-4 sm:p-6 flex gap-4">
                    <div className={`mt-1 shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${cfg.className}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.message || notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>

                      {!notification.read && (
                        <div className="pt-2">
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary"
                            onClick={() => markRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
