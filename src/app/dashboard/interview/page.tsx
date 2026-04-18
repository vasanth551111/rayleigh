"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  PlayCircle,
  PauseCircle,
  Settings,
  MessageSquare,
  AlertCircle,
  User
} from "lucide-react";
import Image from "next/image";

export default function MockInterviewPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [time, setTime] = useState(0);
  const [currentQuestion] = useState("Tell me about a time you faced a significant technical challenge and how you overcame it.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      if (isStarted && cameraOn) {
        try {
          // Check if stream already exists
          if (streamRef.current) {
            // Update audio track based on micOn
            streamRef.current.getAudioTracks().forEach(track => {
              track.enabled = micOn;
            });
            return;
          }

          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true,
            audio: true 
          });
          
          streamRef.current = stream;
          
          // Initial audio track state
          stream.getAudioTracks().forEach(track => {
            track.enabled = micOn;
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      } else {
        stopCamera();
      }
    }

    startCamera();

    return () => {
      if (!isStarted) stopCamera();
    };
  }, [isStarted, cameraOn, micOn]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Fake timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted && !isPaused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Mock Interview</h1>
          <p className="text-muted-foreground text-sm">Role: Senior Frontend Engineer • Type: Behavioral & Technical</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-muted px-4 py-1.5 rounded-full font-mono font-bold text-lg border border-border">
            {formatTime(time)}
          </div>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      {!isStarted ? (
        <Card className="flex-1 glass-card border-border flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <VideoIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Ready to start?</h2>
            <p className="text-muted-foreground">
              This session will take approximately 15 minutes. Ensure you are in a quiet place and your camera and microphone are working.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm mt-8 mb-8">
              <div className="flex items-center justify-center gap-2 bg-muted/50 p-3 rounded-lg">
                <Mic className="h-4 w-4 text-emerald-500" /> Mic working
              </div>
              <div className="flex items-center justify-center gap-2 bg-muted/50 p-3 rounded-lg">
                <VideoIcon className="h-4 w-4 text-emerald-500" /> Camera working
              </div>
            </div>
            <Button size="lg" className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white" onClick={() => setIsStarted(true)}>
              Start Interview Now
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area (AI Interviewer) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative flex-1 bg-black rounded-2xl overflow-hidden border border-border shadow-xl flex items-center justify-center">
              {/* AI Avatar Placeholder */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
                  alt="AI Interviewer" 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  className="object-cover opacity-80"
                />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-medium border border-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Rayleigh AI
                </div>
                
                {/* Real-time metrics overlay */}
                <div className="flex gap-2">
                  <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-border">
                    <span className="text-muted-foreground mr-1">Pace:</span> Good
                  </div>
                </div>
              </div>
            </div>

            {/* Current Question Banner */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 shadow-sm flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-primary uppercase tracking-wider mb-1">Current Question</h3>
                <p className="text-lg font-medium">{currentQuestion}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4">
            {/* User Webcam Preview */}
            <div className="aspect-video bg-zinc-900 rounded-xl border border-border relative overflow-hidden shadow-sm">
              {cameraOn ? (
                <div className="absolute inset-0">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover scale-x-[-1]" 
                  />
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded text-white z-10">You</span>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="text-center">
                    <VideoOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm text-muted-foreground">Camera Off</span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Analytics */}
            <Card className="flex-1 glass-card">
              <CardContent className="p-4 space-y-6">
                <h3 className="font-semibold border-b border-border pb-2">Live Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Confidence Level</span>
                      <span className="font-medium text-emerald-500">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[85%] transition-all duration-500"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Voice Clarity</span>
                      <span className="font-medium text-primary">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[92%] transition-all duration-500"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Eye Contact</span>
                      <span className="font-medium text-orange-500">64%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full w-[64%] transition-all duration-500"></div>
                    </div>
                    <p className="text-[10px] text-orange-500 mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Try looking at the camera more
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-center gap-4">
              <Button 
                variant={micOn ? "secondary" : "destructive"} 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant={cameraOn ? "secondary" : "destructive"} 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={() => setCameraOn(!cameraOn)}
              >
                {cameraOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <PlayCircle className="h-5 w-5 text-primary" /> : <PauseCircle className="h-5 w-5" />}
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-12 w-12 rounded-full hover:bg-destructive/90"
                onClick={() => {
                  setIsStarted(false);
                  setTime(0);
                }}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


