export type CharacterBackgroundStoryMode = 'common' | 'real-world' | 'fantasy';

export interface CharacterBackgroundStoryResult {
  mode: CharacterBackgroundStoryMode;
  purpose: string;
  origin: string;
  person: string;
  sentence: string;
}
