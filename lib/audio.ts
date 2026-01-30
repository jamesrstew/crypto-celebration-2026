/**
 * Launch Roulette – audio paths and playback
 * BGM and SFX mapped to screen state + user interactions.
 */

const BASE = "/audio";
const G = `${BASE}/General Sounds`;

export const BGM = {
  splash: `${BASE}/start-screen.wav`,
  game: `${BASE}/gameplay-screen.wav`,
} as const;

export const SFX = {
  /** Wheel spin starts */
  spin: `${G}/Weird Sounds/sfx_sound_mechanicalnoise4.wav`,
  /** Wheel stops, slice selected */
  wheel_stop: `${G}/Impacts/sfx_sounds_impact5.wav`,
  /** Scenario revealed after wheel stops */
  scenario_reveal: `${G}/Positive Sounds/sfx_sounds_powerup3.wav`,
  /** Choice A–D clicked */
  choice_select: `${G}/Menu Sounds/sfx_menu_select2.wav`,
  /** Submit button */
  submit: `${G}/Buttons/sfx_sounds_button4.wav`,
  /** Outcome revealed */
  outcome_reveal: `${G}/Fanfares/sfx_sounds_fanfare2.wav`,
  /** Timer hits 0 */
  times_up: `${G}/Negative Sounds/sfx_sounds_negative1.wav`,
  /** Slide deck drop overlay */
  slide_drop: `${G}/Weird Sounds/sfx_sound_depressurizing.wav`,
  /** Catastrophe */
  catastrophe: `${G}/Negative Sounds/sfx_sounds_damage2.wav`,
  /** Advance / Next round */
  advance: `${G}/Buttons/sfx_sounds_button3.wav`,
  /** Press Start on splash */
  start_press: `${G}/Menu Sounds/sfx_menu_select1.wav`,
  /** Mute toggle (when unmuting) */
  mute_toggle: `${G}/Simple Bleeps/sfx_sounds_Blip4.wav`,
} as const;

export type SfxId = keyof typeof SFX;

let mute = false;

export function setMuted(value: boolean): boolean {
  mute = value;
  setBgmMuted(mute);
  return mute;
}

export function isMuted(): boolean {
  return mute;
}

function url(path: string): string {
  return path.replace(/ /g, "%20");
}

export function playSfx(id: SfxId): void {
  if (mute) return;
  const src = SFX[id];
  if (!src) return;
  try {
    const a = new Audio(url(src));
    a.volume = 0.6;
    a.play().catch(() => {});
  } catch {
    /* no-op */
  }
}

let bgmEl: HTMLAudioElement | null = null;
let currentBgmPath: string | null = null;

function getBgm(): HTMLAudioElement {
  if (!bgmEl) {
    bgmEl = new Audio();
    bgmEl.volume = 0.35;
    bgmEl.loop = true;
  }
  return bgmEl;
}

export function playBgm(path: string): void {
  const el = getBgm();
  const u = url(path);
  if (currentBgmPath === path && !el.paused) {
    el.muted = mute;
    return;
  }
  currentBgmPath = path;
  el.src = u;
  el.muted = mute;
  el.play().catch(() => {});
}

export function stopBgm(): void {
  const el = bgmEl;
  if (!el) return;
  currentBgmPath = null;
  el.pause();
  el.currentTime = 0;
  el.removeAttribute("src");
}

export function setBgmMuted(muted: boolean): void {
  const el = bgmEl;
  if (!el) return;
  el.muted = muted;
}
