# Place Name Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 장소 이름 생성기 상세 페이지를 내부 패턴 기반 생성기로 바꾸고, `1개/5개/10개` 생성과 최신 결과 상단 강조 목록 UI를 제공한다.

**Architecture:** 생성 로직은 레퍼런스를 참고해 정리한 `app/data/place-name-generator.data.ts`의 정적 데이터와 연결어 슬롯 규칙을 사용하는 순수 유틸리티로 분리한다. 페이지는 해당 유틸리티를 호출해 생성 배치를 상태로 관리하고, 전체 페이지는 고정한 채 결과 목록 패널만 내부 스크롤되게 구성한다.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, TypeScript, Vitest, existing custom Tailwind tokens

## Global Constraints

- 사용자는 패턴 종류를 알 필요 없으므로 UI에는 패턴/규칙 메타정보를 노출하지 않는다.
- 생성 UI는 `1개`, `5개`, `10개`, `생성하기`만 노출한다.
- 신규 결과는 목록 최상단에 추가한다.
- 최신 생성 배치만 강조 스타일을 적용한다.
- 페이지 전체는 스크롤되지 않아야 하고 결과 목록만 스크롤되어야 한다.
- 라운드는 `rounded-2`만 사용한다.
- 들여쓰기는 space 2칸 기준이다.

---

### Task 1: 생성 유틸리티 작성

**Files:**
- Create: `app/utils/place-name-generator.ts`
- Test: `test/place-name-generator.test.ts`

**Interfaces:**
- Consumes: `app/data/place-name-generator.data.ts`
- Produces: `generatePlaceNames(count: 1 | 5 | 10): string[]`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Write minimal implementation**
- [ ] **Step 4: Run test to verify it passes**

### Task 2: 장소 이름 생성기 페이지 교체

**Files:**
- Modify: `app/pages/apps/[id].vue`
- Consumes: `generatePlaceNames(count: 1 | 5 | 10): string[]`
- Produces: count 선택, 생성 버튼, 최신 배치 상단 강조, 목록 스크롤 UI

- [ ] **Step 1: Write the failing test or targeted verification path**
- [ ] **Step 2: Implement page state and render structure**
- [ ] **Step 3: Ensure only result list scrolls**
- [ ] **Step 4: Verify page behavior**

### Task 3: 최종 검증

**Files:**
- Verify: `test/place-name-generator.test.ts`
- Verify: `app/pages/apps/[id].vue`

- [ ] **Step 1: Run targeted generator tests**
- [ ] **Step 2: Run linter**
- [ ] **Step 3: Run build**
