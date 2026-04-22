"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Eye, Volume2, User, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface CoachingCardProps {
  tip: string | null;
  type?: "posture" | "eye" | "speech" | "positive" | "warning";
  autoDismissMs?: number;
}

const TYPE_STYLES = {
  posture: {
    bg: "bg-amber-500/20 border-amber-500/40",
    icon: <User className="h-4 w-4 text-amber-400" />,
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  eye: {
    bg: "bg-blue-500/20 border-blue-500/40",
    icon: <Eye className="h-4 w-4 text-blue-400" />,
    text: "text-blue-300",
    dot: "bg-blue-400",
  },
  speech: {
    bg: "bg-purple-500/20 border-purple-500/40",
    icon: <Volume2 className="h-4 w-4 text-purple-400" />,
    text: "text-purple-300",
    dot: "bg-purple-400",
  },
  positive: {
    bg: "bg-emerald-500/20 border-emerald-500/40",
    icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  warning: {
    bg: "bg-red-500/20 border-red-500/40",
    icon: <AlertTriangle className="h-4 w-4 text-red-400" />,
    text: "text-red-300",
    dot: "bg-red-400",
  },
};

export function CoachingCard({ tip, type = "eye", autoDismissMs = 5000 }: CoachingCardProps) {
  const [visible, setVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<string | null>(null);

  useEffect(() => {
    if (tip && tip !== currentTip) {
      setCurrentTip(tip);
      setVisible(true);

      const timer = setTimeout(() => setVisible(false), autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [tip]);

  const styles = TYPE_STYLES[type];

  return (
    <AnimatePresence>
      {visible && currentTip && (
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl ${styles.bg}`}
          onClick={() => setVisible(false)}
        >
          <div className={`w-2 h-2 rounded-full ${styles.dot} animate-pulse shrink-0`} />
          {styles.icon}
          <span className={`text-sm font-semibold ${styles.text}`}>{currentTip}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Multi-tip overlay — shows up to 3 active coaching tips stacked
interface CoachingOverlayProps {
  tips: Array<{ tip: string; type: CoachingCardProps["type"]; id: string }>;
  onDismiss: (id: string) => void;
}

export function CoachingOverlay({ tips, onDismiss }: CoachingOverlayProps) {
  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <AnimatePresence>
        {tips.slice(0, 3).map((item) => {
          const styles = TYPE_STYLES[item.type || "eye"];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.25 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-xl cursor-pointer ${styles.bg}`}
              onClick={() => onDismiss(item.id)}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse shrink-0`} />
              {styles.icon}
              <span className={`text-xs font-bold ${styles.text} leading-tight`}>{item.tip}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
