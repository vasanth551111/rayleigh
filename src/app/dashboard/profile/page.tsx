"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, Mail, MapPin, Briefcase, Camera, Globe, Link as LinkIcon, 
  Loader2, Plus, Trash2, GraduationCap, Award, Rocket, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { LocationPicker } from "@/components/ui/location-picker";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>({
    name: "",
    bio: "",
    locationPreference: "",
    skills: "",
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    githubUrl: "",
    linkedinUrl: "",
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Parse JSON strings if they come back as strings
      setProfile({
        ...data,
        experience: data.experience ? (typeof data.experience === 'string' ? JSON.parse(data.experience) : data.experience) : [],
        education: data.education ? (typeof data.education === 'string' ? JSON.parse(data.education) : data.education) : [],
        projects: data.projects ? (typeof data.projects === 'string' ? JSON.parse(data.projects) : data.projects) : [],
        certifications: data.certifications ? (typeof data.certifications === 'string' ? JSON.parse(data.certifications) : data.certifications) : [],
      });
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
      // Could show a success toast here
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (listName: string, template: any) => {
    setProfile({ ...profile, [listName]: [...profile[listName], { ...template, id: Date.now().toString() }] });
  };

  const removeItem = (listName: string, id: string) => {
    setProfile({ ...profile, [listName]: profile[listName].filter((item: any) => item.id !== id) });
  };

  const updateItem = (listName: string, id: string, field: string, value: string) => {
    setProfile({
      ...profile,
      [listName]: profile[listName].map((item: any) => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Rocket },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Professional Profile
          </h1>
          <p className="text-muted-foreground text-lg italic">
            This information will be used to generate your resume and match you with jobs.
          </p>
        </div>
        <Button 
          onClick={handleUpdate} 
          disabled={saving}
          className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "personal" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>How employers will reach you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        value={profile.name || ""} 
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="pl-9 bg-muted/20"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location Preferences (Multiple allowed)</Label>
                    <LocationPicker 
                      selectedLocations={profile.locationPreference ? profile.locationPreference.split('|').filter(Boolean) : []} 
                      onChange={(locs) => setProfile({...profile, locationPreference: locs.join('|')})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Summary</Label>
                  <Textarea 
                    id="bio" 
                    value={profile.bio || ""} 
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="A brief overview of your professional background and goals..."
                    className="min-h-[100px] bg-muted/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Technical Skills</Label>
                  <Input 
                    id="skills" 
                    value={profile.skills || ""} 
                    onChange={(e) => setProfile({...profile, skills: e.target.value})}
                    placeholder="e.g. React, Node.js, Python, AWS (comma separated)"
                    className="bg-muted/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input 
                      id="github" 
                      value={profile.githubUrl || ""} 
                      onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                      placeholder="https://github.com/username"
                      className="bg-muted/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input 
                      id="linkedin" 
                      value={profile.linkedinUrl || ""} 
                      onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/username"
                      className="bg-muted/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </h3>
                <Button onClick={() => addItem("education", { school: "", degree: "", year: "" })} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4 mr-1" /> Add Education
                </Button>
              </div>

              {profile.education.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No education added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.education.map((edu: any) => (
                    <Card key={edu.id} className="glass-card relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 group-hover:bg-primary transition-colors" />
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">School/University</Label>
                              <Input value={edu.school} onChange={(e) => updateItem("education", edu.id, "school", e.target.value)} placeholder="e.g. Stanford University" className="h-9 bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Degree</Label>
                              <Input value={edu.degree} onChange={(e) => updateItem("education", edu.id, "degree", e.target.value)} placeholder="e.g. B.S. Computer Science" className="h-9 bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Year</Label>
                              <Input value={edu.year} onChange={(e) => updateItem("education", edu.id, "year", e.target.value)} placeholder="e.g. 2022" className="h-9 bg-muted/20" />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem("education", edu.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work Experience
                </h3>
                <Button onClick={() => addItem("experience", { title: "", company: "", duration: "", description: "" })} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>

              {profile.experience.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No experience added yet. Click the button above to add your first role.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.experience.map((exp: any) => (
                    <Card key={exp.id} className="glass-card relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 group-hover:bg-primary transition-colors" />
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Job Title</Label>
                              <Input value={exp.title} onChange={(e) => updateItem("experience", exp.id, "title", e.target.value)} placeholder="e.g. Software Engineer" className="h-9 bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Company</Label>
                              <Input value={exp.company} onChange={(e) => updateItem("experience", exp.id, "company", e.target.value)} placeholder="e.g. Google" className="h-9 bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Duration</Label>
                              <Input value={exp.duration} onChange={(e) => updateItem("experience", exp.id, "duration", e.target.value)} placeholder="e.g. Jan 2020 - Present" className="h-9 bg-muted/20" />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem("experience", exp.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">Description</Label>
                          <Textarea value={exp.description} onChange={(e) => updateItem("experience", exp.id, "description", e.target.value)} placeholder="Describe your key achievements and responsibilities..." className="min-h-[80px] bg-muted/20" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Key Projects
                </h3>
                <Button onClick={() => addItem("projects", { title: "", description: "", link: "", tech: "" })} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4 mr-1" /> Add Project
                </Button>
              </div>

              {profile.projects.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No projects added yet. Showcase your work!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.projects.map((proj: any) => (
                    <Card key={proj.id} className="glass-card relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/30 group-hover:bg-accent transition-colors" />
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Project Title</Label>
                              <Input value={proj.title} onChange={(e) => updateItem("projects", proj.id, "title", e.target.value)} placeholder="e.g. E-commerce Platform" className="h-9 bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] uppercase text-muted-foreground">Project Link (GitHub/Live)</Label>
                              <Input value={proj.link} onChange={(e) => updateItem("projects", proj.id, "link", e.target.value)} placeholder="https://..." className="h-9 bg-muted/20" />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem("projects", proj.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">Technologies Used</Label>
                          <Input value={proj.tech} onChange={(e) => updateItem("projects", proj.id, "tech", e.target.value)} placeholder="e.g. Next.js, Firebase, Stripe" className="h-9 bg-muted/20" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground">Summary</Label>
                          <Textarea value={proj.description} onChange={(e) => updateItem("projects", proj.id, "description", e.target.value)} placeholder="What did you build and what was your impact?" className="min-h-[80px] bg-muted/20" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications & Proofs
                </h3>
                <Button onClick={() => addItem("certifications", { name: "", issuer: "", date: "" })} variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                  <Plus className="h-4 w-4 mr-1" /> Add Certification
                </Button>
              </div>

              {profile.certifications.length === 0 ? (
                <div className="text-center py-12 bg-muted/10 border border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No certifications added. Add your credentials here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certifications.map((cert: any) => (
                    <Card key={cert.id} className="glass-card group hover:border-primary/50 transition-colors">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between">
                          <Award className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                          <Button variant="ghost" size="icon" onClick={() => removeItem("certifications", cert.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Certificate Name</Label>
                            <Input value={cert.name} onChange={(e) => updateItem("certifications", cert.id, "name", e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" className="h-9 bg-muted/20" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground">Issuing Organization</Label>
                            <Input value={cert.issuer} onChange={(e) => updateItem("certifications", cert.id, "issuer", e.target.value)} placeholder="e.g. Amazon Web Services" className="h-9 bg-muted/20" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
