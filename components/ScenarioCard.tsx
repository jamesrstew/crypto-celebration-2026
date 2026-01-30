"use client";

import type { Scenario } from "@/data/content";

export function ScenarioCard({
  scenario,
  timerSeconds,
  timerRunning,
}: {
  scenario: Scenario | null;
  timerSeconds: number;
  timerRunning: boolean;
}) {
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  const timerStr = `${m}:${s.toString().padStart(2, "0")}`;

  if (!scenario) {
    return (
      <section className="arcade-panel-alt p-5">
        <h2 className="arcade-title">Scenario</h2>
        <p className="text-xs text-[var(--arcade-ink-dim)]">Reveal scenario after spin</p>
      </section>
    );
  }

  return (
    <section className="arcade-panel-alt p-5">
      <h2 className="arcade-title">Scenario</h2>
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--neon-cyan)] leading-relaxed">
          {scenario.title}
        </h3>
        {scenario.context && (
          <p className="text-[10px] text-[var(--arcade-ink-dim)] leading-relaxed">
            {scenario.context}
          </p>
        )}
        <p className="text-xs text-[var(--arcade-ink)] leading-relaxed">
          {scenario.prompt}
        </p>
        {timerRunning && (
          <div className="flex items-center gap-2 text-[var(--neon-yellow)] font-mono text-lg">
            <span className="animate-pulse">{timerStr}</span>
          </div>
        )}
      </div>
    </section>
  );
}
