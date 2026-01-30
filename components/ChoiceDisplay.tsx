"use client";

import type { Scenario } from "@/data/content";
import type { ChoiceId } from "@/data/content";

const CHOICE_IDS: ChoiceId[] = ["A", "B", "C", "D"];
const CHOICE_COLORS = [
  "var(--neon-pink)",
  "var(--neon-blue)",
  "var(--neon-lime)",
  "var(--neon-orange)",
];
const CHOICE_GLOW = [
  "0 0 16px rgba(255,45,149,0.4)",
  "0 0 16px rgba(0,212,255,0.4)",
  "0 0 16px rgba(184,255,60,0.4)",
  "0 0 16px rgba(255,159,67,0.4)",
];

export function ChoiceDisplay({
  scenario,
  lockedChoice,
}: {
  scenario: Scenario | null;
  lockedChoice: ChoiceId | null;
}) {
  if (!scenario) {
    return (
      <section className="arcade-panel p-5">
        <h2 className="arcade-title">Choices</h2>
        <p className="text-xs text-[var(--arcade-ink-dim)]">Reveal scenario first</p>
      </section>
    );
  }

  return (
    <section className="arcade-panel p-5">
      <h2 className="arcade-title">Choices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHOICE_IDS.map((id, i) => {
          const c = scenario.choices.find((x) => x.id === id);
          if (!c) return null;
          const locked = lockedChoice === id;
          const borderColor = CHOICE_COLORS[i];
          return (
            <div
              key={id}
              className={`p-3 rounded border-[3px] text-left transition-all duration-200 ${
                locked ? "bg-[var(--arcade-bg)]" : "bg-[var(--arcade-surface)]"
              }`}
              style={{
                borderColor,
                boxShadow: locked ? CHOICE_GLOW[i] : "none",
              }}
            >
              <span className="font-bold text-sm mr-2" style={{ color: borderColor }}>{id})</span>
              <span className="text-xs text-[var(--arcade-ink)]">{c.label}</span>
              {locked && (
                <span className="block mt-1 text-[10px] uppercase tracking-wider" style={{ color: borderColor }}>
                  Locked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
