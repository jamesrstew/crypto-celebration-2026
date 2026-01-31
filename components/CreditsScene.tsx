"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { MuteToggle } from "@/components/MuteToggle";
import { CREDITS } from "@/data/credits";
import { useAudio } from "@/components/AudioProvider";

const INTRO_TEXT = `Building something new is never clean or linear. It takes judgment, persistence, and a lot of trust between people.

This launch is the result of countless thoughtful decisions, steady collaboration, and a shared commitment to doing things the right way. Thank you to everyone who contributed their time, expertise, and energy — this wouldn't exist without you.`;

const BASE_DURATION_MS = 100_000;
const MIN_DURATION_MS = 12_000;
const HOLD_BEFORE_SCROLL_MS = 2000;

export default function CreditsScene({ onEndGame }: { onEndGame: () => void }) {
  const { playBgm } = useAudio();
  const [phase, setPhase] = useState<"intro" | "credits">("intro");
  const [scrollState, setScrollState] = useState<"scrolling" | "paused">("scrolling");
  const [scrollStarted, setScrollStarted] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const startScrollYRef = useRef(0);
  const totalTravelRef = useRef(0);
  const durationMsRef = useRef(BASE_DURATION_MS);

  const durationMs = Math.max(MIN_DURATION_MS, BASE_DURATION_MS / speedMultiplier);
  durationMsRef.current = durationMs;

  const startScrolling = useCallback(() => {
    setPhase("credits");
    setScrollState("scrolling");
    setScrollStarted(false);
    setScrollY(0);
    startScrollYRef.current = 0;
    startTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    playBgm("credits");
  }, [playBgm]);

  useEffect(() => {
    if (phase !== "credits" || scrollStarted) return;
    const t = setTimeout(() => {
      setScrollStarted(true);
      startTimeRef.current = performance.now();
    }, HOLD_BEFORE_SCROLL_MS);
    return () => clearTimeout(t);
  }, [phase, scrollStarted]);

  useEffect(() => {
    if (phase !== "credits") return;

    const measure = () => {
      const content = contentRef.current;
      const container = containerRef.current;
      if (!content || !container) return 0;
      const viewH = container.clientHeight;
      const contentH = content.offsetHeight;
      return contentH + viewH;
    };

    const run = () => {
      totalTravelRef.current = measure();
      if (totalTravelRef.current <= 0) {
        rafRef.current = requestAnimationFrame(run);
        return;
      }
    };
    rafRef.current = requestAnimationFrame(run);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "credits" || scrollState !== "scrolling" || !scrollStarted) return;

    const total = measureTravel();
    totalTravelRef.current = total;
    if (total <= 0) return;

    const startY = startScrollYRef.current;
    const remainingTravel = total - startY;
    const remainingDurationSec =
      remainingTravel > 0 ? (remainingTravel / total) * (durationMsRef.current / 1000) : 0;

    const startTime = startTimeRef.current;

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = remainingDurationSec > 0 ? Math.min(1, elapsed / remainingDurationSec) : 1;
      const y = -(startY + progress * remainingTravel);
      setScrollY(y);
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, scrollState, scrollStarted, durationMs]);

  function measureTravel() {
    const content = contentRef.current;
    const container = containerRef.current;
    if (!content || !container) return 0;
    return content.offsetHeight + container.clientHeight;
  }

  const handleSpeedUp = () => {
    startScrollYRef.current = Math.abs(scrollY);
    startTimeRef.current = performance.now();
    setSpeedMultiplier((m) => Math.min(4, m + 1));
  };

  const handleStop = () => {
    if (scrollState === "scrolling") {
      startScrollYRef.current = Math.abs(scrollY);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      startTimeRef.current = performance.now();
    }
    setScrollState((s) => (s === "paused" ? "scrolling" : "paused"));
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col relative bg-[var(--arcade-bg)] text-[var(--arcade-ink)]">
      <div className="absolute top-4 right-4 z-20">
        <MuteToggle />
      </div>

      {phase === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-2xl mx-auto text-center">
          <p className="text-sm sm:text-base text-[var(--arcade-ink-dim)] leading-relaxed whitespace-pre-line">
            {INTRO_TEXT}
          </p>
          <button
            type="button"
            onClick={startScrolling}
            className="btn-arcade btn-arcade-primary text-sm px-8 py-3 mt-8"
          >
            Continue
          </button>
        </div>
      )}

      {phase === "credits" && (
        <>
          <div
            ref={containerRef}
            className="flex-1 min-h-0 relative overflow-hidden"
            style={{
              maskImage: "linear-gradient(to top, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 6%, black 94%, transparent 100%)",
            }}
          >
            <div
              ref={contentRef}
              className="absolute left-0 right-0 top-0 pt-[50vh] pb-[20vh]"
              style={{ transform: `translateY(${scrollY}px)` }}
            >
              <div className="grid grid-cols-2 gap-x-12 gap-y-1 sm:gap-x-20 max-w-3xl mx-auto px-4 w-full">
                <div className="text-right text-sm sm:text-base font-medium text-[var(--neon-cyan)]">Human</div>
                <div className="text-left text-sm sm:text-base font-medium text-[var(--neon-yellow)]">Role</div>
                {CREDITS.map((row, i) => (
                  <Fragment key={i}>
                    <div className="text-right text-sm sm:text-base text-[var(--arcade-ink)]">
                      {row.human}
                    </div>
                    <div className="text-left text-sm sm:text-base text-[var(--arcade-ink-dim)]">
                      {row.role}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center justify-center gap-3 p-4 border-t-2 border-[var(--arcade-surface)] bg-[var(--arcade-bg)]/95">
            <button
              type="button"
              onClick={handleSpeedUp}
              className="btn-arcade text-sm px-4 py-2 border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20"
            >
              Speed up
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="btn-arcade text-sm px-4 py-2 border-2 border-[var(--neon-yellow)] text-[var(--neon-yellow)] hover:bg-[var(--neon-yellow)]/20"
            >
              {scrollState === "paused" ? "Resume" : "Stop"}
            </button>
            <button type="button" onClick={onEndGame} className="btn-arcade btn-arcade-primary text-sm px-6 py-2">
              End Game
            </button>
          </div>
        </>
      )}
    </main>
  );
}
