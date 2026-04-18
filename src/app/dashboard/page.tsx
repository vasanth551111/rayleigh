"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  UploadCloud, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Flame, 
  PlayCircle,
  ArrowRight,
  FileText,
  GraduationCap,
  Target
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

  // eslint-disable-next-line
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, John! 👋</h1>
          <p className="text-muted-foreground text-lg">Ready for your next breakthrough?</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/resume">
            <Button variant="outline" className="hidden sm:flex border-border bg-background hover:bg-muted">
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Resume
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Taken</CardTitle>
              <Video className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">+3 this week</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confidence Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-background to-muted/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resume Score</CardTitle>
              <Award className="h-4 w-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85/100</div>
              <p className="text-xs text-muted-foreground mt-1 text-emerald-500 font-medium">ATS Optimized</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card border-none bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary">Current Streak</CardTitle>
              <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">7 Days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it up! 3 days to next badge.</p>
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
                <Button variant="ghost" size="sm" className="text-primary">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { title: "Frontend Mock Interview", date: "Today, 10:30 AM", score: 92, type: "interview" },
                  { title: "Resume Uploaded", date: "Yesterday", score: null, type: "resume" },
                  { title: "Behavioral Mock Interview", date: "Oct 12", score: 85, type: "interview" },
                  { title: "System Design Basics", date: "Oct 10", score: null, type: "learning" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      item.type === 'interview' ? 'bg-primary/20 text-primary' : 
                      item.type === 'resume' ? 'bg-accent/20 text-accent' : 
                      'bg-cyan-500/20 text-cyan-500'
                    }`}>
                      {item.type === 'interview' ? <Video className="h-5 w-5" /> : 
                       item.type === 'resume' ? <FileText className="h-5 w-5" /> : 
                       <GraduationCap className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    {item.score && (
                      <div className="text-sm font-bold flex items-center">
                        {item.score}% 
                        <span className="text-xs text-emerald-500 ml-1">↑</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                  <h3 className="font-bold text-lg">Daily Challenge</h3>
                  <p className="text-sm text-muted-foreground mt-1">Answer 1 Behavioral Question</p>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full w-[0%]"></div>
                </div>
                <p className="text-xs text-muted-foreground w-full text-left">0/1 completed</p>
                <Button className="w-full bg-primary text-white mt-2">Start Challenge</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>Based on your 92% confidence score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { role: "Senior Frontend Engineer", company: "Google", type: "Remote", match: 95 },
                { role: "React Developer", company: "Netflix", type: "On-site", match: 88 },
                { role: "UI Engineer", company: "Stripe", type: "Hybrid", match: 82 },
              ].map((job, i) => (
                <div key={i} className="flex flex-col p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">{job.role}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full">
                      {job.match}% Match
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {job.type}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2 group">
                View All Matches <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
