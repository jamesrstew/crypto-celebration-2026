/**
 * Launch Roulette – content data
 * Loads from content-v2.json and content-expansion.json; maps to app format.
 */

import v2 from "./content-v2.json";
import expansion from "./content-expansion.json";

export type MeterKey = "launch_velocity" | "risk_containment" | "team_sanity" | "exec_confidence";

export interface MeterDeltas {
  launch_velocity: number;
  risk_containment: number;
  team_sanity: number;
  exec_confidence: number;
}

export interface Outcome {
  headline: string;
  narrative: string;
  meter_deltas: MeterDeltas;
}

export type ChoiceId = "A" | "B" | "C" | "D";

export interface Choice {
  id: ChoiceId;
  label: string;
  outcome: Outcome;
}

export interface Scenario {
  id: string;
  title: string;
  context: string;
  prompt: string;
  choices: Choice[];
}

export interface Slice {
  id: string;
  sliceIndex: number;
  display_name: string;
  short_description: string;
  scenarios: Scenario[];
}

export interface CodeDrop {
  id: string;
  title: string;
  constraint_text: string;
  effect_instruction: string;
}

export type CatastropheEffectType =
  | "narrative_only"
  | "restrict_slices_6_9"
  | "hide_next_outcome_deltas";

export interface Catastrophe {
  id: string;
  title: string;
  trigger_condition: string;
  description: string;
  effect: string;
  effectType: CatastropheEffectType;
}

type V2 = typeof v2;

function md(s: { launch_velocity: number; risk_containment: number; team_sanity: number; exec_confidence: number }): MeterDeltas {
  return {
    launch_velocity: s.launch_velocity,
    risk_containment: s.risk_containment,
    team_sanity: s.team_sanity,
    exec_confidence: s.exec_confidence,
  };
}

function mapSlices(v: V2): Slice[] {
  return (v.wheelSlices as V2["wheelSlices"]).map((s, i) => ({
    id: s.id,
    sliceIndex: i + 1,
    display_name: s.displayName,
    short_description: s.description,
    scenarios: (s.scenarios as Array<{
      id: string;
      title: string;
      subtitle: string;
      body: string[];
      question: string;
      choices: Array<{
        id: string;
        label: string;
        outcome: { headline: string; narrative: string; meterDeltas: MeterDeltas };
      }>;
    }>).map((sc) => ({
      id: sc.id,
      title: sc.title,
      context: sc.subtitle,
      prompt: (sc.body.join("\n\n") + "\n\n" + sc.question).trim(),
      choices: sc.choices.map((c) => ({
        id: c.id as ChoiceId,
        label: c.label,
        outcome: {
          headline: c.outcome.headline,
          narrative: c.outcome.narrative,
          meter_deltas: md(c.outcome.meterDeltas),
        },
      })),
    })),
  }));
}

function mapDrops(v: V2): CodeDrop[] {
  return (v.slideDeckDrops as V2["slideDeckDrops"]).map((d) => ({
    id: d.id,
    title: d.title,
    constraint_text: d.constraintText,
    effect_instruction: d.effectInstruction,
  }));
}

function mapCatastrophes(v: V2): Catastrophe[] {
  return (v.catastrophes as V2["catastrophes"]).map((c) => ({
    id: c.id,
    title: c.title.replace(/^Catastrophe:\s*/i, ""),
    trigger_condition: c.triggerCondition,
    description: c.description,
    effect: (c.effect as { ruleText?: string }).ruleText ?? "",
    effectType: "narrative_only" as CatastropheEffectType,
  }));
}

type ExpansionScenario = {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
  question: string;
  choices: Array<{
    id: string;
    label: string;
    outcome: { headline: string; narrative: string; meterDeltas: MeterDeltas };
  }>;
};

function mapExpansionScenarios(exp: { scenarios: ExpansionScenario[] }): Scenario[] {
  return exp.scenarios.map((sc) => ({
    id: sc.id,
    title: sc.title,
    context: sc.subtitle,
    prompt: (sc.body.join("\n\n") + "\n\n" + sc.question).trim(),
    choices: sc.choices.map((c) => ({
      id: c.id as ChoiceId,
      label: c.label,
      outcome: {
        headline: c.outcome.headline,
        narrative: c.outcome.narrative,
        meter_deltas: md(c.outcome.meterDeltas),
      },
    })),
  }));
}

const SLICES = mapSlices(v2);
const CODE_DROPS = mapDrops(v2);
const CATASTROPHES = mapCatastrophes(v2);
const EXPANSION_SCENARIOS = mapExpansionScenarios(expansion as { scenarios: ExpansionScenario[] });

export function getSlices(): Slice[] {
  return SLICES;
}

export function getExpansionScenarios(): Scenario[] {
  return EXPANSION_SCENARIOS;
}

export function getCodeDrops(): CodeDrop[] {
  return CODE_DROPS;
}

export function getCatastrophes(): Catastrophe[] {
  return CATASTROPHES;
}

export const DEFAULT_METER = (v2.config as V2["config"]).startingMeters.launch_velocity;
export const METER_MIN = (v2.config as V2["config"]).meterMin;
export const METER_MAX = (v2.config as V2["config"]).meterMax;

export const METER_LABELS: Record<MeterKey, string> = {
  launch_velocity: "Launch Velocity",
  risk_containment: "Risk Containment",
  team_sanity: "Team Sanity",
  exec_confidence: "Exec Confidence",
};

export const METER_EMOJI: Record<MeterKey, string> = {
  launch_velocity: "🚀",
  risk_containment: "🧯",
  team_sanity: "🧠",
  exec_confidence: "📈",
};
