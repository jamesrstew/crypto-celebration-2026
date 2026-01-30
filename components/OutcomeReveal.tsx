"use client";

import { getCurrentOutcome } from "@/lib/game-state";
import { shouldShowOutcomeDeltas } from "@/lib/flow";
import { METER_EMOJI, METER_LABELS, type MeterKey } from "@/data/content";
import type { GameState } from "@/lib/game-state";

const METER_KEYS: MeterKey[] = [
  "launch_velocity",
  "risk_containment",
  "team_sanity",
  "exec_confidence",
];

function formatDelta(d: number): string {
  if (d > 0) return `+${d}`;
  if (d < 0) return `${d}`;
  return "0";
}

export function OutcomeReveal({ state }: { state: GameState }) {
  const outcome = getCurrentOutcome(state);
  const showDeltas = shouldShowOutcomeDeltas(state);

  if (!state.outcomeRevealed || !outcome) {
    return (
      <section className="arcade-panel p-5">
        <h2 className="arcade-title">Outcome</h2>
        <p className="text-xs text-[var(--arcade-ink-dim)]">Reveal outcome after locking choice</p>
      </section>
    );
  }

  return (
    <section className="arcade-panel-success p-6 animate-bounce-in">
      <h2 className="arcade-title">Outcome</h2>
      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-[var(--neon-lime)]">{outcome.headline}</h3>
        <p className="text-base text-[var(--arcade-ink)] leading-relaxed">{outcome.narrative}</p>
        {showDeltas && (
          <div className="flex flex-wrap gap-3 mt-4">
            {METER_KEYS.map((k) => (
              <span key={k} className="text-sm font-mono px-3 py-2 rounded-lg bg-black/20">
                {METER_EMOJI[k]} {METER_LABELS[k]} {formatDelta(outcome.meter_deltas[k])}
              </span>
            ))}
          </div>
        )}
        {!showDeltas && (
          <p className="text-sm text-[var(--arcade-ink-dim)] mt-2">Meter impacts hidden this round.</p>
        )}
      </div>
    </section>
  );
}
