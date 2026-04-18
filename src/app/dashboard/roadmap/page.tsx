"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, PlayCircle, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const roadmapData = [
  {
    title: "Frontend Foundation",
    description: "Master the core concepts of HTML, CSS, and JavaScript.",
    progress: 100,
    status: "completed",
    modules: 5,
  },
  {
    title: "React & Next.js Mastery",
    description: "Build scalable web applications using modern frameworks.",
    progress: 60,
    status: "in-progress",
    modules: 8,
  },
  {
    title: "System Design Basics",
    description: "Understand how to architecture large scale applications.",
    progress: 0,
    status: "locked",
    modules: 4,
  },
  {
    title: "Behavioral Interviews",
    description: "Ace the cultural and behavioral questions using STAR method.",
    progress: 0,
    status: "locked",
    modules: 6,
  }
];

export default function RoadmapPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Skill Roadmap</h1>
        <p className="text-muted-foreground text-lg">Your personalized path to landing your dream job.</p>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 space-y-12 pb-8">
        {roadmapData.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="relative pl-8 md:pl-12"
          >
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] top-1 p-1 rounded-full bg-background border-2 ${
              item.status === 'completed' ? 'border-primary text-primary' :
              item.status === 'in-progress' ? 'border-accent text-accent' :
              'border-muted text-muted-foreground'
            }`}>
              {item.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> :
               item.status === 'in-progress' ? <Circle className="h-4 w-4 fill-current animate-pulse" /> :
               <Lock className="h-4 w-4" />}
            </div>

            <Card className={`glass-card ${item.status === 'locked' ? 'opacity-70 grayscale-[50%]' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {item.title}
                      {item.status === 'completed' && <Trophy className="h-5 w-5 text-yellow-500" />}
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
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.progress}% Completed</span>
                    {item.status === 'in-progress' && <span className="text-accent font-bold">Current Focus</span>}
                  </div>
                  <Progress value={item.progress} className={`h-2 ${item.status === 'completed' ? '[&>div]:bg-primary' : '[&>div]:bg-accent'}`} />
                  
                  {item.status !== 'locked' && (
                    <div className="pt-4 flex justify-end">
                      <Button variant={item.status === 'completed' ? 'outline' : 'default'} className={item.status === 'in-progress' ? 'bg-accent hover:bg-accent/90 text-white' : ''}>
                        {item.status === 'completed' ? 'Review Material' : (
                          <>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Continue Learning
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
