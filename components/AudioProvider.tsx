"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as audio from "@/lib/audio";
import type { SfxId } from "@/lib/audio";

type AudioContextValue = {
  muted: boolean;
  setMuted: (value: boolean) => void;
  toggleMuted: () => void;
  playSfx: (id: SfxId) => void;
  playBgm: (key: keyof typeof audio.BGM) => void;
  stopBgm: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

const STORAGE_KEY = "launch-roulette-muted";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s != null) {
        const v = s === "true";
        setMutedState(v);
        audio.setMuted(v);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    audio.setMuted(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const playSfx = useCallback((id: SfxId) => {
    audio.playSfx(id);
  }, []);

  const playBgm = useCallback((key: keyof typeof audio.BGM) => {
    audio.playBgm(audio.BGM[key]);
  }, []);

  const stopBgm = useCallback(() => {
    audio.stopBgm();
  }, []);

  const value: AudioContextValue = {
    muted,
    setMuted,
    toggleMuted,
    playSfx,
    playBgm,
    stopBgm,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
