# Random Keyword Generator UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 일반 키워드와 캐릭터 배경 스토리를 서로 다른 화면에서 생성한다.

**Architecture:** UI용 대분류 설정은 리뉴얼 테마 ID를 참조하고, 순수 선택 유틸리티가 데이터 평탄화와 추첨을 담당한다. 두 Vue 렌더링 컴포넌트는 선택 유틸리티만 사용하며 서로 상태를 공유하지 않는다.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, TypeScript, Vitest, Tailwind CSS, class-variance-authority.

## Global Constraints

- 페이지는 렌더링 컴포넌트만 조립한다.
- 앱 소스 import는 `~/` 별칭을 사용한다.
- 상호작용 함수는 `on<액션><대상>` 형식으로 작성한다.
- 일반 생성기는 `1`, `5`, `10`만 지원하며 기본값은 `1`이다.
- 배경 스토리 생성기는 항상 결과 하나만 생성한다.
- 유효 키워드를 제거하거나 배경 스토리 데이터를 일반 전체 추첨에 포함하지 않는다.

---

### Task 1: 일반 키워드 UI 카테고리와 선택기

**Files:**

- Create: `app/data/random-keywords/random-keyword-ui-categories.data.ts`
- Create: `app/types/random-keyword-generator.ts`
- Create: `app/utils/random-keyword-generator.ts`
- Create: `test/random-keyword-generator.test.ts`

**Interfaces:**

```ts
export type RandomKeywordGenerationCount = 1 | 5 | 10;

export interface RandomKeywordResult {
  categoryId: string;
  categoryLabel: string;
  themeId: string;
  themeLabel: string;
  keyword: string;
}

export function generateRandomKeywords(
  categoryId: string,
  count: RandomKeywordGenerationCount,
  random?: () => number,
): RandomKeywordResult[];
```

- [ ] **Step 1: 선택기 실패 테스트 작성**

```ts
it('전체에서 대분류를 먼저 골라 균형 있게 결과를 만든다', () => {
  const results = generateRandomKeywords('all', 1, () => 0);

  expect(results).toHaveLength(1);
  expect(results[0]?.categoryId).toBe('nature-environment');
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm vitest run test/random-keyword-generator.test.ts`

Expected: `Failed to resolve import` 또는 `generateRandomKeywords is not a function`.

- [ ] **Step 3: UI 카테고리와 선택기 구현**

`all`은 여덟 대분류 ID를 균등 선택한다. 개별 대분류는 연결된 테마 전체를 평탄화해 추첨한다. 각 결과에는 대분류와 세부 테마 레이블을 유지하고, 동일한 `themeId + keyword`는 같은 배치에서 제외한다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm vitest run test/random-keyword-generator.test.ts`

Expected: PASS.

### Task 2: 배경 스토리 문장 선택기

**Files:**

- Create: `app/types/character-background-story-generator.ts`
- Create: `app/utils/character-background-story-generator.ts`
- Create: `test/character-background-story-generator.test.ts`

**Interfaces:**

```ts
export type CharacterBackgroundStoryMode = 'common' | 'real-world' | 'fantasy';

export interface CharacterBackgroundStoryResult {
  mode: CharacterBackgroundStoryMode;
  purpose: string;
  origin: string;
  person: string;
  sentence: string;
}

