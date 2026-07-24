# 사이트 메타데이터 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 니힐의 도구상자 모든 페이지에 고유한 검색·공유 메타데이터를 제공한다.

**Architecture:** `app/config/app.config.ts`가 사이트명, 운영 URL, 공통 설명·키워드·커버 이미지의 단일 원본이 된다. 모든 페이지는 `useSetMeta()`를 호출하고, 동적 앱 페이지는 현재 앱 목록 항목에서 제목·설명·경로를 계산한다.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vitest, `useHead`

## Global Constraints

- 사이트명은 `니힐의 도구상자`다.
- 기준 URL은 `https://nihil-tools.nihilncunia.com`이다.
- 기본 커버는 `/images/nihil-web-logo.png`다.
- 모든 `app/pages/**/*.vue`는 `useSetMeta`를 호출한다.
- `/dev/style`은 `noindex, nofollow`다.
- 앱 소스와 테스트는 `~/` 별칭을 사용한다.

---

### Task 1: 공통 설정과 메타 훅 정합화

**Files:**
- Modify: `app/config/app.config.ts`
- Modify: `app/composables/useSetMeta.ts`
- Create: `test/site-metadata.test.ts`

**Interfaces:**
- Consumes: `SiteMetadata`, `appConfig`, `useSetMeta(meta: SiteMetadata)`
- Produces: 절대 canonical·Open Graph 이미지 URL을 만드는 공통 메타 설정

- [ ] **Step 1: 공통 메타의 실패 테스트를 작성한다.**

```ts
expect(appConfig.site.title).toBe('니힐의 도구상자');
expect(appConfig.site.url).toBe('https://nihil-tools.nihilncunia.com');
expect(appConfig.images.cover.link).toBe('/images/nihil-web-logo.png');
```

- [ ] **Step 2: 실패를 확인한다.**

Run: `pnpm vitest run test/site-metadata.test.ts`

Expected: 임시 사이트 설정 때문에 FAIL.

- [ ] **Step 3: 공통 설정을 구현한다.**

`appConfig.site`에 사이트명, 운영 URL, TRPG·창작 도구 설명과 공통 키워드를 입력하고, `images.cover.link`·`images.logo`·`images.darkLogo`를 `/images/nihil-web-logo*.png`로 지정한다. `useSetMeta`의 URL 계산은 `new URL(meta.url, appConfig.site.url)`와 `new URL(meta.imageLink ?? appConfig.images.cover.link, appConfig.site.url)`를 사용한다.

- [ ] **Step 4: 테스트를 통과시킨다.**

Run: `pnpm vitest run test/site-metadata.test.ts`

Expected: `1 passed`.

### Task 2: 정적 페이지 메타 적용

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/pages/apps/index.vue`
- Modify: `app/pages/apps/session-roll-table.vue`
- Modify: `app/pages/apps/monster-roll-table.vue`
- Modify: `app/pages/apps/dice-roller.vue`
- Modify: `app/pages/apps/image-webp-converter.vue`
- Modify: `app/pages/apps/random-keyword-generator.vue`
- Modify: `app/pages/apps/random-keyword-generator/background-story.vue`
- Modify: `app/pages/dev/style.vue`
- Create: `test/page-metadata.test.ts`

**Interfaces:**
- Consumes: `useSetMeta({ title, url, description, keywords, robots? })`
- Produces: 앱별 기능을 설명하는 검색·공유 메타

- [ ] **Step 1: 정적 페이지 메타의 실패 테스트를 작성한다.**

```ts
const expectedPages = [
  ['app/pages/index.vue', "title: '니힐의 도구상자'", "url: '/'"],
  ['app/pages/apps/dice-roller.vue', "title: '주사위 굴리기'", "url: '/apps/dice-roller'"],
  ['app/pages/dev/style.vue', "robots: 'noindex, nofollow'"],
] as const;
```

`readFileSync(resolve(process.cwd(), file), 'utf8')`로 각 파일의 `useSetMeta` 호출과 기대 문자열을 검사한다.

- [ ] **Step 2: 루트 페이지의 훅 누락으로 실패를 확인한다.**

Run: `pnpm vitest run test/page-metadata.test.ts`

Expected: `app/pages/index.vue`가 FAIL.

- [ ] **Step 3: 페이지별 기능 메타를 구현한다.**

각 페이지에는 고유 설명과 다음 키워드를 전달한다: 루트 `TRPG 도구, 창작 도구`; 앱 목록 `앱 목록, TRPG 유틸리티`; 세션 `세션 생성, 게임 마스터`; 몬스터 `몬스터 생성, CR`; 주사위 `D20, 주사위 굴리기`; WebP `WebP 변환, 이미지 변환`; 랜덤 키워드 `랜덤 키워드, 세계관 창작`; 배경 스토리 `캐릭터 생성, 배경 스토리`; 개발 스타일 `UI 카탈로그`. 루트에서는 `navigateTo` 이전에 훅을 호출하고, 개발 페이지에는 `robots: 'noindex, nofollow'`를 지정한다.

- [ ] **Step 4: 정적 페이지 테스트를 통과시킨다.**

Run: `pnpm vitest run test/page-metadata.test.ts`

Expected: 모든 기대 페이지 PASS.

### Task 3: 동적 앱 페이지와 최종 검증

**Files:**
- Modify: `app/pages/apps/[id].vue`
- Modify: `test/page-metadata.test.ts`

**Interfaces:**
- Consumes: `app.value.name`, `app.value.description`, `app.value.id`
- Produces: 앱 이름·설명·`/apps/<id>` 경로를 받는 `useSetMeta` 호출

- [ ] **Step 1: 동적 페이지의 실패 테스트를 추가한다.**

```ts
expect(source).toContain('description: app.value.description');
expect(source).toContain("keywords: '장소 이름 생성기, 판타지 지명'");
```

- [ ] **Step 2: 현재 설명·키워드 누락을 확인한다.**

Run: `pnpm vitest run test/page-metadata.test.ts`

Expected: `description` 기대값 때문에 FAIL.

- [ ] **Step 3: 동적 페이지 메타를 구현한다.**

`useSetMeta`에 앱 이름·상세 경로·`app.value.description`·`장소 이름 생성기, 판타지 지명` 키워드를 전달한다.

- [ ] **Step 4: 전체 메타 검증을 실행한다.**

Run: `pnpm vitest run test/site-metadata.test.ts test/page-metadata.test.ts && pnpm build`

Expected: 테스트 성공 및 `Build complete!`.

- [ ] **Step 5: 메타데이터 구현을 커밋한다.**

Stage `app/config/app.config.ts`, `app/composables/useSetMeta.ts`, 모든 수정 페이지, 두 테스트를 추가한 뒤 `2026 0724 기능: 사이트와 앱 메타데이터 추가` 메시지로 커밋한다.
