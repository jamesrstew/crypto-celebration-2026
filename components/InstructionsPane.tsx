"use client";

import { METER_EMOJI } from "@/data/content";

/**
 * Shared instructions content used on the splash screen and in the game overlay.
 */
export function InstructionsPane() {
  return (
    <div className="text-left space-y-3">
      <p className="text-sm font-bold text-[var(--arcade-ink)] uppercase">How to play</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        1. Spin the wheel (click it or press Space). Guess where it will land.
      </p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        2. When it stops, a scenario appears. Read it aloud. You have 2 minutes to discuss in breakouts.
      </p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        3. Click a choice (A, B, C, or D), then Submit. The outcome is revealed and the four health bars update.
      </p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        4. Hit &quot;Next round&quot; and spin again. Sometimes a &quot;Code Review Drop&quot; forces you to re‑pick (you&apos;ll see).
      </p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        5. Play 8–10 rounds, then End game to see final results.
      </p>
      <p className="text-sm font-bold text-[var(--arcade-ink)] uppercase mt-3">The four health bars</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)]">{METER_EMOJI.launch_velocity} Launch Velocity — pace of shipping</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)]">{METER_EMOJI.risk_containment} Risk Containment — keeping things safe</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)]">{METER_EMOJI.team_sanity} Team Sanity — how held‑together the team is</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)]">{METER_EMOJI.exec_confidence} Exec Confidence — leadership nerves</p>
      <p className="text-sm font-bold text-[var(--arcade-ink)] uppercase mt-3">Goal</p>
      <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed">
        Don&apos;t let any bar hit zero. If one does, a &quot;Catastrophe&quot; hits and things get weird. There&apos;s no single winner—you&apos;re trying to survive the launch together and see how you did at the end.
      </p>
    </div>
  );
}
