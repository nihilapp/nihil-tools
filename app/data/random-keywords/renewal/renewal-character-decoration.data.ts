import type { RenewalKeywordThemeData } from '~/data/random-keywords/renewal/renewal-keyword.types';

export const renewalCharacterDecorationData = {
  'id': 'character-decoration',
  'label': '캐릭터 장식',
  'sourcePoolIds': [
    'character-traits',
  ],
  'sourceKeywordCount': 8,
  'decorationKeywords': [
    '캐릭터특징/장식/자수',
    '캐릭터특징/장식/프릴',
    '캐릭터특징/장식/리본',
    '캐릭터특징/장식/휘장',
    '캐릭터특징/장식/레이스',
    '캐릭터특징/장식/패턴',
    '캐릭터특징/장식/고리',
    '캐릭터특징/장식/추',
  ],
} satisfies RenewalKeywordThemeData;
