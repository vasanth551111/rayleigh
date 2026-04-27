"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2, Circle, Lock, PlayCircle, Loader2, Sparkles, Map, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = not started
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [savedRole, setSavedRole] = useState("");
  const [form, setForm] = useState({
    desiredRole: "Frontend Developer",
    currentSkills: "",
    timeAvailable: "10 hours",
  });

  // Load saved roadmap on mount
  useEffect(() => {
    fetch("/api/ai/roadmap/generate")
      .then((r) => r.json())
      .then((d) => {
        if (d.roadmap?.length) {
          setRoadmap(d.roadmap);
          setSavedRole(d.role || "");
          setCurrentWeek(1);
        }
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, []);

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
      setSavedRole(form.desiredRole);
      setCurrentWeek(1);
      setCompletedWeeks([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWeek = async (weekNumber: number) => {
    setCurrentWeek(weekNumber);
    // Log activity
    await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ROADMAP_WEEK_STARTED",
        title: `Started Week ${weekNumber} of ${savedRole} Roadmap`,
        pointsEarned: 5,
      }),
    }).catch(() => {});
  };

  const handleCompleteWeek = async (weekNumber: number) => {
    setCompletedWeeks((prev) => [...prev, weekNumber]);
    if (weekNumber < roadmap.length) setCurrentWeek(weekNumber + 1);
    await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ROADMAP_WEEK_COMPLETED",
        title: `Completed Week ${weekNumber} of ${savedRole} Roadmap`,
        pointsEarned: 20,
      }),
    }).catch(() => {});
  };

  const progress = roadmap.length > 0 ? (completedWeeks.length / roadmap.length) * 100 : 0;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Skill Roadmap</h1>
        <p className="text-muted-foreground text-lg">Your personalized, AI-generated path to landing your dream job.</p>
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
                <select
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={form.desiredRole}
                  onChange={(e) => setForm({ ...form, desiredRole: e.target.value })}
                  id="roadmap-role-select"
                >
                  {[
                    "Frontend Developer", "Backend Developer", "Full Stack Developer",
                    "React Developer", "Node.js Developer", "DevOps Engineer",
                    "Data Scientist", "Machine Learning Engineer", "Mobile Developer",
                    "UI/UX Designer", "Product Manager", "Cloud Engineer",
                  ].map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Current Skills</label>
                <Input
                  value={form.currentSkills}
                  onChange={(e) => setForm({ ...form, currentSkills: e.target.value })}
                  placeholder="e.g. HTML, CSS, basic JavaScript"
                  id="roadmap-skills-input"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of what you already know.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Available Hours per Week</label>
                <select
                  className="w-full border border-border bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={form.timeAvailable}
                  onChange={(e) => setForm({ ...form, timeAvailable: e.target.value })}
                  id="roadmap-hours-select"
                >
                  {["5 hours", "10 hours", "15 hours", "20 hours", "30+ hours"].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full h-12" disabled={loading} id="roadmap-generate-btn">
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Map className="h-5 w-5 mr-2" />}
                {loading ? "Building your roadmap..." : "Generate AI Roadmap"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress bar */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-bold text-lg">{savedRole} Path</h2>
                  <p className="text-sm text-muted-foreground">
                    {completedWeeks.length}/{roadmap.length} weeks completed
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setRoadmap([]); setCompletedWeeks([]); setCurrentWeek(0); }}
                  id="roadmap-reset-btn"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> New Roadmap
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-10 pb-8">
            <AnimatePresence>
              {roadmap.map((item, index) => {
                const weekNum = item.week || index + 1;
                const isCompleted = completedWeeks.includes(weekNum);
                const isCurrent = currentWeek === weekNum;
                const isLocked = weekNum > currentWeek && !completedWeeks.includes(weekNum - 1) && weekNum !== 1;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="relative pl-8 md:pl-12"
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[11px] top-1 p-1 rounded-full bg-background border-2 ${
                      isCompleted ? "border-emerald-500 text-emerald-500"
                      : isCurrent ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 fill-current" />
                      ) : isCurrent ? (
                        <Circle className="h-4 w-4 fill-current animate-pulse" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </div>

                    <Card className={`glass-card ${isLocked ? "opacity-60" : ""} ${isCurrent ? "border-primary/40" : ""}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                              Week {weekNum}: {item.title}
                              {isCompleted && (
                                <span className="text-xs font-normal bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  Completed
                                </span>
                              )}
                              {isCurrent && !isCompleted && (
                                <span className="text-xs font-normal bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full animate-pulse">
                                  In Progress
                                </span>
                              )}
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

                          {isCompleted ? (
                            <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Week completed — great work!
                            </div>
                          ) : isCurrent ? (
                            <div className="pt-2 flex gap-3">
                              <Button
                                className="bg-primary hover:bg-primary/90 text-white"
                                onClick={() => handleCompleteWeek(weekNum)}
                                id={`complete-week-${weekNum}-btn`}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark Week {weekNum} Complete
                              </Button>
                            </div>
                          ) : !isLocked ? (
                            <div className="pt-2">
                              <Button
                                className="bg-accent hover:bg-accent/90 text-white"
                                onClick={() => handleStartWeek(weekNum)}
                                id={`start-week-${weekNum}-btn`}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Start Week {weekNum}
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
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
