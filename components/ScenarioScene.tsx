"use client";

import { useState, useEffect, useRef } from "react";
import type { Scenario } from "@/data/content";
import type { ChoiceId } from "@/data/content";
import { useAudio } from "@/components/AudioProvider";

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];
const CHOICE_COLORS = ["var(--neon-pink)", "var(--neon-blue)", "var(--neon-lime)", "var(--neon-orange)"];
const CHOICE_GLOW = [
  "0 0 20px rgba(255,45,149,0.4)",
  "0 0 20px rgba(0,212,255,0.4)",
  "0 0 20px rgba(184,255,60,0.4)",
  "0 0 20px rgba(255,159,67,0.4)",
];

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ScenarioScene({
  scenario,
  selectedChoice,
  lockedChoice,
  timerSeconds,
  onSubmit,
  onSelectChoice,
  canSubmit,
}: {
  scenario: Scenario;
  selectedChoice: ChoiceId | null;
  lockedChoice: ChoiceId | null;
  timerSeconds: number;
  onSubmit: () => void;
  onSelectChoice: (id: ChoiceId) => void;
  canSubmit: boolean;
}) {
  const { playSfx } = useAudio();
  const [showChoices, setShowChoices] = useState(false);
  const timesUpPlayedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setShowChoices(true), 380);
    return () => clearTimeout(t);
  }, [scenario.id]);

  useEffect(() => {
    if (timerSeconds <= 0 && !timesUpPlayedRef.current) {
      timesUpPlayedRef.current = true;
      playSfx("times_up");
    }
    if (timerSeconds > 0) timesUpPlayedRef.current = false;
  }, [timerSeconds, playSfx]);

  const timesUp = timerSeconds <= 0;
  const low = timerSeconds > 0 && timerSeconds <= 10;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-6 scene-enter">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--neon-cyan)] text-center">
          {scenario.title}
        </h2>
        {scenario.context && (
          <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] text-center leading-relaxed">
            {scenario.context}
          </p>
        )}
        <p className="text-sm text-[var(--arcade-ink)] text-center leading-relaxed">
          {scenario.prompt}
        </p>
        <div
          className={`font-mono text-xl sm:text-2xl font-bold px-4 py-2 rounded-lg ${
            timesUp ? "bg-[var(--neon-red)]/20 text-[var(--neon-red)]" : low ? "text-[var(--neon-red)]" : "text-[var(--neon-yellow)]"
          }`}
        >
          {timesUp ? "Time's up!" : formatCountdown(timerSeconds)}
        </div>

        <div className={`w-full grid grid-cols-1 sm:grid-cols-2 gap-3 ${showChoices ? "choices-enter" : "opacity-0"}`}>
          {CHOICE_IDS.map((id, i) => {
            const c = scenario.choices.find((x) => x.id === id);
            if (!c) return null;
            const selected = selectedChoice === id;
            const locked = lockedChoice === id;
            const color = CHOICE_COLORS[i];
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectChoice(id)}
                className="p-4 rounded-xl border-[3px] text-left transition-all duration-200 disabled:cursor-default"
                style={{
                  borderColor: color,
                  background: locked ? "var(--arcade-bg)" : selected ? "var(--arcade-bg)" : "var(--arcade-surface)",
                  boxShadow: selected || locked ? CHOICE_GLOW[i] : "none",
                }}
              >
                <span className="font-bold text-sm sm:text-base mr-2" style={{ color }}>{id})</span>
                <span className="text-sm sm:text-base text-[var(--arcade-ink)] leading-snug">{c.label}</span>
                {locked && (
                  <span className="block mt-2 text-xs uppercase" style={{ color }}>Locked</span>
                )}
              </button>
            );
          })}
        </div>

        {canSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            className="btn-arcade btn-arcade-primary text-sm sm:text-base px-10 py-4"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
