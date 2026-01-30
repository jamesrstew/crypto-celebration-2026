/**
 * Launch Roulette – game state
 * Single in-memory state. Reset on "Reset Game" or refresh.
 */

import type {
  ChoiceId,
  MeterKey,
  MeterDeltas,
  Scenario,
  Slice,
  Catastrophe,
  SlideDeckDrop,
} from "@/data/content";
import {
  getSlices,
  DEFAULT_METER,
  METER_MIN,
  METER_MAX,
  getSlideDeckDrops,
  getCatastrophes,
} from "@/data/content";

export type Screen = "splash" | "game" | "end";

export type Phase =
  | "idle"
  | "slice_selected"
  | "scenario_revealed"
  | "choice_locked"
  | "drop_active"
  | "choice_relocked"
  | "outcome_revealed"
  | "catastrophe_check"
  | "advancing";

export interface Meters {
  launch_velocity: number;
  risk_containment: number;
  team_sanity: number;
  exec_confidence: number;
}

export interface GameState {
  screen: Screen;
  phase: Phase;
  round: number;
  usedScenarioIds: string[];
  selectedSlice: Slice | null;
  activeScenario: Scenario | null;
  lockedChoice: ChoiceId | null;
  selectedChoice: ChoiceId | null;
  meters: Meters;
  slideDeckDropActive: boolean;
  dropTriggeredThisRound: boolean;
  activeDrop: SlideDeckDrop | null;
  catastropheActive: boolean;
  activeCatastrophe: Catastrophe | null;
  timerSeconds: number;
  outcomeRevealed: boolean;
  hideNextOutcomeDeltas: boolean;
  hideThisOutcomeDeltas: boolean;
  restrictSlicesTo6_9: boolean;
  catastropheIndex: number;
  /** Next round index (1-based) at which we may trigger a random slide-deck drop. */
  nextDropAtRound: number;
}

function clampMeter(v: number): number {
  return Math.max(METER_MIN, Math.min(METER_MAX, v));
}

function addDeltas(meters: Meters, d: MeterDeltas): Meters {
  return {
    launch_velocity: clampMeter(meters.launch_velocity + d.launch_velocity),
    risk_containment: clampMeter(meters.risk_containment + d.risk_containment),
    team_sanity: clampMeter(meters.team_sanity + d.team_sanity),
    exec_confidence: clampMeter(meters.exec_confidence + d.exec_confidence),
  };
}

