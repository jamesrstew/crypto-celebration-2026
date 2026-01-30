"use client";

import type { Catastrophe, MeterKey } from "@/data/content";
import { METER_EMOJI, METER_LABELS } from "@/data/content";

export function CatastropheCard({
  catastrophe,
  zeroedMeter,
  onDismiss,
}: {
  catastrophe: Catastrophe | null;
  zeroedMeter: MeterKey | null;
  onDismiss: () => void;
}) {
  if (!catastrophe) return null;

  const triggerText = zeroedMeter
    ? `${METER_EMOJI[zeroedMeter]} ${METER_LABELS[zeroedMeter]} hit zero!`
    : catastrophe.trigger_condition;

  return (
    <div
      className="max-w-2xl w-full p-8 rounded-xl border-[4px] border-[var(--neon-red)] bg-[var(--arcade-surface)] animate-bounce-in"
      role="dialog"
      aria-label="Catastrophe"
      style={{ boxShadow: "0 0 32px rgba(255,71,87,0.35), 4px 4px 0 rgba(0,0,0,0.4)" }}
    >
      <h2 className="text-lg sm:text-xl font-bold mb-3 text-[var(--neon-red)] uppercase tracking-wider">
        {catastrophe.title}
      </h2>
      <p className="text-sm text-[var(--arcade-ink-dim)] mb-2">
        {triggerText}
      </p>
      <p className="text-base text-[var(--arcade-ink)] mb-5 leading-relaxed">
        {catastrophe.description}
      </p>
      <p className="text-sm font-bold text-[var(--neon-red)] mb-6">
        {catastrophe.effect}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="btn-arcade btn-arcade-primary text-base px-8 py-4"
      >
        Continue
      </button>
    </div>
  );
}
