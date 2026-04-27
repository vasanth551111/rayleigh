"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen, Play, GraduationCap, Code2, Brain, Users, Mic } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    id: "technical",
    label: "Technical",
    icon: Code2,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    resources: [
      {
        title: "CS50: Introduction to Computer Science",
        platform: "Harvard / edX",
        url: "https://cs50.harvard.edu/x/",
        type: "Course",
        free: true,
        description: "The world's best intro CS course. Covers C, Python, SQL, JavaScript, and web.",
      },
      {
        title: "The Odin Project",
        platform: "Free",
        url: "https://www.theodinproject.com/",
        type: "Curriculum",
        free: true,
        description: "Full-stack web dev curriculum — HTML, CSS, JS, Node, React, and databases.",
      },
      {
        title: "freeCodeCamp – Full JavaScript Course",
        platform: "YouTube",
        url: "https://www.youtube.com/watch?v=jS4aFq5-91M",
        type: "Video",
        free: true,
        description: "7-hour comprehensive JavaScript course for beginners and intermediates.",
      },
      {
        title: "Next.js Documentation",
        platform: "Vercel",
        url: "https://nextjs.org/docs",
        type: "Docs",
        free: true,
        description: "Official Next.js docs — learn routing, RSC, server actions, and deployment.",
      },
    ],
  },
  {
    id: "system-design",
    label: "System Design",
    icon: Brain,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    resources: [
      {
        title: "System Design Primer",
        platform: "GitHub",
        url: "https://github.com/donnemartin/system-design-primer",
        type: "Guide",
        free: true,
        description: "The most comprehensive open-source guide to system design interview prep.",
      },
      {
        title: "Designing Data-Intensive Applications",
        platform: "O'Reilly",
        url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
        type: "Book",
        free: false,
        description: "The definitive book on scalable, reliable, and maintainable systems.",
      },
      {
        title: "System Design Interview – A Step-By-Step Guide",
        platform: "YouTube / ByteByteGo",
        url: "https://www.youtube.com/@ByteByteGo",
        type: "Video",
        free: true,
        description: "Visual explanations of real interview questions: URL shortener, Twitter, Netflix.",
      },
    ],
  },
  {
    id: "dsa",
    label: "DSA & LeetCode",
    icon: GraduationCap,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    resources: [
      {
        title: "NeetCode.io – Roadmap + Solutions",
        platform: "NeetCode",
        url: "https://neetcode.io/roadmap",
        type: "Roadmap",
        free: true,
        description: "Curated LeetCode problem roadmap with video solutions. 150 essential problems.",
      },
      {
        title: "LeetCode",
        platform: "LeetCode",
        url: "https://leetcode.com/",
        type: "Practice",
        free: true,
        description: "The go-to platform for coding interview prep. Solve daily problems in any language.",
      },
      {
        title: "Grokking Algorithms",
        platform: "Manning",
        url: "https://www.manning.com/books/grokking-algorithms",
        type: "Book",
        free: false,
        description: "Illustrated, beginner-friendly guide to algorithms with practical Python examples.",
      },
    ],
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    resources: [
      {
        title: "STAR Method – Complete Guide",
        platform: "Indeed",
        url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique",
        type: "Guide",
        free: true,
        description: "Master the Situation-Task-Action-Result framework for behavioral questions.",
      },
      {
        title: "Jeff H. Sipe – Behavioral Interview Prep",
        platform: "YouTube",
        url: "https://www.youtube.com/@JeffHSipe",
        type: "Video",
        free: true,
        description: "Ex-Google recruiter shares real behavioral interview insights and answers.",
      },
      {
        title: "Mock Interview with ChatGPT",
        platform: "OpenAI",
        url: "https://chat.openai.com/",
        type: "Tool",
        free: true,
        description: "Practice behavioral questions anytime using ChatGPT as a mock interviewer.",
      },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: Mic,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    resources: [
      {
        title: "Toastmasters – Public Speaking",
        platform: "Toastmasters",
        url: "https://www.toastmasters.org/",
        type: "Community",
        free: false,
        description: "Join a local or online club to build confidence in speaking and leadership.",
      },
      {
        title: "Communication Skills for Beginners",
        platform: "Coursera",
        url: "https://www.coursera.org/learn/communication",
        type: "Course",
        free: true,
        description: "Learn active listening, feedback, and professional communication from scratch.",
      },
    ],
  },
];

const typeIcons: Record<string, any> = {
  Video: Play,
  Course: GraduationCap,
  Docs: BookOpen,
  Guide: BookOpen,
  Book: BookOpen,
  Curriculum: GraduationCap,
  Roadmap: BookOpen,
  Practice: Code2,
  Tool: Brain,
  Community: Users,
};

export default function LearningPage() {
  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Hub</h1>
        <p className="text-muted-foreground text-lg">
          Curated, free & paid resources to sharpen every dimension of your interview game.
        </p>
      </div>

      {categories.map((cat, catIdx) => {
        const Icon = cat.icon;
        return (
          <motion.section
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${cat.color}`} />
              </div>
              <h2 className="text-xl font-bold">{cat.label}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.resources.map((res, i) => {
                const TypeIcon = typeIcons[res.type] || BookOpen;
                return (
                  <Card
                    key={i}
                    className={`glass-card h-full flex flex-col hover:border-primary/50 transition-all duration-200 group border ${cat.border} hover:border-primary/50`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
                          {res.title}
                        </CardTitle>
                        <div className="flex gap-1 shrink-0">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-semibold ${cat.bg} ${cat.color} border ${cat.border}`}
                          >
                            {res.type}
                          </Badge>
                          {res.free ? (
                            <Badge variant="secondary" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              FREE
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                              PAID
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-xs">{res.platform}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{res.description}</p>
                      <a href={res.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                          <ExternalLink className="mr-2 h-3 w-3" />
                          Open Resource
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {/* CTA to Roadmap */}
      <Card className="glass-card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Want a structured week-by-week plan?</h3>
            <p className="text-muted-foreground">
              Generate your personalized AI skill roadmap with weekly learning goals.
            </p>
          </div>
          <Link href="/dashboard/roadmap">
            <Button className="bg-primary hover:bg-primary/90 text-white shrink-0">
              <BookOpen className="mr-2 h-4 w-4" />
              Go to Roadmap
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
