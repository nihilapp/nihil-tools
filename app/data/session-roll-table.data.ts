import { civilianNoticeData } from '~/data/session-roll-table.civilian.data';
import { leagueNoticeDataPart01 } from '~/data/session-roll-table.league-01.data';
import { leagueNoticeDataPart02 } from '~/data/session-roll-table.league-02.data';
import { leagueNoticeDataPart03 } from '~/data/session-roll-table.league-03.data';
import { leagueNoticeDataPart04 } from '~/data/session-roll-table.league-04.data';
import { leagueNoticeDataPart05 } from '~/data/session-roll-table.league-05.data';
import { leagueNoticeDataPart06 } from '~/data/session-roll-table.league-06.data';
import { leagueNoticeDataPart07 } from '~/data/session-roll-table.league-07.data';
import { leagueNoticeDataPart08 } from '~/data/session-roll-table.league-08.data';
import { leagueRequesterData } from '~/data/session-roll-table.requesters.data';
import { getLeagueNoticeReasonCandidates } from '~/data/session-roll-table.reason-candidates.data';
import { monsterTypeData, terrainData, themeData } from '~/data/session-roll-table.environment.data';
import type { LeagueNoticeData, LeagueNoticeTabData, LeagueNoticeTabId } from '~/data/session-roll-table.types';

export const leagueNoticeTabData: LeagueNoticeTabData[] = [
  {
    id: 'all',
    label: '전체',
  },
  {
    id: 'resolver-hunter',
    label: '해결사·사냥꾼',
  },
  {
    id: 'pioneer',
    label: '개척자',
  },
];

const leagueNoticeData: LeagueNoticeData[] = [
  ...leagueNoticeDataPart01,
  ...leagueNoticeDataPart02,
  ...leagueNoticeDataPart03,
  ...leagueNoticeDataPart04,
  ...leagueNoticeDataPart05,
  ...leagueNoticeDataPart06,
  ...leagueNoticeDataPart07,
  ...leagueNoticeDataPart08,
];

export const sessionRollTableData = {
  civilianNotices: civilianNoticeData,
  leagueNotices: leagueNoticeData,
  monsterTypes: monsterTypeData,
  terrains: terrainData,
  themes: themeData,
};

export { getLeagueNoticeReasonCandidates };

export function getLeagueNoticeDataByTab(tabId: LeagueNoticeTabId): LeagueNoticeData[] {
  if (tabId === 'resolver-hunter') {
    return leagueNoticeData.filter(notice => notice.adventurerRole === '해결사' || notice.adventurerRole === '사냥꾼');
  }

  if (tabId === 'pioneer') {
    return leagueNoticeData.filter(notice => notice.adventurerRole === '개척자');
  }

  return leagueNoticeData;
}

export function getLeagueRequesterCandidates(requesterCategories: string[]): string[] {
  return requesterCategories.flatMap(requesterCategory => leagueRequesterData[requesterCategory] ?? [
  ]);
}
