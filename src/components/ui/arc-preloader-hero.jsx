"use client";

import * as React from "react";
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const PreloadContext = React.createContext({ isPreloading: true, phase: "intro" });
export const usePreloadState = () => React.useContext(PreloadContext);

export function ArcRevealHero({
  greetings,
  greetingHold = 900,
  revealDuration = 900,
  className,
  introClassName,
  greetingClassName,
  revealClassName,
  storageKey,
  children,
}) {
  const pathname = usePathname();

  const [phase, setPhase] = React.useState("intro");
  const [index, setIndex] = React.useState(0);
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  const [mounted, setMounted] = React.useState(false);

  // Progress from 0 to 2
  // 0 -> 1: Black curve rises from bottom
  // 1: Text appears (held by greetingHold)
  // 1 -> 2: Black curve lifts up to reveal page
  const progress = useMotionValue(0);

  // Synchronously handle route change during render to prevent page flashing
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPhase("intro");
    setIndex(0);
    progress.set(0);
  }

  // Defer rendering the new page child until the screen is covered by preloader
  const isInitialSSR = React.useRef(true);
  const [renderedChildren, setRenderedChildren] = React.useState(children);

  React.useEffect(() => {
    isInitialSSR.current = false;
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (phase === "text" || phase === "reveal" || phase === "done" || isInitialSSR.current) {
      setRenderedChildren(children);
    }
  }, [phase, children]);

  // Generate title from pathname
  const title = React.useMemo(() => {
      if (pathname === '/') return 'HOME';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
          return parts[0].toUpperCase();
      }
      return 'LOADING';
  }, [pathname]);

  const activeGreetings = greetings || [{ text: title }];

  // Dynamic quadratic bezier curves that stretch as they rise and exit
  const arcPath = useTransform(progress, (p) => {
    if (p <= 1) {
      // Rise phase (0 to 1)
      const topEdge = 110 - p * 110;
      const control = topEdge - 30 * Math.sin(p * Math.PI);
      return `M 0 ${topEdge} Q 50 ${control} 100 ${topEdge} L 100 110 L 0 110 Z`;
    } else {
      // Reveal phase (1 to 2)
      const t = p - 1;
      const bottomEdge = 110 - t * 110;
      const control = bottomEdge - 30 * Math.sin(t * Math.PI);
      return `M 0 0 L 100 0 L 100 ${bottomEdge} Q 50 ${control} 0 ${bottomEdge} Z`;
    }
  });

  // Dynamic path for a glowing neon border line tracing the leading edge of the wave
  const borderPath = useTransform(progress, (p) => {
    if (p <= 1) {
      const topEdge = 110 - p * 110;
      const control = topEdge - 30 * Math.sin(p * Math.PI);
      return `M 0 ${topEdge} Q 50 ${control} 100 ${topEdge}`;
    } else {
      const t = p - 1;
      const bottomEdge = 110 - t * 110;
      const control = bottomEdge - 30 * Math.sin(t * Math.PI);
      return `M 0 ${bottomEdge} Q 50 ${control} 100 ${bottomEdge}`;
    }
  });

  // Scroll lock implementation
  React.useEffect(() => {
    const isPreloading = phase !== "done";
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('preload-state-change', { detail: isPreloading }));
    }

    if (isPreloading) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => {
        document.body.style.overflow = '';
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('preload-state-change', { detail: false }));
        }
    };
  }, [phase]);

  // Initial load check
  React.useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
        const isLoaded = sessionStorage.getItem('portfolioLoaded');
        if (!isLoaded) {
            setPhase("done");
            return;
        }
    }

    if (storageKey && typeof window !== "undefined") {
      try {
        if (window.sessionStorage.getItem(storageKey) === "done") {
          setPhase("done");
          return;
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Animation Sequence: Intro -> Text -> Reveal -> Done
  React.useEffect(() => {
    if (phase !== "intro") return;
    
    const controls = animate(progress, 1, {
      duration: revealDuration / 1000,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        setPhase("text");
      }
    });
    
    return () => controls.stop();
  }, [phase, progress, revealDuration]);

  React.useEffect(() => {
    if (phase !== "text") return;
    
    const t = window.setTimeout(() => {
      setPhase("reveal");
    }, greetingHold);
    
    return () => window.clearTimeout(t);
  }, [phase, greetingHold]);

  React.useEffect(() => {
    if (phase !== "reveal") return;
    
    const controls = animate(progress, 2, {
      duration: revealDuration / 1000,
      ease: [0.76, 0, 0.24, 1],
      onComplete: () => {
        setPhase("done");
        if (storageKey && typeof window !== "undefined") {
          try {
            window.sessionStorage.setItem(storageKey, "done");
          } catch {
            // ignore
          }
        }
      }
    });
    
    return () => controls.stop();
  }, [phase, progress, revealDuration, storageKey]);

  // Only show the preloader once mounted and if the phase is not done
  const showOverlay = mounted && phase !== "done";
  const current = activeGreetings[Math.min(index, activeGreetings.length - 1)];

  return (
    <div
      className={cn(
        "relative isolate min-h-screen w-full bg-background text-foreground",
        className,
      )}
    >
      <PreloadContext.Provider value={{ isPreloading: showOverlay, phase }}>
        <div className={cn("relative z-0", revealClassName)}>{renderedChildren}</div>
      </PreloadContext.Provider>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="arc-reveal-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed inset-0 z-[999] h-screen w-full overflow-hidden",
              introClassName,
            )}
          >
            {/* The Text Layer: Highly engaging stagged letter reveal */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <AnimatePresence mode="wait">
                {phase === "text" && current && (
                  <div className="flex gap-[0.1em] overflow-hidden select-none px-6 text-center text-5xl md:text-7xl font-black uppercase tracking-widest text-white">
                    {Array.from(current.text).map((char, charIdx) => (
                      <motion.span
                        key={`${charIdx}-${char}`}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 14,
                          delay: charIdx * 0.04
                        }}
                        style={{ display: "inline-block" }}
                        className={cn(
                          "font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-400/80 drop-shadow-md",
                          greetingClassName
                        )}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* The Background curves layer with Neon glow wave */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full z-0"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D1FF4D" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="glow-wave" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Solid background covering the page initially */}
              {(phase === "intro" || phase === "text") && (
                <rect width="100" height="100" className="fill-[#08080c] dark:fill-[#020204]" />
              )}
              
              {/* Animating Wave fill */}
              <motion.path d={arcPath} className="fill-[#08080c] dark:fill-[#020204]" />

              {/* Glowing Neon Line tracing the edge */}
              <motion.path 
                d={borderPath} 
                stroke="url(#neon-grad)" 
                strokeWidth="1.2" 
                fill="none" 
                filter="url(#glow-wave)"
                style={{ opacity: phase === "done" ? 0 : 1 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
