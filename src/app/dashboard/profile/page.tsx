"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, MapPin, Briefcase, Camera, Globe, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
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
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold">
                      JD
                    </div>
                  </div>
                  <Button size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground mb-4">Frontend Developer</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Globe className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><LinkIcon className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Globe className="h-4 w-4" /></Button>
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="firstName" defaultValue="John" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="lastName" defaultValue="Doe" className="pl-9" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="location" defaultValue="San Francisco, CA" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Current Role</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="role" defaultValue="Frontend Developer" className="pl-9" />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button className="bg-primary text-white">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
