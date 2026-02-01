"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/components/AudioProvider";

export function MuteToggle() {
  const { muted, toggleMuted, playSfx, bgmVolume, setBgmVolume } = useAudio();
  const [sliderOpen, setSliderOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSliderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sliderOpen]);

  const handleSpeakerClick = () => {
    setSliderOpen((open) => !open);
  };

  const handleMuteClick = () => {
    const wasMuted = muted;
    toggleMuted();
    if (wasMuted) playSfx("mute_toggle");
  };

  return (
    <div ref={containerRef} className="relative flex items-center shrink-0">
      <button
        type="button"
        onClick={handleSpeakerClick}
        className="flex items-center justify-center w-10 h-10 rounded border border-[var(--arcade-ink-dim)]/50 bg-black/20 hover:border-[var(--arcade-ink-dim)] hover:bg-black/30 transition-colors opacity-80 hover:opacity-100"
        aria-label={sliderOpen ? "Close music controls" : "Music controls"}
        aria-expanded={sliderOpen}
        title={sliderOpen ? "Close music controls" : "Music volume"}
      >
        {muted ? (
          <span className="text-base" aria-hidden>🔇</span>
        ) : (
          <span className="text-base" aria-hidden>🔊</span>
        )}
      </button>

      {sliderOpen && (
        <div
          className="absolute top-full right-0 mt-2 z-50 flex items-center gap-3 p-3 rounded-lg border-2 border-[var(--arcade-ink-dim)] bg-[var(--arcade-surface)] shadow-lg animate-fade-in"
          role="dialog"
          aria-label="Music volume"
        >
          <button
            type="button"
            onClick={handleMuteClick}
            className="flex items-center justify-center w-9 h-9 rounded border border-[var(--arcade-ink-dim)]/50 bg-black/20 hover:border-[var(--arcade-ink-dim)] hover:bg-black/30 transition-colors shrink-0"
            aria-label={muted ? "Unmute" : "Mute"}
            title={muted ? "Unmute" : "Mute"}
          >
            <span className="text-sm" aria-hidden>{muted ? "🔇" : "🔊"}</span>
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="bgm-volume" className="sr-only">
              Music volume
            </label>
            <input
              id="bgm-volume"
              type="range"
              min={0}
              max={100}
              value={Math.round(bgmVolume * 100)}
              onChange={(e) => setBgmVolume(Number(e.target.value) / 100)}
              disabled={muted}
              className="volume-slider w-24 h-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Music volume"
            />
          </div>
        </div>
      )}
    </div>
  );
}
