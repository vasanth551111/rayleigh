"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PlayCircle, Mic, Video, Volume2, Briefcase, Code2, Users,
  ChevronRight, Sparkles, Shield, Zap, Building2, Coffee
} from "lucide-react";

export interface InterviewConfig {
  role: string;
  domain: string;
  industry: string;
  interviewType: string;
  level: string;
  difficulty: string;
  duration: string;
  personality: string;
  voiceMode: boolean;
  cameraMode: boolean;
}

const ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Data Analyst", "ML Engineer", "DevOps Engineer", "Product Manager",
  "UI/UX Designer", "Business Analyst", "Cloud Architect", "Security Engineer",
  "Mobile Developer", "QA Engineer", "Technical Lead", "Engineering Manager"
];

const DOMAINS: Record<string, string[]> = {
  "Software Engineer": ["JavaScript/TypeScript", "Python", "Java", "Go", "Rust", "C++"],
  "Frontend Developer": ["React", "Vue.js", "Angular", "Next.js", "Svelte", "Web Performance"],
  "Backend Developer": ["Node.js", "Python/Django", "Java/Spring", "Go", "Ruby on Rails", "Microservices"],
  "Full Stack Developer": ["MERN Stack", "MEAN Stack", "Next.js + Prisma", "Django + React", "Laravel + Vue"],
  "Data Scientist": ["Python", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Statistics"],
  "Data Analyst": ["SQL", "Excel/Power BI", "Python/Pandas", "Tableau", "Google Analytics"],
  "ML Engineer": ["TensorFlow", "PyTorch", "MLOps", "Model Deployment", "Feature Engineering"],
  "DevOps Engineer": ["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform", "Monitoring"],
  "Product Manager": ["B2B SaaS", "Consumer Apps", "Platform Products", "Enterprise Software"],
  "UI/UX Designer": ["Figma", "User Research", "Design Systems", "Mobile Design", "Web Design"],
  "Business Analyst": ["Requirements Analysis", "Process Modeling", "Agile/Scrum", "Stakeholder Management"],
  "Cloud Architect": ["AWS", "GCP", "Azure", "Hybrid Cloud", "Cloud Security"],
  "Security Engineer": ["Penetration Testing", "Cloud Security", "AppSec", "Incident Response"],
  "Mobile Developer": ["React Native", "Flutter", "iOS/Swift", "Android/Kotlin"],
  "QA Engineer": ["Test Automation", "Selenium", "Cypress", "Performance Testing", "API Testing"],
  "Technical Lead": ["Team Leadership", "Architecture", "Code Review", "Mentoring"],
  "Engineering Manager": ["People Management", "Technical Strategy", "Hiring", "OKRs"],
};

const INDUSTRIES = [
  "Technology", "Finance/FinTech", "Healthcare", "E-commerce", "Education/EdTech",
  "Gaming", "SaaS", "Consulting", "Media/Entertainment", "Government/Public Sector"
];

const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical", icon: <Code2 className="h-4 w-4" />, desc: "Coding, system design, domain expertise" },
  { value: "hr", label: "HR Round", icon: <Users className="h-4 w-4" />, desc: "Culture fit, goals, communication" },
  { value: "behavioral", label: "Behavioral", icon: <Briefcase className="h-4 w-4" />, desc: "STAR method, past experience" },
  { value: "managerial", label: "Managerial", icon: <Building2 className="h-4 w-4" />, desc: "Leadership, team management" },
  { value: "mixed", label: "Mixed", icon: <Sparkles className="h-4 w-4" />, desc: "All types combined" },
];

const PERSONALITIES = [
  { value: "friendly", label: "Friendly", icon: <Coffee className="h-4 w-4" />, desc: "Warm, encouraging" },
  { value: "corporate", label: "Corporate", icon: <Building2 className="h-4 w-4" />, desc: "Formal, methodical" },
  { value: "tough", label: "Tough", icon: <Shield className="h-4 w-4" />, desc: "Challenging, no fluff" },
  { value: "faang", label: "FAANG", icon: <Zap className="h-4 w-4" />, desc: "Deep technical rigor" },
];

interface SetupProps {
  onStart: (config: InterviewConfig) => void;
}

