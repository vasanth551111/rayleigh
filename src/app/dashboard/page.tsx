"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  UploadCloud, 
  Briefcase, 
  Award, 
  Flame, 
  PlayCircle,
  ArrowRight,
  FileText,
  GraduationCap,
  Target,
  Loader2,
  ClipboardList,
  Star,
  Zap
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const progressData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 74 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 92 },
];

export default function DashboardHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [challenge, setChallenge] = useState<any>(null);
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
        setChallenge(data.challenge);
        setUserName(data.userName || "there");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded-md animate-pulse"></div>
            <div className="h-6 w-48 bg-muted rounded-md animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-36 bg-muted rounded-md animate-pulse hidden sm:block"></div>
            <div className="h-10 w-48 bg-muted rounded-md animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 h-28 bg-muted/50 animate-pulse border-none"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6 h-[400px] bg-muted/50 animate-pulse border-none"></div>
          </div>
          <div className="space-y-6">
            <div className="glass-card rounded-xl p-6 h-40 bg-muted/50 animate-pulse border-none"></div>
            <div className="glass-card rounded-xl p-6 h-64 bg-muted/50 animate-pulse border-none"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground text-lg">Ready for your next breakthrough?</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/resume">
            <Button variant="outline" className="hidden sm:flex border-border bg-background hover:bg-muted">
              <UploadCloud className="mr-2 h-4 w-4" />
              Analyze Resume
            </Button>
          </Link>
          <Link href="/dashboard/interview">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.interviews ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.interviews > 0 ? "AI sessions completed" : "No interviews yet"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.applications ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.applications > 0 ? "Jobs applied to" : "Browse jobs to start"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resume Score</CardTitle>
              <Award className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.atsScore ?? 0}/100</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.atsScore > 0 ? "ATS compatibility" : "Analyze your resume"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Day Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-1">
                {stats?.streak ?? 0}
                {(stats?.streak ?? 0) > 0 && <span className="text-orange-500 text-2xl">🔥</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.streak > 0 ? "Consecutive days active" : "Start your streak today!"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">XP Points</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalPoints ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.totalPoints > 0 ? "Total XP earned" : "Complete tasks to earn XP"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card bg-card/40 border-border/50">
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Your overall interview performance score over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(262.1 83.3% 57.8%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(262.1 83.3% 57.8%)" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-card/40 border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest interview sessions and updates.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground font-medium">No activity yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">Start your first mock interview to see your activity here.</p>
                  <Link href="/dashboard/interview" className="mt-4">
                    <Button size="sm" className="bg-primary text-white">
                      Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        item.type === 'interview' ? 'bg-primary/20 text-primary' : 
                        item.type === 'application' ? 'bg-accent/20 text-accent' : 
                        'bg-cyan-500/20 text-cyan-500'
                      }`}>
                        {item.type === 'interview' ? <Video className="h-5 w-5" /> : 
                         item.type === 'application' ? <FileText className="h-5 w-5" /> : 
                         <GraduationCap className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                      <div className="text-sm font-bold flex items-center">
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Widget */}
        <div className="space-y-6">
          <Card className="glass-card bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-background rounded-full p-1 border-2 border-primary border-dashed animate-[spin_10s_linear_infinite]">
                  <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{challenge?.title ?? "Daily Challenge"}</h3>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                      <Flame className="h-3 w-3" /> +{challenge?.points ?? 10} pts
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{challenge?.description ?? "Answer 1 Behavioral Question"}</p>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full w-[0%]"></div>
                </div>
                <p className="text-xs text-muted-foreground w-full text-left">0/1 completed</p>
                <Link href="/dashboard/interview" className="w-full">
                  <Button className="w-full bg-primary text-white mt-2">Start Challenge</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Job Opportunities</CardTitle>
              <CardDescription>Curated matches based on your profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">Complete your profile to unlock personalized job matches.</p>
                <Link href="/dashboard/jobs" className="mt-4 w-full">
                  <Button variant="outline" className="w-full group">
                    Browse Job Board <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
