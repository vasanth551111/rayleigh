"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  Star, TrendingUp, Calendar, RotateCcw, Share2,
  MessageSquare, Eye, Volume2, Brain, Target, Users,
  Briefcase, Activity, Award, ArrowRight, Download
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { motion as m } from "framer-motion";

interface ReportProps {
  report: any;
  config: any;
  onRetake: () => void;
}

const SCORE_COLOR = (score: number) =>
  score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-red-500";

const SCORE_BG = (score: number) =>
  score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";

const CATEGORY_ICONS: Record<string, any> = {
  communication: Volume2,
  technicalAccuracy: Brain,
  confidence: Activity,
  answerStructure: Target,
  problemSolving: Brain,
  leadership: Users,
  bodyLanguage: Users,
  professionalism: Briefcase,
  listeningSkill: Volume2,
  eyeContact: Eye,
  vocabulary: MessageSquare,
  roleReadiness: Award,
};

const CATEGORY_LABELS: Record<string, string> = {
  communication: "Communication",
  technicalAccuracy: "Technical Accuracy",
  confidence: "Confidence",
  answerStructure: "Answer Structure",
  problemSolving: "Problem Solving",
  leadership: "Leadership",
  bodyLanguage: "Body Language",
  professionalism: "Professionalism",
  listeningSkill: "Listening Skill",
  eyeContact: "Eye Contact",
  vocabulary: "Vocabulary",
  roleReadiness: "Role Readiness",
};

