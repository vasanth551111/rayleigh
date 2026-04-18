"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Target, TrendingUp, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                Introducing Rayleigh AI 2.0
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
              >
                Master Interviews with AI. <br className="hidden md:block" />
                <span className="text-gradient">Land Your Dream Job.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground max-w-2xl"
              >
                Rayleigh is your personal AI career coach. Practice realistic mock interviews, 
                optimize your resume, and build the confidence to crack any interview.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/25">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm border-border">
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Mockup Section */}
        <section className="pb-20 relative z-20 -mt-10 md:-mt-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="container mx-auto max-w-5xl rounded-2xl md:rounded-[2rem] border border-white/10 glass-card p-2 md:p-4 shadow-2xl overflow-hidden"
          >
            <div className="relative aspect-video rounded-xl md:rounded-3xl overflow-hidden bg-muted">
              <Image 
                src="/hero-mockup.png" 
                alt="Rayleigh AI Dashboard Preview" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">50k+</div>
                <div className="text-sm text-muted-foreground font-medium">Mock Interviews</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">92%</div>
                <div className="text-sm text-muted-foreground font-medium">Confidence Improvement</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">10k+</div>
                <div className="text-sm text-muted-foreground font-medium">Resumes Optimized</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground font-medium">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Rayleigh Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to transform your interview skills from anxious to confident.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />
              
              {[
                {
                  icon: <Target className="h-8 w-8 text-primary" />,
                  title: "1. Build Your Profile",
                  desc: "Upload your resume and tell us your dream role. Rayleigh analyzes your profile instantly."
                },
                {
                  icon: <Bot className="h-8 w-8 text-primary" />,
                  title: "2. Practice with AI",
                  desc: "Face realistic interview scenarios tailored to your target job, with real-time feedback."
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-primary" />,
                  title: "3. Track & Improve",
                  desc: "Get detailed reports on your communication, confidence, and technical accuracy to improve daily."
                }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-background border border-border shadow-lg flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Invest in your career with a plan that fits your needs.</p>
            </div>
            
            <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
              {/* Free Tier */}
              <div className="glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground mb-6">Perfect for preparing for your first interview.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {["3 AI Mock Interviews/month", "Basic Resume Analysis", "Standard Feedback", "Community Access"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full py-6 rounded-xl border-primary text-primary hover:bg-primary/10">Get Started</Button>
              </div>

              {/* Pro Tier */}
              <div className="glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden border-primary/50 shadow-[0_0_40px_-15px_rgba(139,92,246,0.3)]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent" />
                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$19</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground mb-6">For serious job seekers wanting an edge.</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {["Unlimited Mock Interviews", "Advanced Resume Optimization", "Detailed Confidence Coaching", "Custom Skill Roadmaps", "AI Voice Trainer"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full py-6 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">Upgrade to Pro</Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to crack your next interview?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Join thousands of successful candidates who landed their dream roles using Rayleigh.</p>
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 text-lg bg-foreground text-background hover:bg-foreground/90 rounded-full">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
