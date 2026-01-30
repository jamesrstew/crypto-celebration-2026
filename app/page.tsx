"use client";

import { useReducer, useEffect, useState, useCallback, useRef } from "react";
import {
  initialGameState,
  gameReducer,
  type GameState,
} from "@/lib/game-state";
import { METER_EMOJI, METER_LABELS, type MeterKey } from "@/data/content";
import { canSubmit, canAdvanceRound, canSpinWheel, isTimerCountingDown } from "@/lib/flow";
import { useAudio } from "@/components/AudioProvider";
import { MuteToggle } from "@/components/MuteToggle";
import { GameHeader } from "@/components/GameHeader";
import { Wheel } from "@/components/Wheel";
import { ScenarioScene } from "@/components/ScenarioScene";
import { OutcomeScene } from "@/components/OutcomeScene";
import { CodeDropOverlay } from "@/components/CodeDropOverlay";
import { CatastropheCard } from "@/components/CatastropheCard";

const GATE_PASSWORD = "fastfollow";
const GATE_STORAGE_KEY = "lr_gate";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (value === GATE_PASSWORD) {
      if (typeof sessionStorage !== "undefined") sessionStorage.setItem(GATE_STORAGE_KEY, "1");
      onUnlock();
    } else {
      setError("Wrong password");
    }
  };
  return (
    <main className="h-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-[var(--arcade-bg)]">
      <div className="arcade-panel max-w-sm w-full p-6 text-center space-y-4">
        <h1 className="text-xl text-[var(--arcade-ink)]">Enter password</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-[var(--arcade-ink)] bg-[var(--arcade-surface)] text-[var(--arcade-ink)] placeholder-[var(--arcade-ink-dim)] focus:outline-none focus:border-[var(--neon-cyan)]"
            placeholder="Password"
            autoFocus
            autoComplete="off"
          />
          {error && <p className="text-sm text-[var(--neon-red)]">{error}</p>}
          <button type="submit" className="btn-arcade btn-arcade-primary w-full py-3">
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}

