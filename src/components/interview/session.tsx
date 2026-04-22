"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mic, MicOff, Video, VideoOff, Volume2, VolumeX,
  PhoneOff, SkipForward, RotateCcw, Pause, Play,
  MessageSquare, Eye, Loader2, Clock, ChevronRight,
  Waves, AlertCircle
} from "lucide-react";
import { InterviewConfig } from "./setup";
import { useSpeechEngine } from "./speech-engine";
import { useVisionCoach, VisionMetrics } from "./vision-coach";
import { CoachingOverlay } from "./coaching-card";

interface Question {
  id: number;
  question: string;
  category: string;
  depth: string;
}

interface SessionProps {
  config: InterviewConfig;
  greeting: string;
  questions: Question[];
  onEnd: (sessionData: any) => void;
}

interface CoachingTip {
  id: string;
  tip: string;
  type: "posture" | "eye" | "speech" | "positive" | "warning";
}

export function InterviewSession({ config, greeting, questions, onEnd }: SessionProps) {
  const [phase, setPhase] = useState<"greeting" | "ready" | "interview" | "ending">("greeting");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]?.question || "");
  const [aiMessage, setAiMessage] = useState(greeting);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [accumulatedTranscript, setAccumulatedTranscript] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [time, setTime] = useState(0);
  const [answerStartTime, setAnswerStartTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [micOn, setMicOn] = useState(config.voiceMode);
  const [cameraOn, setCameraOn] = useState(config.cameraMode);
  const [ttsOn, setTtsOn] = useState(config.voiceMode);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coachingTips, setCoachingTips] = useState<CoachingTip[]>([]);
  const [visionMetrics, setVisionMetrics] = useState<VisionMetrics>({
    eyeContactScore: 80,
    isFaceCentered: true,
    headTiltAngle: 0,
    isTooClose: false,
    isTooFar: false,
    isMultipleFaces: false,
    isLowLight: false,
    coachingTip: null,
  });
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerLog, setFillerLog] = useState<string[]>([]);
  const [wpm, setWpm] = useState(0);
  const [eyeContactHistory, setEyeContactHistory] = useState<number[]>([]);
  const [silenceCount, setSilenceCount] = useState(0);
  const [headTiltCount, setHeadTiltCount] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<any[]>([]);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [liveTipHistory, setLiveTipHistory] = useState<CoachingTip[]>([]);
  const [followUpCount, setFollowUpCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const tipTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const lastVisionTipRef = useRef<string>("");
  const lastVisionTipTimeRef = useRef<number>(0);

  // Vision coaching
  const { isLoaded: visionLoaded } = useVisionCoach({
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    isActive: cameraOn && phase === "interview",
    onMetricsUpdate: useCallback((metrics: VisionMetrics) => {
      setVisionMetrics(metrics);
      setEyeContactHistory(h => [...h.slice(-60), metrics.eyeContactScore]);
      if (metrics.headTiltAngle > 10) setHeadTiltCount(c => c + 1);

      // Only fire tip if it's different from last and enough time has passed
      if (metrics.coachingTip &&
        metrics.coachingTip !== lastVisionTipRef.current &&
        Date.now() - lastVisionTipTimeRef.current > 8000) {
        lastVisionTipRef.current = metrics.coachingTip;
        lastVisionTipTimeRef.current = Date.now();
        addCoachingTip(metrics.coachingTip, "eye");
      }
    }, []),
  });

  const addCoachingTip = useCallback((tip: string, type: CoachingTip["type"]) => {
    const id = `${Date.now()}-${Math.random()}`;
    setCoachingTips(prev => [...prev.slice(-2), { id, tip, type }]);
    const timer = setTimeout(() => {
      setCoachingTips(prev => prev.filter(t => t.id !== id));
    }, 5000);
    tipTimeoutRef.current[id] = timer;
  }, []);

  // Speech engine (no isListening prop — new API uses refs internally)
  const { startListening, stopListening, speak, cancelSpeech } = useSpeechEngine({
    onTranscript: useCallback((text: string, isFinal: boolean) => {
      if (isFinal) {
        setAccumulatedTranscript(prev => (prev ? prev + " " : "") + text);
        setInterimTranscript("");
      } else {
        setInterimTranscript(text);
      }
    }, []),
    onFillerDetected: useCallback((filler: string) => {
      setFillerCount(c => c + 1);
      setFillerLog(prev => [...prev, filler]);
      addCoachingTip(`Filler detected: "${filler}" — try pausing instead`, "speech");
    }, [addCoachingTip]),
    onSilence: useCallback(() => {
      setSilenceCount(c => c + 1);
    }, []),
    onSpeakingSpeedUpdate: useCallback((speed: number) => {
      setWpm(speed);
      if (speed > 180) addCoachingTip("Slow down a bit — you're speaking too fast", "speech");
      if (speed > 0 && speed < 80) addCoachingTip("Try to speak a bit faster", "speech");
    }, [addCoachingTip]),
    ttsEnabled: ttsOn,
    micEnabled: micOn,
    personality: config.personality,
  });

  // Camera setup
  useEffect(() => {
    if (!cameraOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;
    navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false })
      .then(stream => {
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => console.warn("Camera not available:", err));

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraOn]);

  // Timer
  useEffect(() => {
    if (isPaused || phase !== "interview") return;
    const interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused, phase]);

  // Start: speak greeting then wait for user to click "I'm Ready"
  const hasGreetedRef = useRef(false);
  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;
    setIsAiSpeaking(true);
    speak(greeting, () => {
      setIsAiSpeaking(false);
      setPhase("ready");
    });
  }, [greeting, speak]);



  const askQuestion = useCallback((index: number) => {
    const q = questions[index];
    if (!q) return;
    setCurrentQuestion(q.question);
    setCurrentQuestionIndex(index);
    setAiMessage(q.question);
    setInterimTranscript("");
    setAccumulatedTranscript("");
    setAnswerStartTime(Date.now());
    setIsAiSpeaking(true);
    setIsListening(false);
    setFollowUpCount(0);

    speak(q.question, () => {
      setIsAiSpeaking(false);
      // Give user a moment after AI finishes speaking before listening
      setTimeout(() => {
        setIsListening(true);
        startListening();
        addCoachingTip("Your turn — speak your answer now", "positive");
      }, 600);
    });
  }, [questions, speak, startListening, addCoachingTip]);

  const handleUserReady = useCallback(() => {
    setPhase("interview");
    askQuestion(0);
  }, [askQuestion]);

  const handleSubmitAnswer = async () => {
    const answer = (accumulatedTranscript + " " + interimTranscript).trim();
    if (!answer) return;
    const duration = Math.round((Date.now() - answerStartTime) / 1000);

    stopListening();
    setIsListening(false);
    setIsSubmittingAnswer(true);
    setIsProcessing(true);

    // Record this Q&A
    const qa = {
      question: currentQuestion,
      category: questions[currentQuestionIndex]?.category || "General",
      answer,
      duration,
    };
    const newAnswers = [...answers, answer];
    const newQAs = [...questionAnswers, qa];
    setAnswers(newAnswers);
    setQuestionAnswers(newQAs);
    setInterimTranscript("");
    setAccumulatedTranscript("");

    try {
      // Get AI follow-up or next question
      const res = await fetch("/api/ai/interview/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: config.role,
          domain: config.domain,
          level: config.level,
          interviewType: config.interviewType,
          personality: config.personality,
          currentQuestion,
          questionIndex: currentQuestionIndex,
          userAnswer: answer,
          allAnswers: newAnswers.slice(-3),
          fillerCount,
          answerDuration: duration,
          followUpCount,
        }),
      });

      const data = await res.json();
      setIsProcessing(false);

      if (data.isFollowUp) {
        // AI wants to follow up on this answer
        setFollowUpCount(c => c + 1);
        setAiMessage(data.response);
        setIsAiSpeaking(true);
        speak(data.response, () => {
          setIsAiSpeaking(false);
          setTimeout(() => {
            setIsListening(true);
            startListening();
          }, 600);
        });
      } else {
        // Move to next question
        setAiMessage(data.response);
        setIsAiSpeaking(true);
        speak(data.response, () => {
          setIsAiSpeaking(false);
          const nextIndex = data.nextQuestionIndex;
          if (nextIndex < questions.length) {
            setTimeout(() => askQuestion(nextIndex), 1500);
          } else {
            handleEndInterview(newQAs);
          }
        });
      }
    } catch (err) {
      setIsProcessing(false);
      // Fallback: just move to next question
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        askQuestion(nextIndex);
      } else {
        handleEndInterview(newQAs);
      }
    }
    setIsSubmittingAnswer(false);
  };

  const handleSkipQuestion = () => {
    cancelSpeech();
    stopListening();
    setIsListening(false);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      askQuestion(nextIndex);
    } else {
      handleEndInterview(questionAnswers);
    }
  };

  const handleRepeatQuestion = () => {
    cancelSpeech();
    setIsAiSpeaking(true);
    speak(currentQuestion, () => setIsAiSpeaking(false));
  };

  const handleEndInterview = (qas: any[]) => {
    cancelSpeech();
    stopListening();
    
    // Play ending message
    const endingMsg = "Thank you for your time. We have collected all your responses and we will be in touch soon. Have a great day!";
    setIsAiSpeaking(true);
    setAiMessage(endingMsg);
    
    speak(endingMsg, () => {
      setIsAiSpeaking(false);
      setPhase("ending");
      streamRef.current?.getTracks().forEach(t => t.stop());

      const avgEyeContact = eyeContactHistory.length
        ? Math.round(eyeContactHistory.reduce((a, b) => a + b, 0) / eyeContactHistory.length)
        : 75;

      onEnd({
        questionsAndAnswers: qas,
        metrics: {
          totalFillerWords: fillerCount,
          fillerLog,
          eyeContactScore: avgEyeContact,
          avgAnswerDuration: qas.length
            ? Math.round(qas.reduce((a, b) => a + (b.duration || 0), 0) / qas.length)
            : 0,
          sessionDuration: time,
          silenceCount,
          headTiltCount,
          wpm,
        },
      });
    });
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const avgEyeContact = eyeContactHistory.length
    ? Math.round(eyeContactHistory.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, eyeContactHistory.length))
    : 80;

  if (phase === "ending") {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-black">Generating your report...</h2>
          <p className="text-muted-foreground">AI is analyzing your full session performance</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-4 relative pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full" />
            LIVE
          </div>
          <span className="font-bold text-sm text-muted-foreground">{config.role} · {config.interviewType.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-black text-white font-mono font-bold text-lg px-4 py-1.5 rounded-xl border border-primary/30">
            {formatTime(time)}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            Q{currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">

        {/* LEFT: AI Interviewer Panel */}
        <div className="flex flex-col gap-4">
          {/* AI Avatar */}
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex-1 flex flex-col justify-between p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

            {/* AI Visual */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl ${isAiSpeaking ? "ring-4 ring-primary/50 ring-offset-4 ring-offset-slate-900" : ""}`}>
                  <span className="text-3xl font-black text-white">AI</span>
                </div>
                {isAiSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Waves className="h-3 w-3 text-white animate-pulse" />
                  </div>
                )}
              </div>
              <div className="text-white font-bold text-sm">
                {config.personality === "friendly" ? "Alex" :
                 config.personality === "tough" ? "David" :
                 config.personality === "faang" ? "Senior Eng." :
                 config.personality === "hr" ? "Jordan" : "Ms. Chen"}
              </div>
              <div className="text-white/50 text-xs">AI Interviewer</div>
            </div>

            {/* Current Message */}
            <div className="relative z-10 mt-4">
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                {isAiSpeaking ? "Speaking..." : isProcessing ? "Thinking..." : "Current Question"}
              </div>
              <p className="text-white font-semibold text-sm leading-relaxed">
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-white/60">Analyzing your response...</span>
                  </span>
                ) : aiMessage}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-4 relative z-10">
              {questions.map((_, i) => (
                <div key={i} className={`rounded-full transition-all ${
                  i < currentQuestionIndex ? "w-2 h-2 bg-primary/60" :
                  i === currentQuestionIndex ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-white/20"
                }`} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER: User Camera */}
        <div className="relative bg-zinc-950 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl">
          {/* Video */}
          {cameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <VideoOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-bold text-sm">Camera Off</p>
              </div>
            </div>
          )}

          {/* Ready Overlay */}
          {phase === "ready" && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-2xl font-black text-white mb-2">Ready to Begin?</h3>
              <p className="text-white/70 text-sm mb-6 max-w-sm">
                Your AI interviewer is ready. Make sure your camera and microphone are properly positioned.
              </p>
              <Button size="lg" className="rounded-xl font-bold px-8 shadow-xl" onClick={handleUserReady}>
                I&apos;m Ready — Start Interview
              </Button>
            </div>
          )}

          {/* Coaching Overlay (top right) */}
          <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 max-w-[240px]">
            <CoachingOverlay
              tips={coachingTips}
              onDismiss={(id) => setCoachingTips(prev => prev.filter(t => t.id !== id))}
            />
          </div>

          {/* Eye Contact Bar (bottom) */}
          {cameraOn && phase === "interview" && (
            <div className="absolute bottom-4 left-4 right-4 z-30">
              <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 border border-white/10">
                <Eye className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase text-white/60 mb-1">
                    <span>Eye Contact</span>
                    <span>{avgEyeContact}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${avgEyeContact > 70 ? "bg-emerald-500" : avgEyeContact > 50 ? "bg-amber-500" : "bg-red-500"}`}
                      animate={{ width: `${avgEyeContact}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Mic indicator */}
                {isListening && (
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
                    <div className="w-1.5 h-5 bg-primary rounded-full animate-pulse [animation-delay:0.2s]" />
                    <div className="w-1.5 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Transcript + Analytics */}
        <div className="flex flex-col gap-4">
          {/* Live Transcript */}
          <Card className="flex-1 glass-card border-border/50 flex flex-col min-h-0">
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Live Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 pt-0">
              <div className="text-sm leading-relaxed text-foreground min-h-[60px]">
                {accumulatedTranscript || interimTranscript ? (
                  <>
                    <span>{accumulatedTranscript}</span>
                    {interimTranscript && <span className="text-muted-foreground ml-1">{interimTranscript}</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground italic">
                    {isAiSpeaking ? "AI is speaking..." : isListening ? "Listening to your answer..." : "Waiting..."}
                  </span>
                )}
                {isListening && (
                  <span className="inline-block w-1 h-4 bg-primary ml-1 animate-pulse rounded-sm align-middle" />
                )}
              </div>
            </CardContent>

            {/* Answer Submit */}
            {isListening && !isAiSpeaking && (
              <div className="p-4 border-t border-border">
                <Button
                  className="w-full font-black"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmittingAnswer || !(accumulatedTranscript || interimTranscript)}
                >
                  {isSubmittingAnswer ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-2" />
                  )}
                  Submit Answer
                </Button>
              </div>
            )}
          </Card>

          {/* Analytics */}
          <Card className="glass-card border-border/50 shrink-0">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="text-2xl font-black text-destructive">{fillerCount}</div>
                  <div className="text-[10px] font-black uppercase text-muted-foreground">Fillers</div>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <div className="text-2xl font-black text-primary">{wpm}</div>
                  <div className="text-[10px] font-black uppercase text-muted-foreground">WPM</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/90 backdrop-blur-xl rounded-full p-2 flex items-center justify-center gap-2 border border-white/10 shadow-2xl">
        <Button variant="ghost" size="icon" className={`h-11 w-11 rounded-xl ${micOn ? "text-white" : "text-destructive"}`}
          onClick={() => setMicOn(m => !m)}>
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className={`h-11 w-11 rounded-xl ${cameraOn ? "text-white" : "text-destructive"}`}
          onClick={() => setCameraOn(c => !c)}>
          {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className={`h-11 w-11 rounded-xl ${ttsOn ? "text-white" : "text-muted-foreground"}`}
          onClick={() => setTtsOn(t => !t)}>
          {ttsOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>

        <div className="w-px h-8 bg-white/10" />

        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/70 hover:text-white"
          onClick={handleRepeatQuestion} title="Repeat question">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/70 hover:text-white"
          onClick={handleSkipQuestion} title="Skip question">
          <SkipForward className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-white/70 hover:text-white"
          onClick={() => setIsPaused(p => !p)}>
          {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
        </Button>

        <div className="w-px h-8 bg-white/10" />

        <Button variant="destructive" className="h-11 px-6 rounded-xl font-bold text-sm"
          onClick={() => handleEndInterview(questionAnswers)}>
          <PhoneOff className="h-4 w-4 mr-2" />
          End Interview
        </Button>
      </div>
    </div>
  );
}
