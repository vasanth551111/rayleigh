"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, FileText, Settings as SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const notificationsData = [
  {
    id: 1,
    title: "Mock Interview Feedback Ready",
    description: "Your detailed feedback for the Frontend Engineer mock interview is now available.",
    time: "2 hours ago",
    type: "success",
    read: false,
    icon: CheckCircle2
  },
  {
    id: 2,
    title: "New Job Match: Senior UI Developer at Vercel",
    description: "Based on your recent excellent performance in React, you have a 98% match for a new role.",
    time: "5 hours ago",
    type: "info",
    read: false,
    icon: Bell
  },
  {
    id: 3,
    title: "Resume Analysis Completed",
    description: "Your resume score is 85/100. See the suggested improvements to make it ATS-friendly.",
    time: "Yesterday",
    type: "document",
    read: true,
    icon: FileText
  },
  {
    id: 4,
    title: "System Update",
    description: "We've added new behavioral interview questions to the simulation bank.",
    time: "2 days ago",
    type: "system",
    read: true,
    icon: SettingsIcon
  }
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Notifications</h1>
          <p className="text-muted-foreground text-lg">Stay updated on your progress and new opportunities.</p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <div className="space-y-4">
        {notificationsData.map((notification, index) => (
          <motion.div 
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`glass-card overflow-hidden transition-colors ${!notification.read ? 'border-l-4 border-l-primary bg-primary/5' : 'bg-card/40'}`}>
              <CardContent className="p-4 sm:p-6 flex gap-4">
                <div className={`mt-1 shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                  notification.type === 'info' ? 'bg-primary/20 text-primary' :
                  notification.type === 'document' ? 'bg-accent/20 text-accent' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{notification.description}</p>
                  
                  {!notification.read && (
                    <div className="pt-2">
                      <Button variant="link" className="h-auto p-0 text-primary">View details</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
