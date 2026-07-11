import type { DiceExpressionResult } from '@nihilapp/diceroll-v3';

import type { DiceRollHistoryItem, DiceRollPreset } from '~/data/dice-roller.types';

export function buildPresetDiceExpression(preset: DiceRollPreset, count: number): string {
  return preset.supportsCount
    ? `${count}${preset.expression}`
    : preset.expression;
}

export function createDiceRollHistoryItem(expression: string, results: DiceExpressionResult[]): DiceRollHistoryItem {
  return {
    expression,
    id: crypto.randomUUID(),
    results,
  };
}
