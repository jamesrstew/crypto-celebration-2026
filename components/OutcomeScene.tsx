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

export function OutcomeScene({
  state,
  onAdvance,
  canAdvance,
}: {
  state: GameState;
  onAdvance: () => void;
  canAdvance: boolean;
}) {
  const outcome = getCurrentOutcome(state);
  const showDeltas = shouldShowOutcomeDeltas(state);

  if (!outcome) return null;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center px-4 sm:px-6 py-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-6 text-center scene-enter">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--neon-lime)] leading-tight">
          {outcome.headline}
        </h2>
        <p className="text-sm sm:text-base text-[var(--arcade-ink)] leading-relaxed">
          {outcome.narrative}
        </p>
        {showDeltas && (
          <div className="flex flex-wrap justify-center gap-3">
            {METER_KEYS.map((k) => (
              <span
                key={k}
                className="text-xs sm:text-sm font-mono px-4 py-2 rounded-xl bg-black/30 border border-[var(--arcade-ink-dim)]/30"
              >
                <span className="mr-1.5" aria-hidden>{METER_EMOJI[k]}</span>
                {METER_LABELS[k]} {formatDelta(outcome.meter_deltas[k])}
              </span>
            ))}
          </div>
        )}
        {!showDeltas && (
          <p className="text-sm text-[var(--arcade-ink-dim)]">Meter impacts hidden this round.</p>
        )}
        {canAdvance && (
          <button
            type="button"
            onClick={onAdvance}
            className="btn-arcade btn-arcade-primary text-sm sm:text-base px-10 py-4 mt-2"
          >
            Next round
          </button>
        )}
      </div>
    </div>
  );
}
