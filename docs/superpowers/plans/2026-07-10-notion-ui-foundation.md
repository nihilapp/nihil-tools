# Notion UI Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** nihil-tools의 모든 도구 화면이 재사용할 Notion 계열 공용 UI 토큰, 프리미티브, 셸 및 첫 적용 화면을 구현한다.

**Architecture:** 기존 Tailwind 4 범용 색상은 유지하고 의미 기반 토큰을 새 스타일 파일로 추가한다. UI 프리미티브는 app/components/ui/에 두고, 앱 목록과 장소 이름 생성기는 app/components/views/에서 조합한다. 페이지는 경로 해석과 데이터 준비만 수행한다.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS 4, class-variance-authority, Iconify, Vitest, Vue Test Utils, happy-dom.

## Global Constraints

- Notion의 기능과 화면 구조가 아니라 디자인 언어만 사용한다.
- 캔버스는 따뜻한 밝은 색, 표면은 흰색과 1px 경계로 구분한다.
- 구조적 강조색은 파란색 하나만 사용한다.
- 카드, 버튼, 입력, 메뉴, 태그의 기본 라운드는 8px이다.
- 글자 간격은 항상 0으로 둔다.
- 렌더링 및 UI 컴포넌트는 cva와 cn을 사용한다.
- 모든 상호작용 함수는 on<액션><대상> 형식으로 이름을 짓는다.
- 새 디자인 라이브러리를 추가하지 않는다.
- 페이지 컴포넌트는 렌더링 컴포넌트 조립만 담당한다.
- 기존 범용 색상 토큰과 사용자 작업 트리 변경을 제거하지 않는다.

---

## File Structure

