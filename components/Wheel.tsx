"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import type { Slice } from "@/data/content";
import { getSlices } from "@/data/content";

const SPIN_DURATION_MS = 10500;
const EXTRA_ROTATIONS = 8;
const WHEEL_COLORS = [
  "var(--neon-pink)",
  "var(--neon-blue)",
  "var(--neon-lime)",
  "var(--neon-yellow)",
  "var(--neon-orange)",
  "var(--neon-purple)",
  "var(--neon-cyan)",
  "var(--neon-red)",
];

export function Wheel({
  selectedSlice,
  variant = "default",
  onSpinComplete,
  onSpin,
  canSpin,
}: {
  selectedSlice: Slice | null;
  variant?: "default" | "hero";
  onSpinComplete?: () => void;
  onSpin?: () => void;
  canSpin?: boolean;
}) {
  const slices = useMemo(() => getSlices(), []);
  const n = slices.length;
  const degPer = 360 / n;
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const conicGradient = useMemo(() => {
    const steps = slices.map((_, i) => {
      const start = i * degPer;
      const end = (i + 1) * degPer;
      const c = WHEEL_COLORS[i % WHEEL_COLORS.length];
      return `${c} ${start}deg ${end}deg`;
    });
    return `conic-gradient(${steps.join(", ")})`;
  }, [slices, degPer]);

  useEffect(() => {
    if (!selectedSlice) {
      setRotation(0);
      return;
    }
    const idx = slices.findIndex((s) => s.id === selectedSlice.id);
    if (idx < 0) return;
    const target = EXTRA_ROTATIONS * 360 + (360 - idx * degPer);
    setIsAnimating(true);
    setRotation(target);
    const t = setTimeout(() => {
      setIsAnimating(false);
      onSpinComplete?.();
    }, SPIN_DURATION_MS);
    return () => clearTimeout(t);
  }, [selectedSlice?.id, degPer, slices, onSpinComplete]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code !== "Space" || !canSpin || !onSpin || isAnimating || selectedSlice) return;
      e.preventDefault();
      onSpin();
    },
    [canSpin, onSpin, isAnimating, selectedSlice]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleWheelClick = useCallback(() => {
    if (!canSpin || !onSpin || isAnimating || selectedSlice) return;
    onSpin();
  }, [canSpin, onSpin, isAnimating, selectedSlice]);

  const isHero = variant === "hero";
  const sizeClass = isHero ? "w-[min(80vw,480px,50vh)] h-[min(80vw,480px,50vh)]" : "w-44 h-44 sm:w-52 sm:h-52";
  const clickable = canSpin && !isAnimating && !selectedSlice;

  const wheelEl = (
    <div
      className={`relative flex-shrink-0 ${sizeClass} ${clickable ? "cursor-pointer" : ""}`}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={handleWheelClick}
      onKeyDown={(e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSpin?.();
        }
      }}
      aria-label={clickable ? "Spin wheel" : undefined}
    >
      <div
        className="absolute inset-0 rounded-full border-4 border-[var(--arcade-ink)]"
        style={{
          background: conicGradient,
          transform: `rotate(${rotation}deg)`,
          transition: isAnimating
            ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.02, 0.4, 0.15, 1)`
            : "none",
          boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.3), 0 0 32px rgba(255,45,149,0.25)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 w-0 h-0 -translate-x-1/2 -translate-y-1 z-10 pointer-events-none"
        style={{
          borderLeft: isHero ? "20px solid transparent" : "14px solid transparent",
          borderRight: isHero ? "20px solid transparent" : "14px solid transparent",
          borderTop: isHero ? "28px solid var(--neon-yellow)" : "20px solid var(--neon-yellow)",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );

  if (isHero) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-0 py-2">
        {wheelEl}
        <div className="mt-3 min-h-[3.5rem] flex flex-col items-center justify-center">
          {selectedSlice && !isAnimating && (
            <div className="px-4 py-2.5 rounded-lg border-2 border-[var(--neon-lime)] bg-[var(--arcade-surface)] scene-enter">
              <p className="text-[10px] text-[var(--neon-lime)] uppercase tracking-wider mb-0.5">Selected</p>
              <p className="text-sm sm:text-base font-bold text-[var(--arcade-ink)]">{selectedSlice.display_name}</p>
            </div>
          )}
          {selectedSlice && isAnimating && (
            <p className="text-sm text-[var(--arcade-ink-dim)]">Guess which slice…</p>
          )}
          {!selectedSlice && (
            <p className="text-sm text-[var(--arcade-ink-dim)] text-center">
              Spin when ready — click wheel or press Space
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="arcade-panel p-5">
      <h2 className="arcade-title">Wheel</h2>
      <div className="flex flex-wrap items-center gap-6">
        {wheelEl}
        <div className="min-w-[11rem]">
          {selectedSlice ? (
            <div className="arcade-panel-success p-4 rounded-xl animate-bounce-in">
              <p className="text-xs text-[var(--neon-lime)] uppercase tracking-wider mb-1">Selected</p>
              <p className="text-base leading-tight font-bold text-[var(--arcade-ink)]">{selectedSlice.display_name}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--arcade-ink-dim)]">SPIN IT!</p>
          )}
        </div>
      </div>
    </section>
  );
}