export function InterviewSetup({ onStart }: SetupProps) {
  const [config, setConfig] = useState<InterviewConfig>({
    role: "Frontend Developer",
    domain: "React",
    industry: "Technology",
    interviewType: "technical",
    level: "mid",
    difficulty: "medium",
    duration: "15",
    personality: "friendly",
    voiceMode: true,
    cameraMode: true,
  });
  const [loading, setLoading] = useState(false);

  const availableDomains = DOMAINS[config.role] || ["General"];

  const update = (key: keyof InterviewConfig, value: any) => {
    setConfig(prev => {
      const next = { ...prev, [key]: value };
      if (key === "role" && DOMAINS[value]) {
        next.domain = DOMAINS[value][0];
      }
      return next;
    });
  };

  const handleStart = async () => {
    setLoading(true);
    onStart(config);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            AI Interview Studio
          </div>
        </div>
        <h1 className="text-5xl font-black tracking-tight mb-3">
          Configure Your <span className="text-gradient">Interview</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl">
          Our AI adapts in real-time to your answers, challenges your weak spots, and coaches you live.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Role & Domain */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Role & Domain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Target Role</label>
                <select
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                  value={config.role}
                  onChange={e => update("role", e.target.value)}
                >
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Domain / Stack</label>
                  <select
                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                    value={config.domain}
                    onChange={e => update("domain", e.target.value)}
                  >
                    {availableDomains.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Industry</label>
                  <select
                    className="w-full p-3 rounded-xl border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
                    value={config.industry}
                    onChange={e => update("industry", e.target.value)}
                  >
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Type */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Interview Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {INTERVIEW_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => update("interviewType", type.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      config.interviewType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40 bg-muted/30"
                    }`}
                  >
                    <div className={`mb-2 ${config.interviewType === type.value ? "text-primary" : "text-muted-foreground"}`}>{type.icon}</div>
                    <div className="font-bold text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{type.desc}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Level & Difficulty */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Experience & Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Experience Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {[["fresher", "Fresher"], ["entry", "Entry"], ["mid", "Mid-Level"], ["senior", "Senior"]].map(([val, label]) => (
                    <button key={val} onClick={() => update("level", val)}
                      className={`py-3 rounded-xl border-2 font-bold text-xs uppercase transition-all ${
                        config.level === val ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Difficulty</label>
                  <div className="flex gap-2">
                    {[["easy", "Easy", "text-emerald-500"], ["medium", "Medium", "text-amber-500"], ["hard", "Hard", "text-red-500"]].map(([val, label, color]) => (
                      <button key={val} onClick={() => update("difficulty", val)}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                          config.difficulty === val ? `border-current ${color} bg-current/10` : "border-border hover:border-primary/40"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Duration</label>
                  <div className="flex gap-2">
                    {[["5", "5 min"], ["15", "15 min"], ["30", "30 min"]].map(([val, label]) => (
                      <button key={val} onClick={() => update("duration", val)}
                        className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                          config.duration === val ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Personality */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">AI Personality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {PERSONALITIES.map(p => (
                <button key={p.value} onClick={() => update("personality", p.value)}
                  className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                    config.personality === p.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"
                  }`}>
                  <div className={config.personality === p.value ? "text-primary" : "text-muted-foreground"}>{p.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                  {config.personality === p.value && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Toggles */}
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Session Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "voiceMode", icon: <Volume2 className="h-4 w-4" />, label: "Voice Mode", desc: "AI speaks questions aloud" },
                { key: "cameraMode", icon: <Video className="h-4 w-4" />, label: "Camera Mode", desc: "Real-time posture analysis" },
              ].map(({ key, icon, label, desc }) => (
                <button key={key} onClick={() => update(key as keyof InterviewConfig, !config[key as keyof InterviewConfig])}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    config[key as keyof InterviewConfig] ? "border-primary/50 bg-primary/5" : "border-border bg-muted/20"
                  }`}>
                  <div className={config[key as keyof InterviewConfig] ? "text-primary" : "text-muted-foreground"}>{icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${config[key as keyof InterviewConfig] ? "bg-primary" : "bg-muted"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${config[key as keyof InterviewConfig] ? "left-5" : "left-0.5"}`} />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Start Button */}
          <Button
            className="w-full h-16 text-lg font-black uppercase tracking-wide shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Initializing AI...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <PlayCircle className="h-6 w-6" />
                Start Interview
                <ChevronRight className="h-5 w-5" />
              </div>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your session is analyzed by AI in real-time. Questions adapt to your answers.
          </p>
        </div>
      </div>
    </div>
  );
}
