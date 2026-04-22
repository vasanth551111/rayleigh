"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, BookOpen, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const coursesData = [
  {
    title: "Advanced System Design",
    instructor: "Alex Chen",
    duration: "4.5 hours",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    category: "Architecture"
  },
  {
    title: "Mastering React Performance",
    instructor: "Sarah Jenkins",
    duration: "3.2 hours",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    category: "Frontend"
  },
  {
    title: "Behavioral Interview Prep",
    instructor: "Dr. Emily Taylor",
    duration: "2.1 hours",
    rating: 4.7,
    thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop",
    category: "Soft Skills"
  }
];

export default function LearningPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Learning Hub</h1>
        <p className="text-muted-foreground text-lg">Recommended resources to strengthen your weak areas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData.map((course, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col">
              <div className="relative h-48 w-full overflow-hidden">
                <Image 
                  src={course.thumbnail} 
                  alt={course.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-md">
                  {course.category}
                </div>
              </div>
              <CardHeader className="pb-2 flex-1">
                <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                <CardDescription>by {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center"><Clock className="mr-1.5 h-4 w-4" /> {course.duration}</span>
                  <span className="flex items-center text-yellow-500"><Star className="mr-1 h-4 w-4 fill-current" /> {course.rating}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="glass-card bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Need a structured plan?</h3>
            <p className="text-muted-foreground">Check out your personalized skill roadmap to see what you should focus on next.</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white shrink-0">
            <BookOpen className="mr-2 h-4 w-4" />
            Go to Roadmap
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
