import type { RenewalKeywordThemeData } from '~/data/random-keywords/renewal/renewal-keyword.types';

export const renewalCharacterVoiceData = {
  'id': 'character-voice',
  'label': '캐릭터 목소리',
  'sourcePoolIds': [
    'character-traits',
  ],
  'sourceKeywordCount': 8,
  'voiceKeywords': [
    '캐릭터특징/목소리/목소리가 맑은',
    '캐릭터특징/목소리/목소리가 거친',
    '캐릭터특징/목소리/목소리가 낮은',
    '캐릭터특징/목소리/목소리가 높은',
    '캐릭터특징/목소리/말더듬이가 있는',
    '캐릭터특징/목소리/발음이 정확한',
    '캐릭터특징/목소리/억양이 독특한',
    '캐릭터특징/목소리/이국적인 억양을 가진',
  ],
} satisfies RenewalKeywordThemeData;
