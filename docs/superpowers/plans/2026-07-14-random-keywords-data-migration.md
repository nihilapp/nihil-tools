# 랜덤 키워드 데이터 이관 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 랜덤 키워드 JSON을 중복 제거와 인코딩 감사 기록을 적용한 40개 TypeScript 데이터 풀로 이관한다.

**Architecture:** 개별 풀은 `app/data/random-keywords/`에서 독립적으로 export한다. 통합 카탈로그가 이를 조회 가능하게 모으고, 감사 데이터는 제외된 손상 문자열 및 풀 내부 중복 제거 통계를 별도로 보존한다.

**Tech Stack:** Nuxt 4, TypeScript, Vitest

## Global Constraints

- 정적 앱 데이터는 `app/data`에 둔다.
- 파일명은 `<name>.data.ts` 형식을 사용한다.
- 원본의 슬래시 경로형 문자열은 값 변경 없이 보존한다.
- 중복은 같은 원본 풀 안에서만 제거한다.
- `�` 문자가 포함된 값은 키워드 풀에서 제외하고 감사 기록에 남긴다.

---

### Task 1: 카탈로그 계약 검증

**Files:**
- Create: `test/random-keywords-data.test.ts`
- Create: `app/data/random-keywords/random-keyword.types.ts`
- Create: `app/data/random-keywords/random-keywords-catalog.data.ts`
- Create: `app/data/random-keywords/random-keywords-audit.data.ts`

**Interfaces:**
- Produces: `randomKeywordsCatalogData`, `randomKeywordsAuditData`
- Produces: `RandomKeywordPoolData`, `RandomKeywordArea`

- [ ] **Step 1: Write the failing test**

```ts
expect(randomKeywordsCatalogData).toHaveLength(40);
expect(new Set(randomKeywordsCatalogData.map((pool) => pool.id)).size).toBe(40);
expect(randomKeywordsAuditData.invalidEncodingEntries.length).toBeGreaterThan(0);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run test/random-keywords-data.test.ts`

- [ ] **Step 3: Add the public types, catalog, and audit exports**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run test/random-keywords-data.test.ts`

### Task 2: 풀 단위 데이터 생성

**Files:**
- Create: `app/data/random-keywords/*.data.ts` (원본 40개 풀)
- Modify: `app/data/random-keywords/random-keywords-catalog.data.ts`
- Modify: `app/data/random-keywords/random-keywords-audit.data.ts`

**Interfaces:**
- Consumes: `RandomKeywordPoolData`
- Produces: 40개의 풀별 데이터 export와 완전한 카탈로그

- [ ] **Step 1: 원본 JSON을 풀별 데이터 모듈로 기계 이관한다**

각 모듈은 아래 형태를 따른다.

```ts
export const randomKeywordsMiscWeatherData = {
  id: 'misc-weather',
  area: 'misc',
  label: '날씨',
  isHierarchical: true,
  keywords: ['날씨/강수/비'] as const,
} satisfies RandomKeywordPoolData;
```

- [ ] **Step 2: 같은 풀의 중복을 제거하고 손상 문자열을 감사 데이터에 기록한다**

- [ ] **Step 3: 카탈로그가 40개 풀을 모두 import하도록 완성한다**

- [ ] **Step 4: 집중 테스트를 실행한다**

Run: `pnpm vitest run test/random-keywords-data.test.ts`

### Task 3: 이관 완전성 검증

**Files:**
- Modify: `test/random-keywords-data.test.ts`

- [ ] **Step 1: 원본 풀별 유효 항목 수, 중복 제거, 깨진 문자 제외를 검증하는 테스트를 추가한다**

```ts
for (const pool of randomKeywordsCatalogData) {
  expect(new Set(pool.keywords).size).toBe(pool.keywords.length);
  expect(pool.keywords.some((keyword) => keyword.includes('�'))).toBe(false);
}
```

- [ ] **Step 2: 전체 테스트와 타입 검사를 실행한다**

Run: `pnpm vitest run test/random-keywords-data.test.ts && pnpm lint && pnpm build`
