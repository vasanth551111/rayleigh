"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building2, ExternalLink, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const jobsData = [
  {
    role: "Senior Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    type: "Full-time",
    match: 98,
    salary: "$150k - $200k",
    description: "Looking for an expert React and Next.js engineer to build the future of the web.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    role: "Full Stack Developer",
    company: "Stripe",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    match: 92,
    salary: "$140k - $190k",
    description: "Join our core payments team to build scalable and secure financial infrastructure.",
    skills: ["React", "Node.js", "PostgreSQL", "System Design"],
  },
  {
    role: "UI/UX Engineer",
    company: "Figma",
    location: "Remote",
    type: "Full-time",
    match: 85,
    salary: "$130k - $170k",
    description: "Bridge the gap between design and engineering with pixel-perfect implementation.",
    skills: ["React", "Framer Motion", "CSS/SASS", "Figma API"],
  },
  {
    role: "Frontend Developer",
    company: "Linear",
    location: "Remote",
    type: "Contract",
    match: 78,
    salary: "$80 - $120 / hr",
    description: "Help us build the fastest and most beautiful issue tracker in the world.",
    skills: ["React", "GraphQL", "TypeScript", "Performance Tuning"],
  }
];

export default function JobsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Job Opportunities</h1>
          <p className="text-muted-foreground text-lg">Curated roles based on your interview performance.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">
          <Sparkles className="mr-2 h-4 w-4" />
          Update Preferences
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobsData.map((job, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card h-full flex flex-col hover:border-primary/50 transition-colors group cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{job.role}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground"><Building2 className="h-4 w-4" /> {job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                    </div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
                    {job.match}% Match
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-muted hover:bg-muted font-normal text-xs">{skill}</Badge>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="flex items-center text-muted-foreground"><Briefcase className="h-4 w-4 mr-1.5" /> {job.type}</span>
                    <span className="text-foreground">{job.salary}</span>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                    Apply <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