export function generateCharacterBackgroundStory(
  mode: CharacterBackgroundStoryMode,
  random?: () => number,
): CharacterBackgroundStoryResult;
```

- [ ] **Step 1: 문장 형식 실패 테스트 작성**

```ts
it('현실 배경 스토리를 고정 형식의 한 문장으로 만든다', () => {
  const result = generateCharacterBackgroundStory('real-world', () => 0);

  expect(result.sentence).toBe(`${result.purpose}를 위해 ${result.origin}에서 온 ${result.person}`);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm vitest run test/character-background-story-generator.test.ts`

Expected: `Failed to resolve import` 또는 `generateCharacterBackgroundStory is not a function`.

- [ ] **Step 3: 모드별 조합 구현**

현실은 현실 목적·출신지·직업, 판타지는 판타지 목적·출신지 수식·장소·종족 및 직업을 선택한다. 공용은 현실·판타지 후보를 모두 사용한다. 판타지 인물은 `종족 직업`으로 만들고 다른 모드는 직업을 사용한다.

- [ ] **Step 4: 테스트 통과 확인**

Run: `pnpm vitest run test/character-background-story-generator.test.ts`

Expected: PASS.

### Task 3: 일반 키워드 생성 화면

**Files:**

- Create: `app/components/randomKeywordGenerator/RandomKeywordGenerator.vue`
- Create: `app/pages/apps/random-keyword-generator.vue`

- [ ] **Step 1: 컴포넌트 계약 실패 테스트 작성**

```ts
it('1개, 5개, 10개 버튼 값을 생성기에 전달한다', () => {
  expect([1, 5, 10]).toContain(5);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm vitest run test/random-keyword-generator.test.ts`

Expected: 화면용 수량 상태가 없으므로 실패.

- [ ] **Step 3: 렌더링 컴포넌트 구현**

상단에는 대분류 버튼, 아래에는 선택한 대분류의 세부 테마 필터를 둔다. `UiButton`으로 수량과 생성 버튼을 만들고, 결과 목록에는 `대분류 · 세부 테마`과 키워드를 표시한다. 페이지는 이 컴포넌트만 import한다.

- [ ] **Step 4: 동작 확인**

Run: `pnpm vitest run test/random-keyword-generator.test.ts && pnpm build`

Expected: PASS 및 build exit code 0.

### Task 4: 캐릭터 배경 스토리 화면

**Files:**

- Create: `app/components/characterBackgroundStoryGenerator/CharacterBackgroundStoryGenerator.vue`
- Create: `app/pages/apps/random-keyword-generator/background-story.vue`

- [ ] **Step 1: 단일 결과 실패 테스트 작성**

```ts
it('배경 스토리는 항상 하나의 결과만 반환한다', () => {
  const result = generateCharacterBackgroundStory('fantasy', () => 0);

  expect(Array.isArray(result)).toBe(false);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm vitest run test/character-background-story-generator.test.ts`

Expected: 구현 전에는 import 또는 함수 실패.

- [ ] **Step 3: 렌더링 컴포넌트 구현**

`공용`, `현실`, `판타지` 모드 버튼과 `배경 생성` 버튼 하나만 제공한다. 생성 결과는 문장 하나와 목적·출신지·인물 재료의 작은 보조 표기로 구성하며 수량 버튼과 일반 키워드 필터는 포함하지 않는다.

- [ ] **Step 4: 동작 확인**

Run: `pnpm vitest run test/character-background-story-generator.test.ts && pnpm build`

Expected: PASS 및 build exit code 0.

### Task 5: 앱 목록 등록과 최종 검증

**Files:**

- Modify: `app/data/app-list.data.ts`
- Test: `test/random-keyword-generator.test.ts`
- Test: `test/character-background-story-generator.test.ts`

- [ ] **Step 1: 앱 등록 실패 테스트 작성**

```ts
it('랜덤 키워드 생성기 앱을 등록한다', () => {
  expect(appListData.some((app) => app.url === '/random-keyword-generator')).toBe(true);
});
```

- [ ] **Step 2: 실패 확인**

Run: `pnpm vitest run test/random-keyword-generator.test.ts`

Expected: 등록 전에는 false.

- [ ] **Step 3: 앱 목록 등록**

`/random-keyword-generator` 항목에 이름, 짧은 설명, 아이콘을 추가한다. 일반 생성기 화면에서 배경 스토리 화면으로 이동하는 링크도 제공한다.

- [ ] **Step 4: 최종 검증**

Run: `pnpm vitest run test/random-keyword-generator.test.ts test/character-background-story-generator.test.ts test/random-keywords-data.test.ts test/random-keywords-renewal-background-story.test.ts test/random-keywords-renewal-catalog.test.ts test/random-keywords-renewal-character-profile.test.ts test/random-keywords-renewal-modifiers.test.ts test/random-keywords-renewal-final-migration.test.ts`

Run: `pnpm exec eslint app/data/random-keywords app/components/randomKeywordGenerator app/components/characterBackgroundStoryGenerator app/data/app-list.data.ts app/types/random-keyword-generator.ts app/types/character-background-story-generator.ts app/utils/random-keyword-generator.ts app/utils/character-background-story-generator.ts test/random-keyword-generator.test.ts test/character-background-story-generator.test.ts`

Run: `pnpm build`

Expected: 모든 테스트 및 린트 통과, build exit code 0.
