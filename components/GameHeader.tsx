"use client";

import { METER_EMOJI, METER_LABELS, METER_MAX, type MeterKey } from "@/data/content";
import { useAudio } from "@/components/AudioProvider";
import type { GameState } from "@/lib/game-state";

const KEYS: MeterKey[] = [
  "launch_velocity",
  "risk_containment",
  "team_sanity",
  "exec_confidence",
];
const COLORS: Record<MeterKey, string> = {
  launch_velocity: "var(--neon-orange)",
  risk_containment: "var(--neon-red)",
  team_sanity: "var(--neon-lime)",
  exec_confidence: "var(--neon-cyan)",
};

export function GameHeader({
  state,
  onEndGame,
  onInstructionsClick,
}: {
  state: GameState;
  onEndGame: () => void;
  onInstructionsClick?: () => void;
}) {
  const { muted, toggleMuted, playSfx } = useAudio();
  const m = state.meters;

  const handleMuteClick = () => {
    const wasMuted = muted;
    toggleMuted();
    if (wasMuted) playSfx("mute_toggle");
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 px-4 sm:px-6 bg-black/30 border-b border-[var(--arcade-ink-dim)]/30 shrink-0">
      <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 min-w-0 flex-1">
        {KEYS.map((k) => {
          const v = m[k];
          const pct = (v / METER_MAX) * 100;
          const color = COLORS[k];
          return (
            <div key={k} className="flex flex-col items-center gap-1 min-w-[120px] sm:min-w-[140px]">
              <div className="flex items-center gap-2 w-full">
                <span className="text-base sm:text-lg opacity-90 shrink-0" aria-hidden>
                  {METER_EMOJI[k]}
                </span>
                <div className="flex-1 min-w-0 h-3 rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums w-6 shrink-0 text-center" style={{ color }}>
                  {v}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-tight text-center w-full">
                {METER_LABELS[k]}
              </span>
            </div>
          );
        })}
        <span className="text-sm font-bold text-[var(--arcade-ink-dim)] uppercase tracking-wider shrink-0 self-center">
          Round {state.round}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 shrink-0">
        {onInstructionsClick && (
          <>
            <button
              type="button"
              onClick={onInstructionsClick}
              className="px-3 py-1.5 rounded border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] text-xs uppercase tracking-wider hover:bg-[var(--neon-cyan)]/10 transition-colors"
            >
              Instructions
            </button>
            <span className="text-[var(--arcade-ink-dim)]/40 text-sm" aria-hidden>|</span>
          </>
        )}
        <button
          type="button"
          onClick={onEndGame}
          className="px-3 py-1.5 rounded border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] text-xs uppercase tracking-wider hover:bg-[var(--neon-cyan)]/10 transition-colors"
        >
          End game
        </button>
        <span className="text-[var(--arcade-ink-dim)]/40 text-sm" aria-hidden>|</span>
        <button
          type="button"
          onClick={handleMuteClick}
          className="flex items-center justify-center w-10 h-10 rounded border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 transition-colors"
          aria-label={muted ? "Unmute" : "Mute"}
          title={muted ? "Unmute" : "Mute"}
        >
          <span className="text-lg" aria-hidden>
            {muted ? "🔇" : "🔊"}
          </span>
        </button>
      </div>
    </header>
  );
}
