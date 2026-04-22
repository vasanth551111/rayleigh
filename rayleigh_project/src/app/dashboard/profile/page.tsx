"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Briefcase, Camera, Globe, Link as LinkIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      // Show success toast or notification
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar / Photo Card */}
        <div className="md:col-span-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="glass-card text-center">
              <CardContent className="pt-6">
                <div className="relative mx-auto w-32 h-32 rounded-full mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-accent p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold overflow-hidden">
                      {profile?.photoUrl ? (
                        <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profile?.name?.substring(0, 2).toUpperCase() || "JD"
                      )}
                    </div>
                  </div>
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{profile?.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{profile?.experience || "No experience set"}</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Globe className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><LinkIcon className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Details Form */}
        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={profile?.name || ""} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="pl-9" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile?.user?.email || ""} 
                        disabled
                        className="pl-9 bg-muted/50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      value={profile?.bio || ""} 
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input 
                        id="college" 
                        value={profile?.college || ""} 
                        onChange={(e) => setProfile({...profile, college: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input 
                        id="experience" 
                        value={profile?.experience || ""} 
                        onChange={(e) => setProfile({...profile, experience: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">Github</Label>
                      <Input 
                        id="github" 
                        value={profile?.github || ""} 
                        onChange={(e) => setProfile({...profile, github: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input 
                        id="linkedin" 
                        value={profile?.linkedin || ""} 
                        onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button disabled={saving} className="bg-primary text-white">
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
