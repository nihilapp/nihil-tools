# Session Roll Table Reason Candidates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace sentence-fragment reason data with source-grounded 1–2 reason candidates for all 97 session-roll-table request types.

**Architecture:** League notices receive a shared candidate pool keyed by `noticeGroup` and a specific pool on each `noticeType`; the accessor merges and deduplicates them. Civilian notices own a 30-or-more-item pool directly. The component selects one or two distinct items only after a complete candidate pool is obtained.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vitest.

## Global Constraints

- Derive league candidate semantics from `references/세션 롤 테이블 참고자료/자유 탐사 연맹 공고 유형.md`.
- Use `references/세션 롤 테이블 참고자료/tables/league-notice-token-mapping.tsv` only to validate the 85 notice group/type/role/security records; do not reuse its legacy token sets.
- Use one word through short two- or three-word Korean expressions; do not mechanically split prose.
- Every merged league pool and every civilian pool must contain at least 30 distinct candidates.
- Allow semantic overlap between different notices; never display a duplicate candidate in one generated result.
- Keep app imports under `~/` and name interaction functions as `on<Action><Target>`.

---

### Task 1: Define candidate data contracts and shared group pools

**Files:**
- Create: `app/data/session-roll-table.reason-candidates.data.ts`
- Modify: `app/data/session-roll-table.types.ts`
- Modify: `app/data/session-roll-table.data.ts`
- Test: `test/session-roll-table.data.test.ts`

**Interfaces:**
- Produces `leagueNoticeReasonCandidatesByGroup: Record<string, string[]>` and `getLeagueNoticeReasonCandidates(notice: LeagueNoticeData): string[]`.
- Changes `LeagueNoticeData.reasonTokenSets` and `CivilianNoticeData.reasonTokenSets` to `reasonCandidates: string[]`.

- [x] **Step 1: Write failing pool-contract tests**

```ts
expect(getLeagueNoticeReasonCandidates(getLeagueNoticeDataByTab('all')[0]!)).toEqual(expect.arrayContaining([
  '인명 구조',
  '생존자 확인',
]));
expect(getLeagueNoticeReasonCandidates(notice)).toHaveLength(expect.any(Number));
expect(new Set(getLeagueNoticeReasonCandidates(notice)).size).toBe(getLeagueNoticeReasonCandidates(notice).length);
```

- [x] **Step 2: Run `pnpm vitest run test/session-roll-table.data.test.ts` and verify the new contract fails.**

- [x] **Step 3: Add all 17 source-grounded group pools with at least 20 candidates each.**

```ts
export const leagueNoticeReasonCandidatesByGroup: Record<string, string[]> = {
  '민생·구조': ['인명 구조', '생존자 확인', '피해 조사'],
  // 16 remaining groups
};

export function getLeagueNoticeReasonCandidates(notice: LeagueNoticeData): string[] {
  return [...new Set([
    ...(leagueNoticeReasonCandidatesByGroup[notice.noticeGroup] ?? []),
    ...notice.reasonCandidates,
  ])];
}
```

- [x] **Step 4: Run the focused data test and verify it passes.**

### Task 2: Replace the 85 league and 12 civilian candidate arrays

**Files:**
- Modify: `app/data/session-roll-table.league-01.data.ts` through `app/data/session-roll-table.league-08.data.ts`
- Modify: `app/data/session-roll-table.civilian.data.ts`
- Test: `test/session-roll-table.data.test.ts`

**Interfaces:**
- Consumes `reasonCandidates: string[]` from the revised types.
- Produces source-grounded specific candidate pools: 12 or more candidates per league type and 30 or more per civilian type.

- [x] **Step 1: Add failing coverage for all pools.**

```ts
for (const notice of getLeagueNoticeDataByTab('all')) {
  expect(getLeagueNoticeReasonCandidates(notice).length).toBeGreaterThanOrEqual(30);
}
for (const notice of sessionRollTableData.civilianNotices) {
  expect(new Set(notice.reasonCandidates).size).toBeGreaterThanOrEqual(30);
}
```

- [x] **Step 2: Run the focused data test and verify it fails because the old field is still present.**

- [x] **Step 3: Replace every `reasonTokenSets` field.**

Each array must contain purpose-oriented candidates (for example, `알파 개체 추적` includes `우두머리 흔적`, `무리 지휘`, `영역 이동`, `행동 변화`; `토템 가디언 레이드` includes `토템 수호`, `약점 관측`, `핵 회수`, `못 파괴`). Use the reference document’s stated objective for every league type; use the TSV only to validate that all 85 current group/type records remain covered.

- [x] **Step 4: Run the focused data test and verify every one of 97 pools meets its minimum.**

### Task 3: Generate one or two displayed reasons

**Files:**
- Modify: `app/components/sessionRollTable/SessionRollTable.vue`
- Modify: `test/session-roll-table.test.ts`

**Interfaces:**
- Consumes `getLeagueNoticeReasonCandidates(notice)` and `notice.reasonCandidates`.
- Produces `GeneratedSession.reasonTokens: string[]` with one or two unique strings.

- [x] **Step 1: Add deterministic tests by mocking `Math.random`.**

```ts
expect(reasonTokens).toHaveLength(1);
expect(reasonTokens).toHaveLength(2);
expect(new Set(reasonTokens).size).toBe(reasonTokens.length);
```

- [x] **Step 2: Run `pnpm vitest run test/session-roll-table.test.ts` and verify the assertions fail.**

- [x] **Step 3: Add `selectRandomItems<T>(items: T[], count: number): T[]` and choose `1 + Math.floor(Math.random() * 2)` candidates.**

```ts
function selectRandomItems<T>(items: T[], count: number): T[] {
  const candidates = [...items];
  const selected: T[] = [];
  while (selected.length < count && candidates.length > 0) {
    selected.push(candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0]!);
  }
  return selected;
}
```

- [x] **Step 4: Run the focused component test and verify it passes.**

### Task 4: Remove obsolete inventory and verify the complete change

**Files:**
- Delete: `docs/session-roll-table-reasons.md`
- Test: `test/session-roll-table.data.test.ts`, `test/session-roll-table.test.ts`, `test/session-roll-table-page.test.ts`

- [x] **Step 1: Delete the raw-token inventory because it describes the replaced model.**
- [x] **Step 2: Run `pnpm vitest run test/session-roll-table.data.test.ts test/session-roll-table.test.ts test/session-roll-table-page.test.ts`.**
- [x] **Step 3: Run `pnpm exec vue-tsc --build --noEmit` and verify that the former `reasonTokenSets` errors are absent.**
- [x] **Step 4: Commit with `2026 0711 기능: 세션 롤 테이블 사유 후보 재설계`.**
