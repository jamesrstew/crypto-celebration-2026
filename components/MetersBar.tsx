"use client";

import { METER_EMOJI, METER_LABELS, METER_MAX, type MeterKey } from "@/data/content";
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

export function MetersBar({ state }: { state: GameState }) {
  const m = state.meters;
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-2 px-4 bg-black/30 border-b border-[var(--arcade-ink-dim)]/30">
      {KEYS.map((k) => {
        const v = m[k];
        const pct = (v / METER_MAX) * 100;
        const color = COLORS[k];
        return (
          <div key={k} className="flex items-center gap-2">
            <span className="text-sm opacity-80">{METER_EMOJI[k]}</span>
            <div className="w-16 sm:w-24 h-2 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <span className="text-[10px] font-bold tabular-nums w-4" style={{ color }}>
              {v}
            </span>
          </div>
        );
      })}
      <span className="text-[10px] text-[var(--arcade-ink-dim)] uppercase tracking-wider ml-2">R{state.round}</span>
    </div>
  );
}
