import type { LeagueNoticeData } from '~/data/session-roll-table.types';
import { createReasonCandidates } from '~/data/session-roll-table.reason-candidates.data';

export const leagueNoticeDataPart08: LeagueNoticeData[] = [
  {
    'id':  'league-085',
    'adventurerRole':  '사냥꾼',
    'securityLevel':  '공개',
    'noticeGroup':  '앙그라권 레이드·사냥',
    'noticeType':  '토템 가디언 레이드',
    'requesterCategories':  [
      'league_admin',
      'explorer_record',
      'dungeon_containment',
      'arcane_research',
    ],
    'reasonCandidates':  createReasonCandidates('토템 가디언 레이드'),
    'monsterTypes':  [
      '구조체',
      '괴수',
      '변이체',
    ],
  },
];
