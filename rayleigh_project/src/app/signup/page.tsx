"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Target, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // SIMULATION MODE: Redirect directly
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
        
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">Rayleigh</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-muted-foreground mb-8">Start your journey to interview mastery</p>
          
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                required 
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                required 
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>I am a:</Label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                    role === "STUDENT" 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("RECRUITER")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                    role === "RECRUITER" 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>
            
            <Button disabled={loading} type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 mt-4">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full h-11 border-border bg-background hover:bg-muted mb-8">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign up with Google
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Illustration/Gradient */}
      <div className="hidden md:flex flex-1 relative bg-muted items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        <div className="relative z-10 flex flex-col items-center max-w-lg text-center px-8">
          <div className="mb-8 relative w-64 h-64">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-primary to-accent rounded-full opacity-20 blur-2xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-tr from-primary to-accent rounded-full opacity-60 backdrop-blur-3xl shadow-2xl flex items-center justify-center border border-white/20">
              <Target className="w-12 h-12 text-white" />
            </div>
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/10 rounded-lg border border-white/20 backdrop-blur-md rotate-12" />
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full border border-white/20 backdrop-blur-md -rotate-12" />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">Master Every Interview</h2>
          <p className="text-lg text-muted-foreground">
            &quot;Rayleigh helped me gain the confidence I needed to land my dream job at a top tech company.&quot;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold border border-primary/30">
              JD
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Jane Doe</div>
              <div className="text-xs text-muted-foreground">Frontend Engineer at TechCorp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
