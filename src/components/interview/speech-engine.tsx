"use client";

import { useEffect, useRef, useCallback } from "react";

interface SpeechEngineProps {
  onTranscript: (text: string, isFinal: boolean) => void;
  onFillerDetected: (filler: string) => void;
  onSilence: () => void;
  onSpeakingSpeedUpdate: (wpm: number) => void;
  ttsEnabled: boolean;
  micEnabled: boolean;
  personality?: string;
}

const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "literally",
  "actually", "so", "right", "okay so", "and uh", "i mean",
];

export function useSpeechEngine({
  onTranscript,
  onFillerDetected,
  onSilence,
  onSpeakingSpeedUpdate,
  ttsEnabled,
  micEnabled,
  personality = "friendly",
}: SpeechEngineProps) {
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const isSpeakingTTSRef = useRef(false); // true while TTS is playing
  const shouldListenRef = useRef(false);   // desired listening state
  const isRecognitionRunningRef = useRef(false);
  const micEnabledRef = useRef(micEnabled);

  useEffect(() => {
    micEnabledRef.current = micEnabled;
  }, [micEnabled]);

  // Keep callbacks in refs to avoid stale closures
  const onTranscriptRef = useRef(onTranscript);
  const onFillerRef = useRef(onFillerDetected);
  const onSilenceRef = useRef(onSilence);
  const onSpeedRef = useRef(onSpeakingSpeedUpdate);
  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
  useEffect(() => { onFillerRef.current = onFillerDetected; }, [onFillerDetected]);
  useEffect(() => { onSilenceRef.current = onSilence; }, [onSilence]);
  useEffect(() => { onSpeedRef.current = onSpeakingSpeedUpdate; }, [onSpeakingSpeedUpdate]);

  const startRecognitionInternal = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isRecognitionRunningRef.current) return;
    if (isSpeakingTTSRef.current) return;
    if (!micEnabledRef.current) return;
    try {
      recognitionRef.current.start();
      isRecognitionRunningRef.current = true;
    } catch (_) {}
  }, []);

  const stopRecognitionInternal = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (_) {}
    isRecognitionRunningRef.current = false;
  }, []);

  // Initialize recognition once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }

      const current = final || interim;
      if (!current.trim()) return;
      onTranscriptRef.current(current, !!final);

      // Filler word detection (only on final results to avoid double-counting)
      if (final) {
        const words = final.toLowerCase().split(/\s+/);
        const detected = new Set<string>();
        for (const filler of FILLER_WORDS) {
          const fw = filler.split(" ");
          for (let i = 0; i <= words.length - fw.length; i++) {
            if (words.slice(i, i + fw.length).join(" ") === filler && !detected.has(filler)) {
              detected.add(filler);
              onFillerRef.current(filler);
            }
          }
        }

        // Speaking speed
        wordCountRef.current += final.split(/\s+/).filter(Boolean).length;
        const elapsed = (Date.now() - startTimeRef.current) / 60000;
        if (elapsed > 0.01) {
          onSpeedRef.current(Math.round(wordCountRef.current / elapsed));
        }
      }

      // Reset silence timer on any speech
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        if (shouldListenRef.current) onSilenceRef.current();
      }, 7000);
    };

    rec.onerror = (e: any) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      console.warn("STT error:", e.error);
      isRecognitionRunningRef.current = false;
    };

    rec.onend = () => {
      isRecognitionRunningRef.current = false;
      // Auto-restart only if we're still supposed to be listening and TTS isn't playing
      if (shouldListenRef.current && !isSpeakingTTSRef.current && micEnabledRef.current) {
        setTimeout(() => {
          if (shouldListenRef.current && !isSpeakingTTSRef.current && micEnabledRef.current) {
            startRecognitionInternal();
          }
        }, 300);
      }
    };

    recognitionRef.current = rec;

    return () => {
      try { rec.stop(); } catch (_) {}
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!micEnabled) {
      stopRecognitionInternal();
    } else if (shouldListenRef.current) {
      startRecognitionInternal();
    }
  }, [micEnabled, stopRecognitionInternal, startRecognitionInternal]);

  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    startTimeRef.current = Date.now();
    wordCountRef.current = 0;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    startRecognitionInternal();
  }, [startRecognitionInternal]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    stopRecognitionInternal();
  }, [stopRecognitionInternal]);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (typeof window === "undefined") {
        onEnd?.();
        return;
      }

      // Stop STT while TTS plays
      isSpeakingTTSRef.current = true;
      stopRecognitionInternal();
      window.speechSynthesis.cancel();

      if (!ttsEnabled) {
        // No TTS — just call onEnd after a short delay so UI updates
        setTimeout(() => {
          isSpeakingTTSRef.current = false;
          onEnd?.();
        }, 300);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const pickVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        
        const maleVoices = ["David", "Matthew", "Daniel", "Mark", "Oliver", "Google UK English Male", "Microsoft Mark", "Microsoft David"];
        const femaleVoices = ["Samantha", "Google US English", "Alex", "Karen", "Moira", "Victoria", "Microsoft Zira"];
        
        const isMale = personality === "tough" || personality === "faang";
        const preferredNames = isMale ? maleVoices : femaleVoices;

        return (
          voices.find((v) =>
            preferredNames.some((n) =>
              v.name.includes(n)
            )
          ) || voices.find((v) => v.lang.startsWith("en")) || null
        );
      };

      const voice = pickVoice();
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        isSpeakingTTSRef.current = false;
        onEnd?.();
        // Resume STT if needed
        if (shouldListenRef.current && micEnabledRef.current) {
          setTimeout(() => startRecognitionInternal(), 400);
        }
      };

      utterance.onerror = () => {
        isSpeakingTTSRef.current = false;
        onEnd?.();
        if (shouldListenRef.current && micEnabledRef.current) {
          setTimeout(() => startRecognitionInternal(), 400);
        }
      };

      // If voices not loaded yet, wait for them
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          const v = pickVoice();
          if (v) utterance.voice = v;
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    },
    [ttsEnabled, stopRecognitionInternal, startRecognitionInternal]
  );

  const cancelSpeech = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    isSpeakingTTSRef.current = false;
  }, []);

  return { startListening, stopListening, speak, cancelSpeech };
}
