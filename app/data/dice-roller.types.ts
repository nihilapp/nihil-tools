import type { DiceExpressionResult } from '@nihilapp/diceroll-v3';

export interface DiceRollPreset {
  expression: string
  id: string
  label: string
  supportsCount: boolean
}

export interface DiceRollHistoryItem {
  expression: string
  id: string
  results: DiceExpressionResult[]
}
