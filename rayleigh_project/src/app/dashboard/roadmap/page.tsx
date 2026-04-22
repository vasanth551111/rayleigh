"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Lock, PlayCircle, Trophy, Loader2, Sparkles, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [form, setForm] = useState({
    desiredRole: "Frontend Developer",
    currentSkills: "",
    timeAvailable: "10 hours",
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/ai/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRoadmap(data.roadmap || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Skill Roadmap</h1>
        <p className="text-muted-foreground text-lg">Your personalized path to landing your dream job.</p>
      </div>

      {roadmap.length === 0 ? (
        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Your AI Roadmap
            </CardTitle>
            <CardDescription>Tell us your goals and we&apos;ll build a 4-week path for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Input 
                  value={form.desiredRole} 
                  onChange={(e) => setForm({...form, desiredRole: e.target.value})}
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Skills</label>
                <Input 
                  value={form.currentSkills} 
                  onChange={(e) => setForm({...form, currentSkills: e.target.value})}
                  placeholder="e.g. HTML, CSS, React"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Hours per Week</label>
                <Input 
                  value={form.timeAvailable} 
                  onChange={(e) => setForm({...form, timeAvailable: e.target.value})}
                  placeholder="e.g. 15 hours"
                />
              </div>
              <Button type="submit" className="w-full h-12" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Map className="h-5 w-5 mr-2" />}
                {loading ? "Building your roadmap..." : "Generate AI Roadmap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-12 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your 4-Week {form.desiredRole} Path</h2>
            <Button variant="outline" size="sm" onClick={() => setRoadmap([])}>Reset</Button>
          </div>
          
          <AnimatePresence>
            {roadmap.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative pl-8 md:pl-12"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[11px] top-1 p-1 rounded-full bg-background border-2 ${
                  index === 0 ? 'border-accent text-accent' : 'border-muted text-muted-foreground'
                }`}>
                  {index === 0 ? <Circle className="h-4 w-4 fill-current animate-pulse" /> : <Lock className="h-4 w-4" />}
                </div>

                <Card className={`glass-card ${index > 0 ? 'opacity-70 grayscale-[50%]' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          Week {item.week}: {item.title}
                        </CardTitle>
                        <CardDescription className="mt-1.5">{item.description}</CardDescription>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {item.modules} Modules
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.topics?.map((topic: string, i: number) => (
                          <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">
                            {topic}
                          </span>
                        ))}
                      </div>
                      
                      {index === 0 ? (
                        <div className="pt-2 flex justify-end">
                          <Button className="bg-accent hover:bg-accent/90 text-white">
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start Week 1
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                          <Lock className="h-3 w-3" />
                          Complete previous week to unlock
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
