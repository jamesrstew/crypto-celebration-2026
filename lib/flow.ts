/**
 * Launch Roulette – flow helpers
 */

import type { GameState } from "./game-state";

export function canSpinWheel(s: GameState): boolean {
  return s.phase === "idle";
}

export function canDismissCatastrophe(s: GameState): boolean {
  return s.phase === "catastrophe_check";
}

export function canAdvanceRound(s: GameState): boolean {
  return s.phase === "advancing";
}

export function canSubmit(s: GameState): boolean {
  return (
    (s.phase === "scenario_revealed" || s.phase === "drop_active") &&
    s.selectedChoice !== null
  );
}

export function shouldShowOutcomeDeltas(state: GameState): boolean {
  return state.outcomeRevealed && !state.hideThisOutcomeDeltas;
}

export function isTimerCountingDown(state: GameState): boolean {
  const inScenario =
    state.phase === "scenario_revealed" ||
    state.phase === "choice_locked" ||
    state.phase === "drop_active" ||
    state.phase === "choice_relocked";
  return inScenario && state.timerSeconds > 0;
}
