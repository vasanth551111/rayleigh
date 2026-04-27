"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Download, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ResumeAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    linkedin: "",
    github: "",
    education: "",
    skills: "",
    experience: "",
    targetJob: "",
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
      const profile = await res.json();
      const exp = profile.experience ? (typeof profile.experience === 'string' ? JSON.parse(profile.experience) : profile.experience) : [];
      const edu = profile.education ? (typeof profile.education === 'string' ? JSON.parse(profile.education) : profile.education) : [];
      
      const expText = exp.map((e: any) => `${e.title} at ${e.company} (${e.duration})\n${e.description}`).join("\n\n");
      const eduText = edu.map((e: any) => `${e.degree} from ${e.school} (${e.year})`).join("\n");
      
      setFormData(prev => ({
        ...prev,
        name: profile.name || prev.name,
        skills: profile.skills || prev.skills,
        experience: expText || prev.experience,
        education: eduText || prev.education,
        linkedin: profile.linkedinUrl || prev.linkedin,
        github: profile.githubUrl || prev.github,
      }));
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setProgress(10);
    setError("");
    
    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);

      // Construct a unified resume text from the form fields
      const resumeText = `
Name: ${formData.name}
Contact: ${formData.contact}
LinkedIn: ${formData.linkedin}
GitHub: ${formData.github}

Education:
${formData.education}

Skills:
${formData.skills}

Experience:
${formData.experience}
      `;

      const body = new FormData();
      body.append("resumeText", resumeText);
      body.append("targetJob", formData.targetJob);
      files.forEach((file) => body.append("files", file));

      const res = await fetch("/api/ai/resume/analyze", {
        method: "POST",
        body,
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = async () => {
    if (!resultsRef.current) {
      setError("Analysis results not found for export.");
      return;
    }
    setExporting(true);
    setError("");
    try {
      // Dynamic imports
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      // Small delay for animations
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(resultsRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#010816",
        style: {
          padding: "20px",
        }
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (resultsRef.current.offsetHeight * pdfWidth) / resultsRef.current.offsetWidth;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`rayleigh-analysis-${Date.now()}.pdf`);
    } catch (e: any) {
      console.error("PDF export error:", e);
      setError("Failed to generate PDF. You can try taking a screenshot instead.");
    } finally {
      setExporting(false);
    }
  };

  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-1">Resume Builder & Analyzer</h1>
        <p className="text-muted-foreground">Input your career details and target job description to get an ATS-optimized analysis.</p>
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}
      </div>

      {!isAnalyzed ? (
        <Card className="glass-card">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {!isAnalyzing ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Step Indicator */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                          {s}
                        </div>
                        {s < 3 && <div className={`w-16 h-1 mx-2 rounded-full ${step > s ? "bg-primary" : "bg-muted"}`} />}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Personal Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact (Email/Phone)</Label>
                          <Input value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>LinkedIn URL</Label>
                          <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>GitHub URL</Label>
                          <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2 pt-4">
                        <Label>Education</Label>
                        <Textarea placeholder="e.g. B.S. in Computer Science, University of X (2018-2022)" value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                      </div>
                      <div className="flex justify-end pt-4">
                        <Button onClick={() => setStep(2)}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Professional Details</h3>
                      <div className="space-y-2">
                        <Label>Skills (Comma separated)</Label>
                        <Textarea placeholder="React, Node.js, Python, Leadership..." value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Work Experience</Label>
                        <Textarea className="h-40" placeholder="Software Engineer at TechCorp (2020-Present)\n- Developed X using Y achieving Z..." value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                      </div>
                      <div className="space-y-4">
                        <Label>Upload Certifications (PDF/IMG - Multiple allowed)</Label>
                        <div className="flex items-center gap-4">
                          <Input type="file" multiple className="cursor-pointer" accept=".pdf,.png,.jpg" onChange={handleFileChange} />
                        </div>
                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file, i) => (
                              <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30 border border-border">
                                <span className="text-sm truncate flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  {file.name}
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => removeFile(i)} className="text-destructive hover:bg-destructive/10">Remove</Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button onClick={() => setStep(3)}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Target Role</h3>
                      <div className="space-y-2">
                        <Label>Target Job Description</Label>
                        <Textarea className="h-64" placeholder="Paste the exact job description you are applying for..." value={formData.targetJob} onChange={(e) => setFormData({ ...formData, targetJob: e.target.value })} />
                        <p className="text-xs text-muted-foreground">The AI will analyze your resume specifically against this job description for keyword matches and relevance.</p>
                      </div>
                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                        <Button onClick={handleAnalyze} className="bg-primary text-white"><Sparkles className="mr-2 h-4 w-4" /> Analyze Resume</Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analyzing Resume...</h3>
                  <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Comparing your profile against the target job description...
                  </p>
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsAnalyzed(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Build Another Resume
            </Button>
            <Button onClick={handleExportPDF} disabled={exporting} className="bg-primary text-white">
              {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              Export PDF Report
            </Button>
          </div>

          <div ref={resultsRef} data-export-root className="space-y-6 bg-background p-2 rounded-xl">
            <Card className="glass-card border-none bg-gradient-to-br from-primary/10 via-background to-background">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-muted opacity-20" strokeWidth="10" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary transition-all duration-1000 ease-out" 
                        strokeWidth="10" strokeDasharray={`${analysis?.score * 2.83} 283`} strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{analysis?.score}</span>
                      <span className="text-xs text-muted-foreground uppercase">ATS Score</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Resume Analysis Complete</h2>
                    <p className="text-muted-foreground">Based on industry standards and the target job description.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="text-emerald-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Strengths & Matching Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis?.strengths?.map((str: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-sm">{str}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="glass-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-destructive" /> Missing Keywords & Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis?.weaknesses?.map((wk: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-destructive mt-1">✗</span>
                        <span className="text-sm">{wk}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Actionable Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis?.improvements?.map((imp: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                      <p className="text-sm leading-relaxed pt-1">{imp}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
