"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Briefcase, MapPin, Building2, ExternalLink, Search, Loader2, UserCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatSalaryWithCurrency } from "@/lib/currency";

// Curated fallback jobs shown when DB is empty
const FALLBACK_JOBS = [
  {
    id: "j1", title: "Senior Frontend Developer", company: "Vercel", location: "Remote Worldwide, Remote",
    type: "Full-time", salary: "$140k–$190k", remote: true,
    description: "Lead the development of Next.js features and improve the developer experience for millions.",
    skills: "React,Next.js,TypeScript,Rust",
    applyUrl: "https://vercel.com/careers",
    match: 98,
  },
  {
    id: "j2", title: "Full Stack Engineer", company: "Stripe", location: "San Francisco, CA, USA",
    type: "Full-time", salary: "$160k–$210k", remote: false,
    description: "Build global financial infrastructure. Work on checkout, billing, and identity systems.",
    skills: "Ruby,Node.js,React,PostgreSQL",
    applyUrl: "https://stripe.com/jobs",
    match: 92,
  },
  {
    id: "j3", title: "Software Engineer", company: "Google", location: "London, UK",
    type: "Full-time", salary: "£85k–£120k", remote: false,
    description: "Work on Google Cloud Platform and help scale infrastructure for enterprises.",
    skills: "Go,Java,Kubernetes,Distributed Systems",
    applyUrl: "https://careers.google.com",
    match: 88,
  },
  {
    id: "j4", title: "Senior React Developer", company: "Zoho", location: "Chennai, Tamil Nadu, India",
    type: "Full-time", salary: "22L–35L", remote: false,
    description: "Architect complex UI components for Zoho's world-class business applications.",
    skills: "React,JavaScript,Performance,Design Systems",
    applyUrl: "https://www.zoho.com/careers",
    match: 95,
  },
  {
    id: "j5", title: "Mobile Engineer (React Native)", company: "Freshworks", location: "Bengaluru, Karnataka, India",
    type: "Full-time", salary: "20L–30L", remote: true,
    description: "Build the next generation of customer engagement apps on mobile.",
    skills: "React Native,TypeScript,iOS,Android",
    applyUrl: "https://www.freshworks.com/company/careers",
    match: 91,
  },
  {
    id: "j6", title: "Backend Developer", company: "Shopify", location: "Toronto, Canada",
    type: "Full-time", salary: "$110k–$160k", remote: true,
    description: "Scale the world's most successful e-commerce platform using Ruby on Rails.",
    skills: "Ruby,Rails,MySQL,Redis",
    applyUrl: "https://www.shopify.ca/careers",
    match: 84,
  },
  {
    id: "j7", title: "Engineering Manager", company: "Delivery Hero", location: "Berlin, Germany",
    type: "Full-time", salary: "€95k–€130k", remote: false,
    description: "Lead a high-performing squad of engineers in the global food delivery space.",
    skills: "Leadership,Agile,System Design,Architecture",
    applyUrl: "https://careers.deliveryhero.com",
    match: 82,
  },
  {
    id: "j8", title: "Frontend Specialist", company: "Rakuten", location: "Tokyo, Japan",
    type: "Full-time", salary: "¥9M–¥14M", remote: false,
    description: "Join the largest e-commerce site in Japan and build modern web experiences.",
    skills: "Vue.js,TypeScript,CSS,Web Performance",
    applyUrl: "https://rakuten.careers",
    match: 80,
  },
  {
    id: "j9", title: "Systems Engineer", company: "Atlassian", location: "Sydney, Australia",
    type: "Full-time", salary: "$130k–$180k", remote: true,
    description: "Help build and scale Jira and Confluence for millions of users worldwide.",
    skills: "Java,Python,AWS,Site Reliability",
    applyUrl: "https://www.atlassian.com/careers",
    match: 78,
  },
  {
    id: "j10", title: "Full Stack Lead", company: "Swiggy", location: "Hyderabad, Telangana, India",
    type: "Full-time", salary: "25L–40L", remote: false,
    description: "Lead the innovation in food delivery and quick commerce in India.",
    skills: "React,Node.js,Kafka,AWS",
    applyUrl: "https://careers.swiggy.com",
    match: 89,
  },
  {
    id: "j11", title: "Product Engineer", company: "Linear", location: "Remote Worldwide, Remote",
    type: "Contract", salary: "$120k–$180k", remote: true,
    description: "Work on the world's best issue tracker. Focus on craft, speed, and design.",
    skills: "React,GraphQL,TypeScript,Linear",
    applyUrl: "https://linear.app/careers",
    match: 94,
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "remote" | "onsite">("all");
  const [profileComplete, setProfileComplete] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [locationPref, setLocationPref] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const pref = await fetchProfile();
      fetchJobs(pref);
    };
    init();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.locationPreference) {
          setLocationPref(data.locationPreference);
          return data.locationPreference;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const fetchJobs = async (location?: string | null) => {
    setLoading(true);
    try {
      const url = new URL("/api/jobs", window.location.origin);
      if (location) url.searchParams.set("location", location);
      
      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && Array.isArray(data) && data.length > 0) {
        setJobs(data);
      } else {
        // If no jobs match the location in DB, show curated fallbacks but try to match location
        setJobs(FALLBACK_JOBS);
      }
    } catch {
      setJobs(FALLBACK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string, applyUrl?: string) => {
    // If it's a fallback job with an external URL, just open it
    if (applyUrl) {
      window.open(applyUrl, "_blank");
      return;
    }
    setApplying(jobId);
    try {
      await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
    } catch {}
    finally { setApplying(null); }
  };

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "remote" && job.remote) ||
      (filter === "onsite" && !job.remote);
    
    // Strict location filtering: if user has preferences, only show matching jobs
    let matchesLocation = true;
    if (locationPref && locationPref.trim() !== "") {
      const prefs = locationPref.toLowerCase().split('|').flatMap(p => p.split(',').map(s => s.trim()));
      matchesLocation = prefs.some(p => 
        p.length > 2 && (
          job.location?.toLowerCase().includes(p) || 
          (p.includes("remote") && job.remote)
        )
      );
    }

    return matchesSearch && matchesFilter && matchesLocation;
  });

  // If filtered is empty, allow showing Remote jobs as recommendations
  const finalJobs = filtered.length > 0 ? filtered : jobs.filter(j => 
    j.remote && 
    (!searchQuery || 
     j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     j.company?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort jobs by location preference match if available
  const sorted = [...finalJobs].sort((a, b) => {
    if (!locationPref) return 0;
    const prefs = locationPref.toLowerCase().split('|').flatMap(p => p.split(',').map(s => s.trim()));
    const aMatch = prefs.some(p => p.length > 2 && (a.location?.toLowerCase().includes(p) || (p.includes("remote") && a.remote)));
    const bMatch = prefs.some(p => p.length > 2 && (b.location?.toLowerCase().includes(p) || (p.includes("remote") && b.remote)));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Job Opportunities</h1>
          <p className="text-muted-foreground text-lg">
            Curated roles matched to your interview performance and skill profile.
          </p>
        </div>
        <Link href="/dashboard/profile">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <UserCircle2 className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </Link>
      </div>

      {locationPref && (
        <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-md flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          {filtered.length > 0 ? (
            <span>Jobs are prioritized for: <strong>{locationPref.split('|').join(', ')}</strong></span>
          ) : (
            <span>No exact matches for your locations. Showing <strong>Remote Recommendations</strong> instead.</span>
          )}
        </div>
      )}

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-border"
            id="jobs-search-input"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "remote", "onsite"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-primary text-white" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6 space-y-4 animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium text-lg">No jobs found.</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((job, index) => (
            <motion.div
              key={job.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <Card className="glass-card h-full flex flex-col hover:border-primary/50 transition-colors group cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <Building2 className="h-4 w-4" /> {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {job.location || (job.remote ? "Remote" : "On-site")}
                        </span>
                      </div>
                    </div>
                    {job.match && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold px-3 py-1 rounded-full text-sm shrink-0 ml-2">
                        {job.match}% Match
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(job.skills || "")
                      .split(",")
                      .filter(Boolean)
                      .map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-muted font-normal text-xs">
                          {skill.trim()}
                        </Badge>
                      ))}
                  </div>
                  <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <span className="flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1.5" /> {job.type}
                      </span>
                      {job.salary && <span className="text-foreground">{formatSalaryWithCurrency(job.salary, job.location || locationPref || "")}</span>}
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() => handleApply(job.id, job.applyUrl)}
                      disabled={applying === job.id}
                      id={`apply-btn-${job.id}`}
                    >
                      {applying === job.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <ExternalLink className="mr-1.5 h-3 w-3" />
                      )}
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
