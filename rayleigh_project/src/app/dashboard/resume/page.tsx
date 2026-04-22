"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, AlertCircle, Sparkles, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    
    setIsAnalyzing(true);
    setProgress(10);
    
    try {
      // Step 1: Simulated progress
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      // Step 2: Real API call
      const res = await fetch("/api/ai/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await res.json();
      clearInterval(interval);
      setProgress(100);

      if (!res.ok) throw new Error(data.error);

      setAnalysis(data);
      setTimeout(() => {
        setIsAnalyzing(false);
        setIsAnalyzed(true);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Resume Analyzer</h1>
        <p className="text-muted-foreground">Paste your resume content to get an instant AI-powered ATS score and improvement suggestions.</p>
      </div>

      {!isAnalyzed ? (
        <Card className="glass-card border-dashed border-2 border-border/60 hover:border-primary/50 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <AnimatePresence mode="wait">
              {!isAnalyzing ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center w-full max-w-2xl"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Paste Resume Content</h3>
                  <textarea 
                    className="w-full h-64 p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm mb-6 resize-none"
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                  <Button size="lg" className="px-8" onClick={handleAnalyze} disabled={!resumeText}>
                    Analyze with AI
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
                  <h3 className="text-xl font-bold mb-2">Analyzing Resume...</h3>
                  <p className="text-muted-foreground mb-6">
                    AI is reviewing your skills, impact metrics, and keyword density.
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
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                      className="text-emerald-500 transition-all duration-1000 ease-out" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (analysis?.score || 0)) / 100} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-foreground">{analysis?.score || 0}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ATS Score</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {analysis?.score > 80 ? "Great Resume!" : analysis?.score > 60 ? "Good Start" : "Needs Improvement"}
                </h2>
                <p className="text-sm text-muted-foreground px-4">
                  {analysis?.score > 80 
                    ? "Your resume is highly optimized. A few minor tweaks can push it even higher." 
                    : "Our AI found several areas where you can significantly improve your ATS compatibility."}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Key Improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis?.suggestions?.map((suggestion: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Skill Gaps</CardTitle>
                <CardDescription>Missing keywords detected by AI.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysis?.skillGaps?.map((skill: string, i: number) => (
                  <span key={i} className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full border border-primary/20">
                    {skill}
                  </span>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Improved Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>AI-Improved Bullet Points</CardTitle>
                <CardDescription>Copy these to your resume for maximum impact.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis?.improvedBullets?.map((bullet: string, i: number) => (
                  <div key={i} className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                        Copy
                      </Button>
                    </div>
                    <div className="flex gap-3">
                      <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{bullet}</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                  <Button className="bg-primary text-white">Optimize Another Resume</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