| File | Responsibility |
| --- | --- |
| package.json, pnpm-lock.yaml | Vue SFC 테스트 개발 의존성 |
| vitest.config.ts | Vue와 happy-dom 테스트 환경 |
| app/assets/styles/notion.css | 의미 색상, 그림자, 포커스 토큰 |
| app/assets/styles/tailwind.css | 토큰 import 및 전역 base 적용 |
| app/types/ui.types.ts | 옵션과 UI variant 공용 타입 |
| app/components/ui/*.vue | 상태 없는 공용 프리미티브 |
| test/ui/*.test.ts | component variant, v-model, 접근성 테스트 |
| app/components/commonLayout/*.vue | 공용 앱 셸 |
| app/components/views/*.vue | 라우트가 조립하는 화면 UI |
| app/pages/apps/*.vue | 데이터와 렌더링 뷰 연결만 수행 |

## Task 1: Add semantic tokens and component-test setup

**Files:**
- Create: app/assets/styles/notion.css
- Create: vitest.config.ts
- Create: test/ui/notion-tokens.test.ts
- Modify: app/assets/styles/tailwind.css
- Modify: package.json
- Modify: pnpm-lock.yaml

**Interfaces:**
- Consumes: Tailwind 4 @theme and the existing pnpm test script.
- Produces: bg-canvas-soft, text-ink, border-hairline, bg-primary, ring-focus and Vue SFC test support.

- [ ] **Step 1: Write the failing fixture**

~~~ts
import { describe, expect, it } from 'vitest';

import UiSurface from '../../app/components/ui/UiSurface.vue';

describe('UiSurface', () => {
  it('is available to the Vue test runner', () => {
    expect(UiSurface).toBeDefined();
  });
});
~~~

- [ ] **Step 2: Verify the fixture fails before setup**

Run: pnpm test -- test/ui/notion-tokens.test.ts

Expected: FAIL because UiSurface or Vue SFC transformation is unavailable.

- [ ] **Step 3: Add the test configuration and token layer**

Install @vitejs/plugin-vue, @vue/test-utils, and happy-dom as development dependencies. Create vitest.config.ts:

~~~ts
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    environment: 'happy-dom',
  },
});
~~~

Create notion.css:

~~~css
@theme {
  --color-canvas: #ffffff;
  --color-canvas-soft: #f6f5f4;
  --color-surface: #ffffff;
  --color-ink: #000000;
  --color-ink-secondary: #31302e;
  --color-ink-muted: #615d59;
  --color-ink-faint: #a39e98;
  --color-hairline: #e6e6e6;
  --color-primary: #0075de;
  --color-primary-active: #005bab;
  --color-on-primary: #ffffff;
  --color-focus: #0075de;
  --color-danger: #c43825;
  --color-success: #1aae39;
  --shadow-surface: 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-overlay: 0 12px 32px rgb(0 0 0 / 0.12);
}
~~~

Import notion.css from tailwind.css and change body to bg-canvas-soft text-ink. Keep current palette imports.

- [ ] **Step 4: Verify the Vue transform now loads**

Run: pnpm test -- test/ui/notion-tokens.test.ts

Expected: FAIL only because UiSurface.vue does not exist.

- [ ] **Step 5: Commit**

~~~powershell
git add package.json pnpm-lock.yaml vitest.config.ts app/assets/styles/notion.css app/assets/styles/tailwind.css test/ui/notion-tokens.test.ts
git commit -m '2026 0710 설정: 공용 UI 토큰과 컴포넌트 테스트 기반 추가'
~~~

## Task 2: Create types, surfaces, sections, and action controls

**Files:**
- Create: app/types/ui.types.ts
- Create: app/components/ui/UiSurface.vue
- Create: app/components/ui/UiSection.vue
- Create: app/components/ui/UiButton.vue
- Create: app/components/ui/UiIconButton.vue
- Create: test/ui/layout-and-action.test.ts

**Interfaces:**
- Consumes: semantic tokens, cn, cva, and Iconify.
- Produces: UiTone, UiSize, UiSurfaceVariant plus surface, section, button, and icon-button components.

- [ ] **Step 1: Write failing behavior tests**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiButton from '../../app/components/ui/UiButton.vue';
import UiSection from '../../app/components/ui/UiSection.vue';

describe('UiButton', () => {
  it('keeps the command label while disabled', () => {
    const wrapper = mount(UiButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: '생성',
      },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('생성');
  });
});

describe('UiSection', () => {
  it('renders title, actions, and body separately', () => {
    const wrapper = mount(UiSection, {
      props: {
        title: '생성 설정',
      },
      slots: {
        'header-actions': '<button type="button">초기화</button>',
        default: '<p>본문</p>',
      },
    });

    expect(wrapper.text()).toContain('생성 설정');
    expect(wrapper.text()).toContain('초기화');
    expect(wrapper.text()).toContain('본문');
  });
});
~~~

- [ ] **Step 2: Verify tests fail**

Run: pnpm test -- test/ui/layout-and-action.test.ts

Expected: FAIL because component imports do not exist.

- [ ] **Step 3: Define types and implement components**

Create ui.types.ts:

~~~ts
export type UiTone = 'neutral' | 'primary' | 'success' | 'danger';
export type UiSize = 'sm' | 'md';
export type UiSurfaceVariant = 'default' | 'soft' | 'outlined';

export interface UiOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
}
~~~

Each component must own a local cssVariants = cva(...) declaration and call cn(...) at its root. UiButton renders a native button, supports primary, secondary, outline, ghost, and danger variants, and sets aria-busy when loading. UiIconButton requires label and icon, uses aria-label, and keeps a 44px touch target. UiSection has title, description, header-actions, default, and footer slots. UiSurface supports default, soft, and outlined variants.

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/ui/notion-tokens.test.ts test/ui/layout-and-action.test.ts

Expected: PASS.

Run: pnpm exec eslint app/types/ui.types.ts app/components/ui/UiSurface.vue app/components/ui/UiSection.vue app/components/ui/UiButton.vue app/components/ui/UiIconButton.vue test/ui/notion-tokens.test.ts test/ui/layout-and-action.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/types/ui.types.ts app/components/ui/UiSurface.vue app/components/ui/UiSection.vue app/components/ui/UiButton.vue app/components/ui/UiIconButton.vue test/ui/notion-tokens.test.ts test/ui/layout-and-action.test.ts
git commit -m '2026 0710 기능: 공용 섹션과 행동 컨트롤 추가'
~~~

## Task 3: Create native form controls

**Files:**
- Create: app/components/ui/UiInput.vue
- Create: app/components/ui/UiTextarea.vue
- Create: app/components/ui/UiSelect.vue
- Create: app/components/ui/UiCheckbox.vue
- Create: app/components/ui/UiRadioGroup.vue
- Create: app/components/ui/UiSwitch.vue
- Create: test/ui/form-controls.test.ts

**Interfaces:**
- Consumes: UiOption<T> and UiSize.
- Produces: v-model compatible controls with label, hint, error, disabled, and input-specific props.

- [ ] **Step 1: Write failing v-model tests**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiCheckbox from '../../app/components/ui/UiCheckbox.vue';
import UiInput from '../../app/components/ui/UiInput.vue';
import UiSelect from '../../app/components/ui/UiSelect.vue';

describe('UiInput', () => {
  it('emits text and exposes an invalid state', async () => {
    const wrapper = mount(UiInput, {
      props: {
        modelValue: '',
        label: '이름',
        error: '이름을 입력해 주세요.',
      },
    });

    await wrapper.get('input').setValue('엘드로스');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([ '엘드로스' ]);
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
  });
});

describe('UiSelect', () => {
  it('emits a selected option value', async () => {
    const wrapper = mount(UiSelect, {
      props: {
        modelValue: 'one',
        options: [
          { value: 'one', label: '하나' },
          { value: 'two', label: '둘' },
        ],
      },
    });

    await wrapper.get('select').setValue('two');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([ 'two' ]);
  });
});

describe('UiCheckbox', () => {
  it('emits checked state', async () => {
    const wrapper = mount(UiCheckbox, {
      props: {
        modelValue: false,
        label: '공개',
      },
    });

    await wrapper.get('input[type="checkbox"]').setValue(true);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([ true ]);
  });
});
~~~

- [ ] **Step 2: Verify tests fail**

Run: pnpm test -- test/ui/form-controls.test.ts

Expected: FAIL because form components do not exist.

- [ ] **Step 3: Implement native wrappers**

Use native input, textarea, select, fieldset, and checkbox controls. Create stable ids with useId(), connect label with for, connect hint and error through aria-describedby, and set aria-invalid only when error is present. UiRadioGroup uses fieldset and legend. UiSwitch uses a checkbox with role="switch".

Use this text update pattern:

~~~ts
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

function onUpdateValue(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
~~~

UiCheckbox and UiSwitch emit boolean values; UiSelect and UiRadioGroup emit option strings.

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/ui/form-controls.test.ts

Expected: PASS.

Run: pnpm exec eslint app/components/ui/UiInput.vue app/components/ui/UiTextarea.vue app/components/ui/UiSelect.vue app/components/ui/UiCheckbox.vue app/components/ui/UiRadioGroup.vue app/components/ui/UiSwitch.vue test/ui/form-controls.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/components/ui/UiInput.vue app/components/ui/UiTextarea.vue app/components/ui/UiSelect.vue app/components/ui/UiCheckbox.vue app/components/ui/UiRadioGroup.vue app/components/ui/UiSwitch.vue test/ui/form-controls.test.ts
git commit -m '2026 0710 기능: 공용 폼 컨트롤 추가'
~~~

## Task 4: Create selection, metadata, and utility primitives

**Files:**
- Create: app/components/ui/UiChoiceGroup.vue
- Create: app/components/ui/UiTag.vue
- Create: app/components/ui/UiBadge.vue
- Create: app/components/ui/UiTabs.vue
- Create: app/components/ui/UiToolbar.vue
- Create: app/components/ui/UiEmptyState.vue
- Create: test/ui/selection-and-utility.test.ts

**Interfaces:**
- Consumes: UiOption<T>, UiTone, UiButton, UiIconButton, cva, and cn.
- Produces: selection controls, removable tags, tabs, toolbar, badge, and empty-state layouts.

- [ ] **Step 1: Write failing selection tests**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiChoiceGroup from '../../app/components/ui/UiChoiceGroup.vue';
import UiTag from '../../app/components/ui/UiTag.vue';

describe('UiChoiceGroup', () => {
  it('emits the clicked single-choice value', async () => {
    const wrapper = mount(UiChoiceGroup, {
      props: {
        modelValue: 'five',
        options: [
          { value: 'one', label: '1개' },
          { value: 'five', label: '5개' },
        ],
      },
    });

    await wrapper.get('button[data-value="one"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([ 'one' ]);
  });
});

describe('UiTag', () => {
  it('emits remove when removable', async () => {
    const wrapper = mount(UiTag, {
      props: {
        label: '지역',
        removable: true,
      },
    });

    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('remove')).toHaveLength(1);
  });
});
~~~

- [ ] **Step 2: Verify tests fail**

Run: pnpm test -- test/ui/selection-and-utility.test.ts

Expected: FAIL because selection components do not exist.

- [ ] **Step 3: Implement the specified APIs only**

UiChoiceGroup is single-select by default and emits a string, or a string array when multiple is true. UiTabs uses tablist, tab, and aria-selected. UiTag emits remove only when removable. UiBadge is read-only. UiToolbar is a wrapping flex region. UiEmptyState renders icon, title, description, and action slots without nesting a card inside a parent section.

Use this selection function:

~~~ts
function onSelectOption(value: string) {
  if (!props.multiple) {
    emit('update:modelValue', value);
    return;
  }

  const selectedValues = Array.isArray(props.modelValue)
    ? props.modelValue
    : [];
  const nextValues = selectedValues.includes(value)
    ? selectedValues.filter((item) => item !== value)
    : [
        ...selectedValues,
        value,
      ];

  emit('update:modelValue', nextValues);
}
~~~

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/ui/selection-and-utility.test.ts

Expected: PASS.

Run: pnpm exec eslint app/components/ui/UiChoiceGroup.vue app/components/ui/UiTag.vue app/components/ui/UiBadge.vue app/components/ui/UiTabs.vue app/components/ui/UiToolbar.vue app/components/ui/UiEmptyState.vue test/ui/selection-and-utility.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/components/ui/UiChoiceGroup.vue app/components/ui/UiTag.vue app/components/ui/UiBadge.vue app/components/ui/UiTabs.vue app/components/ui/UiToolbar.vue app/components/ui/UiEmptyState.vue test/ui/selection-and-utility.test.ts
git commit -m '2026 0710 기능: 공용 선택과 보조 UI 추가'
~~~

## Task 5: Convert the application shell

**Files:**
- Modify: app/layouts/default.vue
- Modify: app/components/commonLayout/CommonHeader.vue
- Modify: app/components/commonLayout/CommonContent.vue
- Modify: app/components/commonLayout/CommonFooter.vue
- Create: test/common-layout.test.ts

**Interfaces:**
- Consumes: UiButton, UiIconButton, UiSurface, semantic tokens, and app-shell page metadata.
- Produces: a document-style shell with responsive navigation and a constrained main landmark.

- [ ] **Step 1: Write the baseline shell test**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CommonContent from '../app/components/commonLayout/CommonContent.vue';

describe('CommonContent', () => {
  it('exposes its page body through the main landmark', () => {
    const wrapper = mount(CommonContent, {
      slots: {
        default: '<p>도구 본문</p>',
      },
    });

    expect(wrapper.get('main').text()).toContain('도구 본문');
  });
});
~~~

- [ ] **Step 2: Verify baseline behavior**

Run: pnpm test -- test/common-layout.test.ts

Expected: PASS before migration; preserve this behavior.

- [ ] **Step 3: Convert shell styling and controls**

Use bg-canvas-soft text-ink in default.vue. Keep one bordered header band rather than a card inside the header. Convert header navigation into UI action styles without breaking NuxtLink navigation. Keep title truncation on narrow screens. Keep the footer as a page band, not a nested surface card. Replace shell black-* and blue-* classes with semantic tokens.

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/common-layout.test.ts

Expected: PASS.

Run: pnpm exec eslint app/layouts/default.vue app/components/commonLayout/CommonHeader.vue app/components/commonLayout/CommonContent.vue app/components/commonLayout/CommonFooter.vue test/common-layout.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/layouts/default.vue app/components/commonLayout/CommonHeader.vue app/components/commonLayout/CommonContent.vue app/components/commonLayout/CommonFooter.vue test/common-layout.test.ts
git commit -m '2026 0710 디자인: 공용 앱 셸을 문서형 UI로 전환'
~~~

## Task 6: Create app-list and placeholder rendering views

**Files:**
- Create: app/components/views/AppListView.vue
- Create: app/components/views/AppPlaceholderView.vue
- Modify: app/pages/apps/index.vue
- Create: test/app-list-view.test.ts

**Interfaces:**
- Consumes: AppNavigationItem and UI primitives.
- Produces: a thin app-list page, an app-list view, and an app placeholder view.

- [ ] **Step 1: Write a failing placeholder test**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppPlaceholderView from '../app/components/views/AppPlaceholderView.vue';

describe('AppPlaceholderView', () => {
  it('shows the selected app name', () => {
    const wrapper = mount(AppPlaceholderView, {
      props: {
        app: {
          id: 'dice-roller',
          name: '주사위 굴리기',
          description: '주사위를 굴립니다.',
          icon: 'game-icons:dice-twenty-faces-twenty',
          url: '/dice-roller',
          detailPath: '/apps/dice-roller',
        },
      },
    });

    expect(wrapper.text()).toContain('주사위 굴리기');
  });
});
~~~

- [ ] **Step 2: Verify the missing view fails**

Run: pnpm test -- test/app-list-view.test.ts

Expected: FAIL because the view import does not exist.

- [ ] **Step 3: Implement views and shrink pages**

AppListView accepts items: AppNavigationItem[] and renders each link through one UiSurface. AppPlaceholderView accepts app: AppNavigationItem and uses UiEmptyState.

Keep apps/index.vue limited to appItems and AppListView. Do not change apps/[id].vue in this task; detail routing waits for the generator view in Task 7.

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/app-list-view.test.ts test/app-shell.test.ts

Expected: PASS.

Run: pnpm exec eslint app/components/views/AppListView.vue app/components/views/AppPlaceholderView.vue app/pages/apps/index.vue test/app-list-view.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/components/views/AppListView.vue app/components/views/AppPlaceholderView.vue app/pages/apps/index.vue test/app-list-view.test.ts
git commit -m '2026 0710 리팩터: 앱 목록 페이지를 렌더링 뷰로 분리'
~~~

## Task 7: Convert the place-name generator

**Files:**
- Create: app/components/views/PlaceNameGeneratorView.vue
- Create: test/place-name-generator-view.test.ts
- Modify: test/place-name-generator.test.ts only if existing pure utility coverage needs adjustment

**Interfaces:**
- Consumes: generatePlaceNames, PlaceNameGenerationCount, UiChoiceGroup, UiButton, UiSection, UiToolbar, UiEmptyState, and UiBadge.
- Produces: compact count selection, one primary command, latest-first batches, and an internally scrollable result list.

- [ ] **Step 1: Write a failing generator-view test**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PlaceNameGeneratorView from '../app/components/views/PlaceNameGeneratorView.vue';

describe('PlaceNameGeneratorView', () => {
  it('adds a generated batch above earlier batches', async () => {
    const wrapper = mount(PlaceNameGeneratorView);

    await wrapper.get('button[data-action="generate"]').trigger('click');

    expect(wrapper.findAll('[data-generation-batch]')).toHaveLength(1);
    expect(wrapper.text()).not.toContain('생성하기를 누르면 이름이 여기에 표시됩니다.');
  });
});
~~~

- [ ] **Step 2: Verify the missing view fails**

Run: pnpm test -- test/place-name-generator-view.test.ts

Expected: FAIL because PlaceNameGeneratorView.vue does not exist.

- [ ] **Step 3: Implement view state and composition**

Move generationCount, generatedBatches, and generationCountOptions from apps/[id].vue into PlaceNameGeneratorView.vue. Rename handleGenerate to onGeneratePlaceNames:

~~~ts
function onGeneratePlaceNames() {
  const nextBatch = generatePlaceNames(generationCount.value);

  generatedBatches.value = [
    nextBatch,
    ...generatedBatches.value,
  ];
}
~~~

Use UiChoiceGroup for 1개, 5개, 10개; UiButton for the sole primary command; UiSection for controls and results; UiEmptyState before the first result; and UiBadge for the latest marker. Only the result list scrolls.

- [ ] **Step 4: Verify implementation**

Run: pnpm test -- test/place-name-generator.test.ts test/place-name-generator-view.test.ts

Expected: PASS.

Run: pnpm exec eslint app/components/views/PlaceNameGeneratorView.vue test/place-name-generator.test.ts test/place-name-generator-view.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/components/views/PlaceNameGeneratorView.vue test/place-name-generator.test.ts test/place-name-generator-view.test.ts
git commit -m '2026 0710 디자인: 장소 이름 생성기를 공용 UI로 전환'
~~~

## Task 8: Integrate the app-detail rendering view

**Files:**
- Create: app/components/views/AppDetailView.vue
- Modify: app/pages/apps/[id].vue
- Create: test/app-detail-view.test.ts

**Interfaces:**
- Consumes: AppNavigationItem, AppPlaceholderView, and PlaceNameGeneratorView.
- Produces: a thin detail route that selects the generator view only for the place-name-generator id.

- [ ] **Step 1: Write a failing detail-dispatch test**

~~~ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppDetailView from '../app/components/views/AppDetailView.vue';

describe('AppDetailView', () => {
  it('renders the generator view for the place-name generator', () => {
    const wrapper = mount(AppDetailView, {
      props: {
        app: {
          id: 'place-name-generator',
          name: '장소 이름 생성기',
          description: '장소 이름을 생성합니다.',
          icon: 'material-symbols:map',
          url: '/place-name-generator',
          detailPath: '/apps/place-name-generator',
        },
      },
    });

    expect(wrapper.findComponent({ name: 'PlaceNameGeneratorView' }).exists()).toBe(true);
  });
});
~~~

- [ ] **Step 2: Verify the missing dispatcher fails**

Run: pnpm test -- test/app-detail-view.test.ts

Expected: FAIL because AppDetailView.vue does not exist.

- [ ] **Step 3: Implement dispatcher and shrink the detail page**

AppDetailView accepts app: AppNavigationItem. Render PlaceNameGeneratorView when app.id is place-name-generator; otherwise render AppPlaceholderView. Keep apps/[id].vue limited to route validation, app lookup, and AppDetailView. Remove generationCount, generatedBatches, generationCountOptions, onGeneratePlaceNames, and all direct article markup from the page.

- [ ] **Step 4: Verify integration**

Run: pnpm test -- test/app-detail-view.test.ts test/app-shell.test.ts test/place-name-generator-view.test.ts

Expected: PASS.

Run: pnpm exec eslint app/components/views/AppDetailView.vue app/pages/apps/[id].vue test/app-detail-view.test.ts

Expected: exit code 0.

- [ ] **Step 5: Commit**

~~~powershell
git add app/components/views/AppDetailView.vue app/pages/apps/[id].vue test/app-detail-view.test.ts
git commit -m '2026 0710 리팩터: 앱 상세 페이지를 렌더링 뷰로 분리'
~~~


## Task 9: Verify the integrated UI system

**Files:**
- Modify: only the files that fail the checks below.

**Interfaces:**
- Consumes: every primitive, shell, view, existing app-shell utility, and generator utility.
- Produces: a lint-clean, test-clean, buildable UI foundation verified at desktop and mobile widths.

- [ ] **Step 1: Run all tests**

Run: pnpm test

Expected: all Vitest suites PASS.

- [ ] **Step 2: Run lint**

Run: pnpm lint

Expected: exit code 0. If unrelated existing violations remain, lint the exact changed file set and report unrelated failures separately.

- [ ] **Step 3: Build**

Run: pnpm build

Expected: exit code 0.

- [ ] **Step 4: Inspect browser layouts**

Start: pnpm dev -- --port 3001

Inspect /apps and /apps/place-name-generator at 1440px and 390px. Confirm no horizontal overflow, no clipped button labels, visible keyboard focus, one primary generator command, and internal result-list scrolling.

- [ ] **Step 5: Commit only a verification correction when one was required**

Do not create a commit when every verification command passes without a correction. When a correction is required, stage exactly the files changed by that correction and commit with this message:

~~~powershell
git commit -m '2026 0710 수정: 공용 UI 검증 보완'
~~~

## Spec Coverage Review

- 의미 토큰과 base 스타일: Task 1.
- 표면, 섹션, 툴바, 빈 상태: Tasks 2 and 4.
- 버튼과 아이콘 버튼: Task 2.
- 입력, 텍스트영역, 드롭다운, 체크박스, 라디오 그룹, 스위치: Task 3.
- 선택 그룹, 태그, 배지, 탭: Task 4.
- 공용 헤더, 콘텐츠 영역, 푸터: Task 5.
- 얇은 페이지와 렌더링 뷰 분리: Task 6.
- 앱 목록과 장소 이름 생성기 전환: Tasks 6 and 7.
- variants, v-model, 접근성, 브라우저, lint, test, build 검증: Tasks 1 through 9.
