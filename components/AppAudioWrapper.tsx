"use client";

import { AudioProvider } from "@/components/AudioProvider";

export function AppAudioWrapper({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
