export type LeagueNoticeTabId = 'all' | 'resolver-hunter' | 'pioneer';

export type LeagueAdventurerRole = '해결사' | '사냥꾼' | '개척자';

export type NoticeSecurityLevel = '공개' | '제한' | '기밀';

export interface LeagueNoticeData {
  id: string;
  adventurerRole: LeagueAdventurerRole | null;
  securityLevel: NoticeSecurityLevel;
  noticeGroup: string;
  noticeType: string;
  requesterCategories: string[];
  reasonCandidates: string[];
  monsterTypes: string[];
}

export interface CivilianNoticeData {
  requestType: string;
  requesterCandidates: string[];
  reasonCandidates: string[];
  monsterTypes: string[];
}

export interface LeagueNoticeTabData {
  id: LeagueNoticeTabId;
  label: string;
}
