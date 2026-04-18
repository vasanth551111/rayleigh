"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, AlertCircle, Sparkles, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            setIsAnalyzed(true);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume to get an instant AI-powered ATS score and improvement suggestions.</p>
      </div>

      {!isAnalyzed ? (
        <Card className="glass-card border-dashed border-2 border-border/60 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <AnimatePresence mode="wait">
              {!isAnalyzing ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Drag & Drop your Resume</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Supports PDF, DOCX, and TXT files up to 5MB. We&apos;ll extract your skills and experience automatically.
                  </p>
                  <Button size="lg" className="px-8" onClick={handleUpload}>
                    Browse Files
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full max-w-md mx-auto"
                >
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="h-10 w-10 text-accent animate-spin-slow" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyzing Resume with AI...</h3>
                  <p className="text-muted-foreground mb-6">
                    Checking ATS compatibility, keyword density, and formatting.
                  </p>
                  <Progress value={progress} className="w-full h-2 mb-2" />
                  <p className="text-sm font-medium text-right w-full">{progress}%</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column: Score & Summary */}
          <div className="space-y-6">
            <Card className="glass-card bg-gradient-to-br from-primary/5 to-transparent border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={() => setIsAnalyzed(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="pt-6 pb-8 flex flex-col items-center text-center">
                <div className="relative w-40 h-40 mb-4">
                  {/* Circular Progress SVG Placeholder */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray="283" strokeDashoffset="42" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-foreground">85</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ATS Score</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">Great Resume!</h2>
                <p className="text-sm text-muted-foreground px-4">
                  Your resume is highly optimized for the <strong>Frontend Developer</strong> role. A few minor tweaks can push it to 95+.
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Keywords Match</div>
                    <div className="text-xl font-bold text-emerald-500">92%</div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-border">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Impact Metrics</div>
                    <div className="text-xl font-bold text-orange-500">60%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold">Quantify your impact</h4>
                    <p className="text-xs text-muted-foreground mt-1">Add more numbers to your experience. E.g., &quot;Improved performance by 20%&quot; instead of &quot;Improved performance&quot;.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold">Missing Key Skill</h4>
                    <p className="text-xs text-muted-foreground mt-1">The job description requires &apos;GraphQL&apos;, but it&apos;s missing from your skills section.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Before/After & Edits */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50 mb-4">
                <div>
                  <CardTitle>Resume Content Review</CardTitle>
                  <CardDescription>Hover over highlighted areas to see suggestions.</CardDescription>
                </div>
                <div className="flex bg-muted rounded-lg p-1">
                  <Button variant="ghost" size="sm" className="h-7 text-xs bg-background shadow-sm">Experience</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Summary</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">Skills</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Before / After Example */}
                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/50 px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Work Experience - Bullet Point 1
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-4 border-r border-border bg-destructive/5 relative group">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded uppercase">Current</div>
                        <p className="text-sm mt-4 text-foreground/80">
                          Developed web applications using React and Tailwind CSS for various clients.
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 relative">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Suggestion
                        </div>
                        <p className="text-sm mt-4">
                          Architected and developed <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium px-1 rounded">high-performance web applications</span> using React and Tailwind CSS, resulting in a <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium px-1 rounded">30% reduction in load times</span> for 5+ enterprise clients.
                        </p>
                        <Button size="sm" className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">Apply Suggestion</Button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden">
                    <div className="bg-muted/50 px-4 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Work Experience - Bullet Point 2
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-4 border-r border-border bg-destructive/5 relative group">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded uppercase">Current</div>
                        <p className="text-sm mt-4 text-foreground/80">
                          Collaborated with backend team to integrate APIs.
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 relative">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Suggestion
                        </div>
                        <p className="text-sm mt-4">
                          Collaborated seamlessly with backend engineering teams to integrate <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium px-1 rounded">RESTful APIs</span>, ensuring <span className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium px-1 rounded">robust data synchronization</span> and zero downtime.
                        </p>
                        <Button size="sm" className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white">Apply Suggestion</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                  <Button className="bg-primary text-white">Download Optimized Resume</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
