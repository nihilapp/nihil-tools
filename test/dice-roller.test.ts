import type { DiceExpressionResult } from '@nihilapp/diceroll-v3';
import { describe, expect, it } from 'vitest';

import { diceRollPresetData } from '~/data/dice-roller-presets.data';
import { buildPresetDiceExpression, createDiceRollHistoryItem } from '~/utils/dice-roller';

describe('buildPresetDiceExpression', () => {
  it('combines a standard preset with the selected count', () => {
    const d6Preset = diceRollPresetData.find((preset) => preset.id === 'd6')!;

    expect(buildPresetDiceExpression(d6Preset, 3)).toBe('3d6');
  });

  it('keeps percentile rolls at one expression regardless of count', () => {
    const percentilePreset = diceRollPresetData.find((preset) => preset.id === 'percentile')!;

    expect(buildPresetDiceExpression(percentilePreset, 8)).toBe('d%');
  });
});

describe('createDiceRollHistoryItem', () => {
  it('keeps multiple expression results in one history item', () => {
    const results = [
      {
        expression: 'D20',
        modifiers: [
        ],
        rollDetails: [
        ],
        total: 12,
      },
    ] as DiceExpressionResult[];

    const historyItem = createDiceRollHistoryItem('d20', results);

    expect(historyItem.expression).toBe('d20');
    expect(historyItem.results).toBe(results);
    expect(historyItem.id).toEqual(expect.any(String));
  });
});
