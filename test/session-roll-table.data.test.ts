import { describe, expect, it } from 'vitest';

import { getLeagueNoticeReasonCandidates, getLeagueRequesterCandidates, getLeagueNoticeDataByTab,
  sessionRollTableData } from '~/data/session-roll-table.data';

describe('sessionRollTableData', () => {
  it('keeps the complete league notice pool in the all tab', () => {
    const notices = getLeagueNoticeDataByTab('all');

    expect(notices).toHaveLength(85);
    expect(notices.filter(notice => notice.securityLevel === '기밀')).toHaveLength(5);
  });

  it('keeps resolver and hunter notices together without pioneer notices', () => {
    const notices = getLeagueNoticeDataByTab('resolver-hunter');

    expect(notices).toHaveLength(75);
    expect(notices.every(notice => notice.adventurerRole === '해결사' || notice.adventurerRole === '사냥꾼')).toBe(true);
  });

  it('limits the pioneer tab to official Angra exploration notices', () => {
    const notices = getLeagueNoticeDataByTab('pioneer');

    expect(notices).toHaveLength(5);
    expect(notices.every(notice => notice.adventurerRole === '개척자' && notice.noticeGroup === '앙그라권 탐사')).toBe(true);
  });

  it('keeps civilian requests and independent session environment pools', () => {
    expect(sessionRollTableData.civilianNotices).toHaveLength(12);
    expect(sessionRollTableData.themes).toHaveLength(102);
    expect(sessionRollTableData.terrains).toHaveLength(240);
    expect(sessionRollTableData.monsterTypes).toHaveLength(14);
  });

  it('resolves league requester category keys to Korean requester names', () => {
    expect(getLeagueRequesterCandidates([
      'explorer_record',
    ])).toContain('탐사대장');
    expect(getLeagueRequesterCandidates([
      'explorer_record',
    ])).not.toContain('explorer_record');
  });

  it('merges the group and notice reason candidates without duplicates', () => {
    const notice = getLeagueNoticeDataByTab('all').find(item => item.noticeType === '구조·구호')!;
    const candidates = getLeagueNoticeReasonCandidates(notice);

    expect(candidates).toContain('인명 구조');
    expect(candidates).toContain('생존자 확인');
    expect(candidates.length).toBeGreaterThanOrEqual(30);
    expect(new Set(candidates).size).toBe(candidates.length);
  });

  it('provides at least thirty distinct reason candidates for every notice', () => {
    for (const notice of getLeagueNoticeDataByTab('all')) {
      const candidates = getLeagueNoticeReasonCandidates(notice);

      expect('reasonCandidates' in notice).toBe(true);
      expect('reasonTokenSets' in notice).toBe(false);
      expect(candidates.length).toBeGreaterThanOrEqual(30);
      expect(new Set(candidates).size).toBe(candidates.length);
    }

    for (const notice of sessionRollTableData.civilianNotices) {
      expect('reasonCandidates' in notice).toBe(true);
      expect('reasonTokenSets' in notice).toBe(false);
      expect(notice.reasonCandidates).toHaveLength(30);
      expect(new Set(notice.reasonCandidates).size).toBe(notice.reasonCandidates.length);
    }
  });
});
