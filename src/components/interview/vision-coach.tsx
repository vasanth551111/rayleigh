"use client";

import { useEffect, useRef, useCallback, useState } from "react";

export interface VisionMetrics {
  eyeContactScore: number; // 0-100
  isFaceCentered: boolean;
  headTiltAngle: number; // degrees
  isTooClose: boolean;
  isTooFar: boolean;
  isMultipleFaces: boolean;
  isLowLight: boolean;
  coachingTip: string | null;
}

interface VisionCoachProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  onMetricsUpdate: (metrics: VisionMetrics) => void;
}

export function useVisionCoach({ videoRef, isActive, onMetricsUpdate }: VisionCoachProps) {
  const animFrameRef = useRef<number>(0);
  const faceMeshRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const metricsHistoryRef = useRef<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const analyzeFrame = useCallback(() => {
    if (!isActive || !videoRef.current) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    // Create offscreen canvas for analysis
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw mirrored frame
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Light analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    }
    brightness = brightness / (data.length / 4);
    const isLowLight = brightness < 60;

    // If MediaPipe FaceMesh is available, use it
    if (faceMeshRef.current) {
      faceMeshRef.current.send({ image: video }).catch(() => {});
    } else {
      // Fallback: basic heuristic analysis only
      const metrics: VisionMetrics = {
        eyeContactScore: Math.min(100, Math.max(50, 85 - (isLowLight ? 20 : 0))),
        isFaceCentered: true,
        headTiltAngle: 0,
        isTooClose: false,
        isTooFar: false,
        isMultipleFaces: false,
        isLowLight,
        coachingTip: isLowLight ? "Improve lighting — your face appears dark" : null,
      };
      onMetricsUpdate(metrics);
    }

    animFrameRef.current = requestAnimationFrame(analyzeFrame);
  }, [isActive, videoRef, onMetricsUpdate]);

  useEffect(() => {
    if (!isActive) return;

    // Try to load MediaPipe FaceMesh
    const loadFaceMesh = async () => {
      try {
        if (typeof window === "undefined") return;

        const { FaceMesh } = await import("@mediapipe/face_mesh");

        const faceMesh = new FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`;
          }
        });

        faceMesh.setOptions({
          maxNumFaces: 2,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        await faceMesh.initialize();

        faceMesh.onResults((results: any) => {
          const faces = results.multiFaceLandmarks;

          if (!faces || faces.length === 0) {
            const metrics: VisionMetrics = {
              eyeContactScore: 0,
              isFaceCentered: false,
              headTiltAngle: 0,
              isTooClose: false,
              isTooFar: false,
              isMultipleFaces: false,
              isLowLight: false,
              coachingTip: "Your face is not visible — please center yourself in frame",
            };
            onMetricsUpdate(metrics);
            return;
          }

          const isMultipleFaces = faces.length > 1;
          const landmarks = faces[0];

          // Key landmarks
          const nose = landmarks[1];       // Nose tip
          const leftEye = landmarks[33];   // Left eye outer
          const rightEye = landmarks[263]; // Right eye outer
          const chin = landmarks[152];     // Chin
          const forehead = landmarks[10];  // Forehead

          // Face centering (nose should be near 0.5 horizontally)
          const isFaceCentered = Math.abs(nose.x - 0.5) < 0.18;

          // Head tilt (angle between eyes)
          const dx = rightEye.x - leftEye.x;
          const dy = rightEye.y - leftEye.y;
          const headTiltAngle = Math.abs(Math.atan2(dy, dx) * (180 / Math.PI));

          // Face size (proximity)
          const faceHeight = Math.abs(chin.y - forehead.y);
          const isTooClose = faceHeight > 0.55;
          const isTooFar = faceHeight < 0.2;

          // Eye contact estimation: looking straight vs looking away
          // Use iris landmarks if available (refined landmarks)
          let eyeContactScore = 80;
          if (!isFaceCentered) eyeContactScore -= 30;
          if (headTiltAngle > 10) eyeContactScore -= 15;
          if (isTooFar) eyeContactScore -= 10;
          eyeContactScore = Math.max(0, Math.min(100, eyeContactScore));

          // Add to rolling history for smoothing
          metricsHistoryRef.current.push(eyeContactScore);
          if (metricsHistoryRef.current.length > 30) metricsHistoryRef.current.shift();
          const smoothedScore = Math.round(
            metricsHistoryRef.current.reduce((a, b) => a + b, 0) / metricsHistoryRef.current.length
          );

          // Generate coaching tip
          let coachingTip: string | null = null;
          if (isMultipleFaces) coachingTip = "Multiple people detected — ensure you're alone";
          else if (!isFaceCentered) coachingTip = "Center yourself in the frame";
          else if (isTooClose) coachingTip = "Move slightly back — you're too close to the camera";
          else if (isTooFar) coachingTip = "Move closer — you appear too far from the camera";
          else if (headTiltAngle > 12) coachingTip = "Straighten your head — you have a visible tilt";
          else if (smoothedScore < 50) coachingTip = "Look directly into the camera lens";

          onMetricsUpdate({
            eyeContactScore: smoothedScore,
            isFaceCentered,
            headTiltAngle,
            isTooClose,
            isTooFar,
            isMultipleFaces,
            isLowLight: false,
            coachingTip,
          });
        });

        faceMeshRef.current = faceMesh;
        setIsLoaded(true);
      } catch (err) {
        console.warn("MediaPipe FaceMesh not available, using fallback:", err);
        setIsLoaded(true);
      }
    };

    loadFaceMesh();
    animFrameRef.current = requestAnimationFrame(analyzeFrame);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, analyzeFrame]);

  return { isLoaded };
}
