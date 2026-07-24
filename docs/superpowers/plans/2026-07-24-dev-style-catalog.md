# 개발용 스타일 카탈로그 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/dev/style`에서 공용 UI 프리미티브와 모든 핵심 변형을 직접 비교할 수 있는 개발용 스타일 카탈로그를 만든다.

**Architecture:** 페이지는 `app/pages/dev/style.vue`에서 전용 렌더링 컴포넌트만 조립한다. `DevStyleCatalog.vue`는 공용 프리미티브와 로컬 데모 상태를 사용해 토큰, 컨트롤, 레이아웃 섹션을 렌더링하며, 새 입력 프리미티브와 재귀적으로 중첩 가능한 `UiPanelDivider`/`UiPanel`/`UiCard`를 독립적인 UI 컴포넌트로 둔다.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, class-variance-authority, Vitest, Vue Test Utils

## Global Constraints

- 경로는 `/dev/style`이며 일반 도구 목록에 등록하지 않는다.
- 페이지는 렌더링 컴포넌트만 조립한다.
- 모든 UI 컴포넌트는 `cva`와 `cn` 패턴을 사용한다.
- `UiPanel`과 `UiPanelDivider`는 `width` 미지정 시 `flex: 1 1 0%`를 사용한다.
- `UiPanelDivider`는 `UiPanel`과 다른 `UiPanelDivider`를 모두 자식으로 받을 수 있다.
- 템플릿 태그의 속성은 기존 ESLint 규칙에 맞춰 읽기 쉽게 줄바꿈한다.
- 모든 상호작용 함수는 `on<액션><대상>`으로 명명한다.
- 이번 작업에서는 커밋하지 않는다.

---

### Task 1: 새 폼 프리미티브의 실패 테스트 작성

**Files:**
- Create: `test/ui/form-controls.test.ts`
- Create: `app/components/ui/UiTextarea.vue`
- Create: `app/components/ui/UiCheckbox.vue`
- Create: `app/components/ui/UiRadioGroup.vue`

**Interfaces:**
- Produces: `UiTextarea`, `UiCheckbox`, `UiRadioGroup` Vue 컴포넌트
- Consumes: `UiOption` from `~/types/ui.types`

- [ ] **Step 1: 텍스트 영역의 v-model·오류 상태 테스트 작성**

```ts
const wrapper = mount(UiTextarea, {
  props: { label: '설명', modelValue: '', error: '설명을 입력하세요.' },
});
await wrapper.find('textarea').setValue('새 설명');
expect(wrapper.emitted('update:modelValue')).toEqual([['새 설명']]);
expect(wrapper.attributes('aria-invalid')).toBe('true');
```

- [ ] **Step 2: 체크박스와 라디오 그룹의 변경·비활성 상태 테스트 작성**

```ts
await checkbox.find('input').setValue(true);
expect(checkbox.emitted('update:modelValue')).toEqual([[true]]);
expect(radio.find('input[value="beta"]').attributes('disabled')).toBeDefined();
```

- [ ] **Step 3: 실패 테스트 실행**

Run: `pnpm exec vitest run test/ui/form-controls.test.ts`

Expected: 새 컴포넌트 모듈을 찾을 수 없어 실패한다.

### Task 2: 새 폼 프리미티브 구현 및 단위 검증

**Files:**
- Create: `app/components/ui/UiTextarea.vue`
- Create: `app/components/ui/UiCheckbox.vue`
- Create: `app/components/ui/UiRadioGroup.vue`
- Test: `test/ui/form-controls.test.ts`

**Interfaces:**
- `UiTextarea`: `modelValue?: string`, `label?: string`, `error?: string`, `disabled?: boolean`, `class?: string`
- `UiCheckbox`: `modelValue?: boolean`, `label: string`, `disabled?: boolean`, `class?: string`
- `UiRadioGroup`: `modelValue?: string`, `options: UiOption[]`, `label?: string`, `disabled?: boolean`, `class?: string`

- [ ] **Step 1: 각 컴포넌트를 cva/cn 기반으로 구현**

텍스트 영역은 `UiInput`과 동일한 경계·포커스·오류 표현을 사용한다. 체크박스와 라디오는 명확한 label 연결, `disabled`, `v-model` 변경 이벤트를 제공한다.

- [ ] **Step 2: 새 폼 프리미티브 테스트 실행**

Run: `pnpm exec vitest run test/ui/form-controls.test.ts`

Expected: 모든 테스트가 통과한다.

### Task 3: 스타일 카탈로그의 실패 테스트 작성

**Files:**
- Create: `test/dev-style-catalog.test.ts`
- Create: `app/components/views/DevStyleCatalog.vue`
- Create: `app/pages/dev/style.vue`

**Interfaces:**
- Produces: `/dev/style` 페이지와 `DevStyleCatalog` 화면
- Consumes: 모든 `Ui*` 프리미티브

- [ ] **Step 1: 카탈로그 섹션과 버튼 변형을 검증하는 테스트 작성**

```ts
const wrapper = mount(DevStyleCatalog);
expect(wrapper.text()).toContain('토큰');
expect(wrapper.text()).toContain('버튼');
expect(wrapper.text()).toContain('레이아웃');
expect(wrapper.findAll('button').some((button) => button.text() === 'Primary')).toBe(true);
```

- [ ] **Step 2: 실패 테스트 실행**

Run: `pnpm exec vitest run test/dev-style-catalog.test.ts`

Expected: `DevStyleCatalog` 모듈을 찾을 수 없어 실패한다.

### Task 4: `/dev/style` 카탈로그 구현 및 검증

**Files:**
- Create: `app/components/views/DevStyleCatalog.vue`
- Create: `app/pages/dev/style.vue`
- Test: `test/dev-style-catalog.test.ts`

**Interfaces:**
- 앵커: `#tokens`, `#buttons`, `#inputs`, `#choices`, `#feedback`, `#layout`
- 섹션: 토큰, 버튼, 입력, 선택, 피드백, 레이아웃

- [ ] **Step 1: 앵커 메뉴와 섹션을 구현**

`UiSection`과 `UiSurface`를 사용하고, 버튼 변형 5종·크기 2종·비활성·로딩, 입력/선택/새 폼 프리미티브 상태, 토큰 견본, 표면/섹션 조합을 실제 컴포넌트로 렌더링한다.

- [ ] **Step 2: 카탈로그 테스트 실행**

Run: `pnpm exec vitest run test/dev-style-catalog.test.ts`

Expected: 모든 섹션과 핵심 버튼 변형이 렌더링되어 통과한다.

### Task 5: 전체 품질 검증

**Files:**
- Modify: 작업 중 생성·수정된 파일 전체

- [ ] **Step 1: 포맷 및 정적 검사 실행**

Run: `pnpm run lint`

Expected: ESLint 오류 없이 종료한다.

- [ ] **Step 2: 전체 단위 테스트 실행**

Run: `pnpm test`

Expected: 모든 테스트가 통과한다.

- [ ] **Step 3: 프로덕션 빌드 실행**

Run: `pnpm build`

Expected: Nuxt 빌드가 성공한다.