export function InterviewReport({ report, config, onRetake }: ReportProps) {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [activeWeek, setActiveWeek] = useState(0);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const radarData = Object.entries(report.scores || {}).map(([key, val]) => ({
    subject: CATEGORY_LABELS[key]?.split(" ")[0] || key,
    score: val as number,
    fullMark: 100,
  }));

  const weekPlans = [
    { label: "Week 1", key: "week1", color: "border-primary" },
    { label: "Week 2", key: "week2", color: "border-cyan-500" },
    { label: "Week 3", key: "week3", color: "border-emerald-500" },
    { label: "Week 4", key: "week4", color: "border-amber-500" },
  ];

  const saveToHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem("rayleigh_interview_history") || "[]");
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        role: config.role,
        domain: config.domain,
        score: report.overallScore,
        duration: config.duration,
        report,
      });
      localStorage.setItem("rayleigh_interview_history", JSON.stringify(history.slice(0, 20)));
    } catch (e) {}
  };

  // Save on mount
  useState(() => { saveToHistory(); });

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#0f0f17" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      
      // Handle multi-page pdf if it's too long
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save(`rayleigh-interview-report-${Date.now()}.pdf`);
    } catch (e) {
      console.error("PDF export error:", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleExportPDF}
          disabled={exporting}
          className="border-primary text-primary hover:bg-primary/10"
        >
          {exporting ? <Activity className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download Report
        </Button>
      </div>
      <div ref={reportRef} className="space-y-10 bg-background/50 rounded-xl p-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 px-4 py-1.5 rounded-full text-primary text-sm font-bold mb-6">
          <CheckCircle2 className="h-4 w-4" />
          Interview Complete
        </div>
        <h1 className="text-5xl font-black mb-3 tracking-tight">
          Performance <span className="text-gradient">Report</span>
        </h1>
        <p className="text-muted-foreground text-lg">{config.role} · {config.domain} · {config.level?.toUpperCase()}</p>
        <p className="text-sm text-muted-foreground mt-2 italic">{report.summaryParagraph}</p>
      </motion.div>

      {/* Score Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-primary/20 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-cyan-500" />
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {/* Overall */}
              <div className="md:col-span-1 flex flex-col items-center justify-center">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="hsl(262.1 83.3% 57.8%)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (report.overallScore || 0) / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-primary">{report.overallScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="font-black text-sm uppercase tracking-widest mt-2">Overall</div>
              </div>

              {/* Key scores */}
              {[
                ["Technical", report.scores?.technicalAccuracy, "text-cyan-500"],
                ["Communication", report.scores?.communication, "text-emerald-500"],
                ["Confidence", report.scores?.confidence, "text-amber-500"],
              ].map(([label, score, color]) => (
                <div key={label as string} className="flex flex-col items-center justify-center">
                  <div className={`text-5xl font-black ${color}`}>{score}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Hiring Recommendation */}
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-sm font-bold text-muted-foreground">Hiring Recommendation</span>
              <span className={`font-black px-4 py-1.5 rounded-full text-sm border ${
                report.hiringRecommendation?.includes("Strong") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                report.hiringRecommendation?.includes("Yes") ? "bg-primary/10 border-primary/30 text-primary" :
                report.hiringRecommendation?.includes("Maybe") ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                "bg-red-500/10 border-red-500/30 text-red-500"
              }`}>
                {report.hiringRecommendation}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Radar + Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(240 5.9% 90%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(262.1 83.3% 57.8%)"
                  fill="hsl(262.1 83.3% 57.8%)"
                  fillOpacity={0.3}
                />
                <Tooltip formatter={(v: any) => [`${v}/100`, "Score"]} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* All 12 categories */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 overflow-y-auto max-h-72">
            {Object.entries(report.scores || {}).map(([key, val]) => {
              const score = val as number;
              const Icon = CATEGORY_ICONS[key] || Activity;
              return (
                <div key={key} className="flex items-center gap-3">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium w-28 shrink-0">{CATEGORY_LABELS[key]}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${SCORE_BG(score)}`}
                    />
                  </div>
                  <span className={`text-xs font-black w-8 text-right ${SCORE_COLOR(score)}`}>{score}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-card border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(report.strengths || []).map((s: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{s.point}</p>
                  {s.evidence && <p className="text-xs text-muted-foreground mt-0.5 italic">"{s.evidence}"</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(report.weaknesses || []).map((w: any, i: number) => (
              <div key={i} className="flex gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{w.point}</p>
                  {w.evidence && <p className="text-xs text-muted-foreground mt-0.5 italic">{w.evidence}</p>}
                  {w.improvement && <p className="text-xs text-primary mt-1">→ {w.improvement}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Q&A Review */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Question-by-Question Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(report.questionReviews || []).map((qr: any, i: number) => (
            <div key={i} className="border border-border rounded-2xl overflow-hidden">
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedQ(expandedQ === i ? null : i)}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm ${SCORE_BG(qr.score)}`}>
                    {qr.score}
                  </div>
                  <span className="font-semibold text-sm">Question {i + 1}</span>
                </div>
                {expandedQ === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {expandedQ === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 space-y-4">
                      {qr.whatWasGood && (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                          <p className="text-xs font-black uppercase text-emerald-600 mb-1">What Was Good</p>
                          <p className="text-sm">{qr.whatWasGood}</p>
                        </div>
                      )}
                      {qr.whatToImprove && (
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                          <p className="text-xs font-black uppercase text-amber-600 mb-1">What to Improve</p>
                          <p className="text-sm">{qr.whatToImprove}</p>
                        </div>
                      )}
                      {qr.idealAnswerOutline && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <p className="text-xs font-black uppercase text-primary mb-1">Ideal Answer Outline</p>
                          <p className="text-sm whitespace-pre-line">{qr.idealAnswerOutline}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4-Week Action Plan */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            30-Day Improvement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {weekPlans.map((w, i) => (
              <button key={i} onClick={() => setActiveWeek(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                  activeWeek === i ? `border-primary bg-primary/10 text-primary` : "border-border text-muted-foreground hover:border-primary/40"
                }`}>
                {w.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {(report.actionPlan?.[weekPlans[activeWeek].key] || []).map((action: string, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm font-medium leading-relaxed">{action}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1 h-14 font-black text-lg" onClick={onRetake}>
          <RotateCcw className="h-5 w-5 mr-2" />
          Retake Interview
        </Button>
        <Button variant="outline" className="flex-1 h-14 font-black text-lg"
          onClick={() => window.location.href = "/dashboard"}>
          <ArrowRight className="h-5 w-5 mr-2" />
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
