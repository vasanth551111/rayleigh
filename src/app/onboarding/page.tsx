"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Briefcase, GraduationCap, Upload, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((p) => Math.min(p + 1, totalSteps));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));
  
  const finishOnboarding = () => {
    // In a real app, save data to backend
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Rayleigh</span>
        </Link>
        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Skip for now
        </Link>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress Stepper */}
        <div className="mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
          
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((num) => (
              <div 
                key={num}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step >= num 
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
                    : "bg-background border-2 border-border text-muted-foreground"
                }`}
              >
                {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-xs font-medium text-muted-foreground">Profile</span>
            <span className="text-xs font-medium text-muted-foreground text-center">Goals</span>
            <span className="text-xs font-medium text-muted-foreground text-right">Resume</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Tell us about yourself</h2>
                  <p className="text-muted-foreground">This helps us personalize your interview scenarios.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "student", icon: <GraduationCap />, label: "Student" },
                    { id: "graduate", icon: <GraduationCap />, label: "Fresh Graduate" },
                    { id: "professional", icon: <Briefcase />, label: "Professional" }
                  ].map((role) => (
                    <div 
                      key={role.id}
                      className="border border-border rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        {role.icon}
                      </div>
                      <span className="font-medium text-sm text-center">{role.label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Current Company / College</Label>
                      <Input id="company" placeholder="e.g. Stanford University" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Less than 1 year (Fresher)</SelectItem>
                          <SelectItem value="1-3">1 - 3 years</SelectItem>
                          <SelectItem value="3-5">3 - 5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">What are your career goals?</h2>
                  <p className="text-muted-foreground">We&apos;ll tailor your AI coach to focus on these areas.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-role">Target Job Role</Label>
                    <Input id="target-role" placeholder="e.g. Frontend Developer, Data Analyst" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Preferred Industry</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">Technology / Software</SelectItem>
                        <SelectItem value="finance">Finance / Banking</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="marketing">Marketing / Agency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label>Biggest Interview Challenge</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {["Nervousness", "Technical Questions", "Behavioral (HR)", "System Design"].map((challenge, i) => (
                        <div key={i} className="border border-border rounded-lg p-3 text-sm font-medium hover:bg-primary/5 hover:border-primary cursor-pointer transition-colors text-center">
                          {challenge}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-2">Upload your resume</h2>
                  <p className="text-muted-foreground">Rayleigh will analyze your resume to generate relevant interview questions.</p>
                </div>
                
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold mb-1">Click to upload or drag and drop</h3>
                  <p className="text-sm text-muted-foreground mb-4">PDF or DOCX (max 5MB)</p>
                  <Button variant="outline">Select File</Button>
                </div>

                <div className="space-y-4 pt-4 border-t border-border mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
                    <Input id="linkedin" placeholder="https://linkedin.com/in/username" className="h-11" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={step === 1}
              className={step === 1 ? "opacity-0" : ""}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white">
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finishOnboarding} className="bg-primary hover:bg-primary/90 text-white px-8">
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
