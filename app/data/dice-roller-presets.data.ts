import type { DiceRollPreset } from '~/data/dice-roller.types';

export const diceRollPresetData: DiceRollPreset[] = [
  {
    id: 'd2',
    label: 'D2',
    expression: 'd2',
    supportsCount: true,
  },
  {
    id: 'd4',
    label: 'D4',
    expression: 'd4',
    supportsCount: true,
  },
  {
    id: 'd6',
    label: 'D6',
    expression: 'd6',
    supportsCount: true,
  },
  {
    id: 'd8',
    label: 'D8',
    expression: 'd8',
    supportsCount: true,
  },
  {
    id: 'd10',
    label: 'D10',
    expression: 'd10',
    supportsCount: true,
  },
  {
    id: 'd12',
    label: 'D12',
    expression: 'd12',
    supportsCount: true,
  },
  {
    id: 'd20',
    label: 'D20',
    expression: 'd20',
    supportsCount: true,
  },
  {
    id: 'd100',
    label: 'D100',
    expression: 'd100',
    supportsCount: true,
  },
  {
    id: 'fate',
    label: 'DF',
    expression: 'dF',
    supportsCount: true,
  },
  {
    id: 'percentile',
    label: 'D%',
    expression: 'd%',
    supportsCount: false,
  },
];
