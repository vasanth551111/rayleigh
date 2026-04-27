"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/ui/location-picker";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Lock, Monitor, Loader2, CheckCircle2, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({ name: "", locationPreference: "" });
  const [prefs, setPrefs] = useState({ emailNotifications: true, marketingEmails: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => {
        if (d.emailNotifications !== undefined) {
          setPrefs({ emailNotifications: d.emailNotifications, marketingEmails: d.marketingEmails });
        }
      })
      .catch(() => {});
      
    fetch("/api/profile")
      .then(r => r.json())
      .then(d => {
        if (!d.error) {
          setProfile({ name: d.name || "", locationPreference: d.locationPreference || "" });
        }
      })
      .catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...prefs, darkMode: theme === "dark" }),
        }),
        fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        })
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Profile Details</CardTitle>
              </div>
              <CardDescription>Update your personal information and job preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location Preferences (Multiple allowed)</Label>
                <LocationPicker 
                  selectedLocations={profile.locationPreference ? profile.locationPreference.split('|').filter(Boolean) : []} 
                  onChange={(locs) => setProfile({ ...profile, locationPreference: locs.join('|') })} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-0">
              <Button onClick={saveSettings} disabled={saving} className="bg-primary text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <CardTitle>Appearance</CardTitle>
              </div>
              <CardDescription>Customize how Rayleigh looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border border-border rounded-lg p-4 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                </div>
                {mounted && (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={theme === 'light' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTheme('light')}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={theme === 'dark' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTheme('dark')}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={theme === 'system' ? 'default' : 'outline'} 
                      size="sm" 
                      onClick={() => setTheme('system')}
                    >
                      System
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {([
                { key: "emailNotifications", title: "Email Notifications", desc: "Receive updates about your mock interviews." },
                { key: "marketingEmails", title: "Marketing Emails", desc: "Tips, product updates, and career resources." },
              ] as const).map((item) => (
                <div key={item.key} className="flex items-center justify-between border border-border rounded-lg p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <Label className="text-base">{item.title}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={prefs[item.key]}
                      onChange={(e) => setPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-0">
              {saved && (
                <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </span>
              )}
              <Button onClick={saveSettings} disabled={saving} className="bg-primary text-white">
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive">
                <Lock className="h-5 w-5" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground">Change Password</Button>
              <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-foreground">Two-Factor Authentication (2FA)</Button>
            </CardContent>
            <CardFooter className="bg-destructive/5 border-t border-destructive/10 rounded-b-xl flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Permanently remove your account and all data.</span>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
