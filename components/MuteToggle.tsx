"use client";

import { useAudio } from "@/components/AudioProvider";

export function MuteToggle() {
  const { muted, toggleMuted, playSfx } = useAudio();

  const handleClick = () => {
    const wasMuted = muted;
    toggleMuted();
    if (wasMuted) playSfx("mute_toggle");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center w-10 h-10 rounded border border-[var(--arcade-ink-dim)]/50 bg-black/20 hover:border-[var(--arcade-ink-dim)] hover:bg-black/30 transition-colors opacity-80 hover:opacity-100"
      aria-label={muted ? "Unmute" : "Mute"}
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? (
        <span className="text-base" aria-hidden>🔇</span>
      ) : (
        <span className="text-base" aria-hidden>🔊</span>
      )}
    </button>
  );
}