function anyMeterZero(m: Meters): boolean {
  return (
    m.launch_velocity === 0 ||
    m.risk_containment === 0 ||
    m.team_sanity === 0 ||
    m.exec_confidence === 0
  );
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const INITIAL_METERS: Meters = {
  launch_velocity: DEFAULT_METER,
  risk_containment: DEFAULT_METER,
  team_sanity: DEFAULT_METER,
  exec_confidence: DEFAULT_METER,
};

export const TIMER_START_SECONDS = 120;

export type GameAction =
  | { type: "START_GAME" }
  | { type: "SPIN_WHEEL" }
  | { type: "REVEAL_SCENARIO" }
  | { type: "TIMER_TICK" }
  | { type: "SELECT_CHOICE"; choiceId: ChoiceId }
  | { type: "LOCK_CHOICE"; choiceId: ChoiceId }
  | { type: "REVEAL_OUTCOME" }
  | { type: "DISMISS_CATASTROPHE" }
  | { type: "ADVANCE_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "END_GAME" };

function pickRandomSlice(state: GameState): Slice {
  const slices = getSlices();
  const pool =
    state.restrictSlicesTo6_9
      ? slices.filter((s) => s.sliceIndex >= 6 && s.sliceIndex <= 9)
      : slices;
  if (pool.length === 0) return slices[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickScenarioFromSlice(slice: Slice, usedIds: string[]): Scenario | null {
  const available = slice.scenarios.filter((s) => !usedIds.includes(s.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function getNextCatastrophe(index: number): Catastrophe {
  const list = getCatastrophes();
  return list[index % list.length];
}

function pickRandomDrop(): SlideDeckDrop {
  const list = getSlideDeckDrops();
  return list[Math.floor(Math.random() * list.length)];
}

export function getCurrentOutcome(state: GameState): {
  headline: string;
  narrative: string;
  meter_deltas: MeterDeltas;
} | null {
  if (!state.activeScenario || state.lockedChoice === null) return null;
  const choice = state.activeScenario.choices.find((c) => c.id === state.lockedChoice);
  if (!choice) return null;
  return choice.outcome;
}

export function initialGameState(): GameState {
  return {
    screen: "splash",
    phase: "idle",
    round: 0,
    usedScenarioIds: [],
    selectedSlice: null,
    activeScenario: null,
    lockedChoice: null,
    selectedChoice: null,
    meters: { ...INITIAL_METERS },
    slideDeckDropActive: false,
    dropTriggeredThisRound: false,
    activeDrop: null,
    catastropheActive: false,
    activeCatastrophe: null,
    timerSeconds: 0,
    outcomeRevealed: false,
    hideNextOutcomeDeltas: false,
    hideThisOutcomeDeltas: false,
    restrictSlicesTo6_9: false,
    catastropheIndex: 0,
    nextDropAtRound: randomInt(2, 5),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...initialGameState(),
        screen: "game",
        phase: "idle",
        round: 1,
        nextDropAtRound: randomInt(2, 5),
      };
    }

    case "SPIN_WHEEL": {
      if (state.phase !== "idle") return state;
      const selectedSlice = pickRandomSlice(state);
      return {
        ...state,
        phase: "slice_selected",
        selectedSlice,
        activeScenario: null,
        lockedChoice: null,
        selectedChoice: null,
        outcomeRevealed: false,
        dropTriggeredThisRound: false,
        activeDrop: null,
        restrictSlicesTo6_9: false,
      };
    }

    case "REVEAL_SCENARIO": {
      if (state.phase !== "slice_selected" || !state.selectedSlice) return state;
      const scenario = pickScenarioFromSlice(
        state.selectedSlice,
        state.usedScenarioIds
      );
      if (!scenario) return state;
      return {
        ...state,
        phase: "scenario_revealed",
        activeScenario: scenario,
        usedScenarioIds: [...state.usedScenarioIds, scenario.id],
        selectedChoice: null,
        timerSeconds: TIMER_START_SECONDS,
      };
    }

    case "TIMER_TICK": {
      const inScenario =
        state.phase === "scenario_revealed" ||
        state.phase === "choice_locked" ||
        state.phase === "drop_active" ||
        state.phase === "choice_relocked";
      if (!inScenario || state.timerSeconds <= 0) return state;
      return { ...state, timerSeconds: state.timerSeconds - 1 };
    }

    case "SELECT_CHOICE": {
      if (state.phase !== "scenario_revealed" && state.phase !== "drop_active")
        return state;
      if (state.phase === "drop_active") {
        return {
          ...state,
          selectedChoice: action.choiceId,
          phase: "scenario_revealed",
          slideDeckDropActive: false,
          activeDrop: null,
        };
      }
      const shouldDrop =
        !state.dropTriggeredThisRound &&
        state.round >= state.nextDropAtRound;
      if (shouldDrop) {
        return {
          ...state,
          phase: "drop_active",
          slideDeckDropActive: true,
          activeDrop: pickRandomDrop(),
          dropTriggeredThisRound: true,
          selectedChoice: null,
        };
      }
      return { ...state, selectedChoice: action.choiceId };
    }

    case "LOCK_CHOICE": {
      if (
        state.phase !== "scenario_revealed" &&
        state.phase !== "drop_active"
      )
        return state;
      const nextPhase: Phase =
        state.phase === "drop_active" ? "choice_relocked" : "choice_locked";
      return {
        ...state,
        phase: nextPhase,
        lockedChoice: action.choiceId,
        slideDeckDropActive: state.phase === "drop_active" ? false : state.slideDeckDropActive,
        activeDrop: state.phase === "drop_active" ? null : state.activeDrop,
      };
    }

    case "REVEAL_OUTCOME": {
      const ready =
        state.phase === "choice_locked" || state.phase === "choice_relocked";
      if (!ready || !state.activeScenario || state.lockedChoice === null)
        return state;
      const choice = state.activeScenario.choices.find(
        (c) => c.id === state.lockedChoice
      );
      if (!choice) return state;
      const outcome = choice.outcome;
      const meters = addDeltas(state.meters, outcome.meter_deltas);
      const catastrophe = anyMeterZero(meters);
      const nextCat = catastrophe
        ? getNextCatastrophe(state.catastropheIndex)
        : null;
      const restrict = nextCat?.effectType === "restrict_slices_6_9" || false;
      const hideDeltas =
        nextCat?.effectType === "hide_next_outcome_deltas" || false;
      const hideThis = state.hideNextOutcomeDeltas;
      const emergencyAllHands =
        nextCat?.effectType === "narrative_only" &&
        nextCat?.id === "emergency_all_hands";
      const narrativeSanity = emergencyAllHands
        ? clampMeter(meters.team_sanity - 1)
        : meters.team_sanity;
      const metersAfterCat =
        catastrophe && emergencyAllHands
          ? { ...meters, team_sanity: narrativeSanity }
          : meters;
      return {
        ...state,
        phase: catastrophe ? "catastrophe_check" : "advancing",
        meters: metersAfterCat,
        outcomeRevealed: true,
        catastropheActive: !!catastrophe,
        activeCatastrophe: nextCat,
        catastropheIndex: catastrophe
          ? state.catastropheIndex + 1
          : state.catastropheIndex,
        restrictSlicesTo6_9: restrict || state.restrictSlicesTo6_9,
        hideNextOutcomeDeltas: hideDeltas,
        hideThisOutcomeDeltas: hideThis,
      };
    }

    case "DISMISS_CATASTROPHE": {
      if (state.phase !== "catastrophe_check") return state;
      return {
        ...state,
        phase: "advancing",
        catastropheActive: false,
        activeCatastrophe: null,
      };
    }

    case "ADVANCE_ROUND": {
      if (state.phase !== "advancing") return state;
      const nextRound = state.round + 1;
      const hadDrop = state.dropTriggeredThisRound;
      return {
        ...state,
        phase: "idle",
        round: nextRound,
        selectedSlice: null,
        activeScenario: null,
        lockedChoice: null,
        selectedChoice: null,
        outcomeRevealed: false,
        dropTriggeredThisRound: false,
        activeDrop: null,
        hideNextOutcomeDeltas: false,
        hideThisOutcomeDeltas: false,
        nextDropAtRound: hadDrop
          ? nextRound + randomInt(2, 5)
          : state.nextDropAtRound,
      };
    }

    case "RESET_GAME":
      return { ...initialGameState(), screen: "splash" };

    case "END_GAME":
      return { ...state, screen: "end" };

    default:
      return state;
  }
}
