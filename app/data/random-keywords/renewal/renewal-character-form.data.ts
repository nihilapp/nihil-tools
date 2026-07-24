import type { RenewalKeywordThemeData } from '~/data/random-keywords/renewal/renewal-keyword.types';

export const renewalCharacterFormData = {
  'id': 'character-form',
  'label': '캐릭터 형태',
  'sourcePoolIds': [
    'character-traits',
  ],
  'sourceKeywordCount': 2,
  'formKeywords': [
    '캐릭터특징/형태/육각형',
    '캐릭터특징/형태/삼각형',
  ],
} satisfies RenewalKeywordThemeData;
