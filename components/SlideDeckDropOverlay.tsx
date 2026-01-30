"use client";

import type { SlideDeckDrop, Scenario, ChoiceId } from "@/data/content";

const COLORS = ["var(--neon-pink)", "var(--neon-blue)", "var(--neon-lime)", "var(--neon-orange)"];

export function SlideDeckDropOverlay({
  drop,
  scenario,
  onSelectAndSubmit,
}: {
  drop: SlideDeckDrop | null;
  scenario: Scenario | null;
  onSelectAndSubmit: (id: ChoiceId) => void;
}) {
  if (!drop || !scenario) return null;

  const choices = scenario.choices;

  return (
    <div
      className="arcade-panel max-w-2xl w-full p-8 animate-bounce-in"
      role="dialog"
      aria-label="Slide deck drop"
    >
      <h2 className="arcade-title text-[var(--neon-orange)]">Slide deck drop</h2>
      <p className="text-base text-[var(--arcade-ink)] mb-4 leading-relaxed">
        <strong>What&apos;s this?</strong> Sometimes a stakeholder &quot;drops&quot; into your deck with a last‑minute constraint. You have to re‑pick your choice with that in mind. (Annoying? Yes. Realistic? Also yes.)
      </p>
      <div className="rounded-xl border-2 border-[var(--neon-orange)]/60 bg-black/20 p-5 mb-5">
        <p className="text-xs text-[var(--arcade-ink-dim)] uppercase tracking-wider mb-2">
          Anthony Noto has slid into your deck:
        </p>
        <p className="text-base sm:text-lg text-[var(--arcade-ink)] font-bold mb-2">
          &quot;{drop.constraint_text}&quot;
        </p>
        <p className="text-sm text-[var(--arcade-ink-dim)]">
          {drop.effect_instruction}
        </p>
      </div>
      <p className="text-sm text-[var(--neon-pink)] uppercase tracking-wider mb-4">
        Re‑pick your choice (click to lock and reveal):
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {choices.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectAndSubmit(c.id)}
            className="p-5 rounded-xl border-[3px] text-left transition-all hover:opacity-90"
            style={{
              borderColor: COLORS[i],
              color: COLORS[i],
              background: "var(--arcade-surface)",
            }}
          >
            <span className="font-bold text-base mr-2">{c.id})</span>
            <span className="text-sm sm:text-base text-[var(--arcade-ink)]">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
