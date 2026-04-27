"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Briefcase, TrendingUp, Plus, 
  ArrowUpRight, Clock, CheckCircle2, MessageSquare 
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatSalaryWithCurrency } from "@/lib/currency";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecentJobs(data.slice(0, 3));
        setStats({
          activeJobs: data.length,
          totalApplications: data.length * 12, // Mocking some apps
          shortlisted: Math.floor(data.length * 4.5),
          interviews: Math.floor(data.length * 2.1)
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Active Jobs", value: stats.activeJobs, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Applications", value: stats.totalApplications, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Shortlisted", value: stats.shortlisted, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Interviews", value: stats.interviews, icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Recruiter Dashboard</h1>
          <p className="text-muted-foreground italic">Manage your hiring pipeline and job listings.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/recruiter/jobs">
            <Button className="bg-primary text-white shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-emerald-500 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Job Postings</h2>
            <Link href="/dashboard/recruiter/jobs" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {recentJobs.map((job) => (
              <Card key={job.id} className="glass-card group hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatSalaryWithCurrency(job.salary, job.location)}</p>
                      <p className="text-xs text-muted-foreground">12 applications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-bold">Ankit Kumar</span> applied for <span className="font-bold text-primary">Senior Frontend Engineer</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
