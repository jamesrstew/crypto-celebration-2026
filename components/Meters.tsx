"use client";

import { METER_EMOJI, METER_LABELS, METER_MAX, type MeterKey } from "@/data/content";
import type { GameState } from "@/lib/game-state";

const METER_KEYS: MeterKey[] = [
  "launch_velocity",
  "risk_containment",
  "team_sanity",
  "exec_confidence",
];

const METER_COLORS: Record<MeterKey, string> = {
  launch_velocity: "var(--neon-orange)",
  risk_containment: "var(--neon-red)",
  team_sanity: "var(--neon-lime)",
  exec_confidence: "var(--neon-cyan)",
};

const SEGMENTS = 10;

export function Meters({ state }: { state: GameState }) {
  const m = state.meters;

  return (
    <section className="arcade-panel p-5">
      <h2 className="arcade-title">Meters</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METER_KEYS.map((k) => {
          const v = m[k];
          const pct = (v / METER_MAX) * 100;
          const fill = (v / METER_MAX) * SEGMENTS;
          const color = METER_COLORS[k];
          return (
            <div key={k} className="space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-[var(--arcade-ink-dim)]">
                  {METER_EMOJI[k]} {METER_LABELS[k]}
                </span>
                <span className="font-bold" style={{ color }}>{v}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: SEGMENTS }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 flex-1 rounded-sm transition-all duration-300"
                    style={{
                      background: i < Math.round(fill) ? color : "var(--arcade-bg)",
                      opacity: i < Math.round(fill) ? 1 : 0.4,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