function SplashScreen({
  onStart,
  onHowToPlayClick,
  showInstructions,
  onFirstInteraction,
}: {
  onStart: () => void;
  onHowToPlayClick: (show: boolean) => void;
  showInstructions: boolean;
  onFirstInteraction?: () => void;
}) {
  const handleHowToPlay = () => {
    onFirstInteraction?.();
    onHowToPlayClick(true);
  };
  const handleBack = () => {
    onHowToPlayClick(false);
  };
  const handleStart = () => {
    onFirstInteraction?.();
    onStart();
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <MuteToggle />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
        <div
          className={`arcade-panel max-w-2xl w-full text-center space-y-4 animate-bounce-in ${
            showInstructions ? "max-h-[90vh] overflow-y-auto flex flex-col" : ""
          }`}
        >
          <div className="p-6 sm:p-8 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-[var(--neon-yellow)] leading-relaxed">
              LAUNCH ROULETTE
            </h1>
            <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] leading-relaxed max-w-md mx-auto mt-2">
              Relive the crypto launch—emotionally, not technically. No right answers. Just chaos.
            </p>
          </div>
          {!showInstructions ? (
            <div className="pb-6">
              <button
                type="button"
                onClick={handleHowToPlay}
                className="btn-arcade btn-arcade-primary text-sm px-10 py-4"
              >
                How to play
              </button>
            </div>
          ) : (
            <div className="text-left space-y-3 bg-black/20 rounded-xl p-4 sm:p-5 mx-4 sm:mx-6 mb-4 shrink-0">
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
                Don’t let any bar hit zero. If one does, a &quot;Catastrophe&quot; hits and things get weird. There’s no single winner—you’re trying to survive the launch together and see how you did at the end.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-[var(--neon-cyan)] hover:underline"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStart}
                  className="btn-arcade btn-arcade-primary text-sm px-8 py-3"
                >
                  Press Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function EndScreen({
  meters,
  onReset,
}: {
  meters: GameState["meters"];
  onReset: () => void;
}) {
  const meterKeys: MeterKey[] = [
    "launch_velocity",
    "risk_containment",
    "team_sanity",
    "exec_confidence",
  ];
  const meterColors = [
    "var(--neon-orange)",
    "var(--neon-red)",
    "var(--neon-lime)",
    "var(--neon-cyan)",
  ];
  return (
    <main className="h-screen overflow-hidden flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <MuteToggle />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="arcade-panel-success p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-center space-y-4 animate-bounce-in">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-[var(--neon-lime)]">
            LAUNCH COMPLETE
          </h1>
          <p className="text-xs sm:text-sm text-[var(--arcade-ink-dim)]">Final meter states</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {meterKeys.map((k, i) => (
              <div
                key={k}
                className="p-4 rounded-lg border-[2px] flex flex-col items-center gap-1 bg-[var(--arcade-surface)]"
                style={{ borderColor: meterColors[i] }}
              >
                <span className="text-xl" aria-hidden>{METER_EMOJI[k]}</span>
                <span className="text-xs sm:text-sm text-[var(--arcade-ink-dim)] text-center">{METER_LABELS[k]}</span>
                <span className="text-2xl font-bold" style={{ color: meterColors[i] }}>{meters[k]}</span>
              </div>
            ))}
          </div>
          <button type="button" onClick={onReset} className="btn-arcade btn-arcade-primary text-sm px-8 py-3 mt-4">
            Reset Game
          </button>
        </div>
      </div>
    </main>
  );
}

function GameScreen({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: (a: import("@/lib/game-state").GameAction) => void;
}) {
  const { playSfx } = useAudio();
  const wheelPhase = state.phase === "idle" || state.phase === "slice_selected";
  const scenarioPhase =
    state.phase === "scenario_revealed" ||
    state.phase === "choice_locked" ||
    state.phase === "drop_active" ||
    state.phase === "choice_relocked";
  const outcomePhase =
    state.phase === "outcome_revealed" ||
    state.phase === "catastrophe_check" ||
    state.phase === "advancing";

  const handleSpinComplete = useCallback(() => {
    playSfx("wheel_stop");
    dispatch({ type: "REVEAL_SCENARIO" });
    playSfx("scenario_reveal");
  }, [dispatch, playSfx]);

  const handleSubmit = useCallback(() => {
    if (!state.selectedChoice || !canSubmit(state)) return;
    playSfx("submit");
    dispatch({ type: "LOCK_CHOICE", choiceId: state.selectedChoice });
    dispatch({ type: "REVEAL_OUTCOME" });
  }, [state, dispatch, playSfx]);

  const handleSpin = useCallback(() => {
    if (!canSpinWheel(state)) return;
    playSfx("spin");
    dispatch({ type: "SPIN_WHEEL" });
  }, [state, dispatch, playSfx]);

  const handleSelectChoice = useCallback(
    (id: import("@/data/content").ChoiceId) => {
      playSfx("choice_select");
      dispatch({ type: "SELECT_CHOICE", choiceId: id });
    },
    [dispatch, playSfx]
  );

  const handleSelectAndSubmit = useCallback(
    (id: import("@/data/content").ChoiceId) => {
      playSfx("choice_select");
      dispatch({ type: "LOCK_CHOICE", choiceId: id });
      dispatch({ type: "REVEAL_OUTCOME" });
    },
    [dispatch, playSfx]
  );

  const handleAdvance = useCallback(() => {
    playSfx("advance");
    dispatch({ type: "ADVANCE_ROUND" });
  }, [dispatch, playSfx]);

  const dropPlayedRef = useRef(false);
  useEffect(() => {
    if (state.codeDropActive && !dropPlayedRef.current) {
      dropPlayedRef.current = true;
      playSfx("slide_drop");
    }
    if (!state.codeDropActive) dropPlayedRef.current = false;
  }, [state.codeDropActive, playSfx]);

  const catastrophePlayedRef = useRef(false);
  useEffect(() => {
    if (state.phase === "catastrophe_check" && state.catastropheActive && !catastrophePlayedRef.current) {
      catastrophePlayedRef.current = true;
      playSfx("catastrophe");
    }
    if (state.phase !== "catastrophe_check") catastrophePlayedRef.current = false;
  }, [state.phase, state.catastropheActive, playSfx]);

  const outcomePlayedRef = useRef(false);
  useEffect(() => {
    if (outcomePhase && state.outcomeRevealed && !outcomePlayedRef.current) {
      outcomePlayedRef.current = true;
      playSfx("outcome_reveal");
    }
    if (!outcomePhase) outcomePlayedRef.current = false;
  }, [outcomePhase, state.outcomeRevealed, playSfx]);

  return (
    <div className="h-screen overflow-hidden flex flex-col text-[var(--arcade-ink)]">
      <GameHeader state={state} onEndGame={() => dispatch({ type: "END_GAME" })} />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative px-4 sm:px-6 pb-4">
        {wheelPhase && (
          <div className="flex flex-col items-center justify-center flex-1 min-h-0 overflow-hidden py-4">
            <Wheel
              selectedSlice={state.selectedSlice}
              variant="hero"
              onSpinComplete={handleSpinComplete}
              onSpin={handleSpin}
              canSpin={canSpinWheel(state)}
            />
          </div>
        )}
        {scenarioPhase && state.activeScenario && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
          <ScenarioScene
            scenario={state.activeScenario}
            selectedChoice={state.selectedChoice}
            lockedChoice={state.lockedChoice}
            timerSeconds={state.timerSeconds}
            onSubmit={handleSubmit}
            onSelectChoice={handleSelectChoice}
            canSubmit={canSubmit(state)}
          />
          </div>
        )}
        {outcomePhase && state.outcomeRevealed && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden w-full">
          <OutcomeScene
            state={state}
            onAdvance={handleAdvance}
            canAdvance={canAdvanceRound(state)}
          />
          </div>
        )}

        {state.codeDropActive && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <CodeDropOverlay
              drop={state.activeDrop}
              scenario={state.activeScenario}
              onSelectAndSubmit={handleSelectAndSubmit}
            />
          </div>
        )}
        {state.phase === "catastrophe_check" && state.catastropheActive && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <CatastropheCard
              catastrophe={state.activeCatastrophe}
              zeroedMeter={state.zeroedMeter}
              onDismiss={() => dispatch({ type: "DISMISS_CATASTROPHE" })}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [state, dispatch] = useReducer(gameReducer, initialGameState());
  const [showInstructions, setShowInstructions] = useState(false);
  const splashBgmStarted = useRef(false);
  const { playSfx, playBgm } = useAudio();

  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(GATE_STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (!isTimerCountingDown(state)) return;
    const id = setInterval(() => dispatch({ type: "TIMER_TICK" }), 1000);
    return () => clearInterval(id);
  }, [state.phase, state.timerSeconds]);

  useEffect(() => {
    if (state.screen === "splash") {
      splashBgmStarted.current = false;
    } else {
      playBgm("game");
    }
  }, [state.screen, playBgm]);

  const handleSplashFirstInteraction = useCallback(() => {
    if (splashBgmStarted.current) return;
    splashBgmStarted.current = true;
    playBgm("splash");
  }, [playBgm]);

  const handleStart = useCallback(() => {
    playSfx("start_press");
    dispatch({ type: "START_GAME" });
  }, [playSfx]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  if (state.screen === "splash") {
    return (
      <SplashScreen
        onStart={handleStart}
        onHowToPlayClick={setShowInstructions}
        showInstructions={showInstructions}
        onFirstInteraction={handleSplashFirstInteraction}
      />
    );
  }

  if (state.screen === "end") {
    return (
      <EndScreen
        meters={state.meters}
        onReset={() => dispatch({ type: "RESET_GAME" })}
      />
    );
  }

  return <GameScreen state={state} dispatch={dispatch} />;
}
