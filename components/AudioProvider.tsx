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
  bgmVolume: number;
  setBgmVolume: (value: number) => void;
  playSfx: (id: SfxId) => void;
  playBgm: (key: keyof typeof audio.BGM) => void;
  stopBgm: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

const STORAGE_KEY_MUTED = "launch-roulette-muted";
const STORAGE_KEY_BGM_VOLUME = "launch-roulette-bgm-volume";
const DEFAULT_BGM_VOLUME = 0.5;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const [bgmVolume, setBgmVolumeState] = useState(DEFAULT_BGM_VOLUME);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY_MUTED);
      if (s != null) {
        const v = s === "true";
        setMutedState(v);
        audio.setMuted(v);
      }
      const v = localStorage.getItem(STORAGE_KEY_BGM_VOLUME);
      if (v != null) {
        const n = parseFloat(v);
        if (!Number.isNaN(n) && n >= 0 && n <= 1) {
          setBgmVolumeState(n);
          audio.setBgmVolume(n);
        } else {
          audio.setBgmVolume(DEFAULT_BGM_VOLUME);
        }
      } else {
        audio.setBgmVolume(DEFAULT_BGM_VOLUME);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
    audio.setMuted(value);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(value));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
  }, [muted, setMuted]);

  const setBgmVolume = useCallback((value: number) => {
    const v = Math.max(0, Math.min(1, value));
    setBgmVolumeState(v);
    audio.setBgmVolume(v);
    try {
      localStorage.setItem(STORAGE_KEY_BGM_VOLUME, String(v));
    } catch {
      /* ignore */
    }
  }, []);

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
    bgmVolume,
    setBgmVolume,
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
