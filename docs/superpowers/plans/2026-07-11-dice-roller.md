# 주사위 굴리기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프리셋과 커스텀 주사위식을 실행하고 탭별 최신순 이력을 제공하는 `/apps/dice-roller` 도구를 만든다.

**Architecture:** 순수 유틸리티가 프리셋 식과 이력 데이터를 만든다. `DiceRoller.vue`가 탭·입력·이력 상태와 `rollDiceExpression()` 실행을 소유하며 결과 표시는 하위 컴포넌트에 위임한다.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vitest, happy-dom, `@nihilapp/diceroll-v3`, Tailwind CSS 4, cva

## Global Constraints

- 신규 렌더링 컴포넌트는 `cva`와 `cn`을 사용한다.
- 앱 import는 `~/` 별칭만 사용하고 상호작용 함수명은 `on<액션><대상>` 형식만 사용한다.
- 프리셋 UI 표기는 대문자 D이며, D%는 개수 1로 고정·비활성화한다.
- 페이지 바깥은 스크롤하지 않고 이력 패널만 세로 스크롤한다.
- 최소·최대 강제 굴림, 이력 영속화, 프리셋 편집은 구현하지 않는다.

---

### Task 1: 프리셋 식과 이력 유틸리티

**Files:**
- Create: `app/data/dice-roller.types.ts`
- Create: `app/data/dice-roller-presets.data.ts`
- Create: `app/utils/dice-roller.ts`
- Test: `test/dice-roller.test.ts`

**Interfaces:** `DiceRollPreset`, `DiceRollHistoryItem`, `diceRollPresetData`, `buildPresetDiceExpression()`, `createDiceRollHistoryItem()`.

- [ ] **Step 1: Write failing tests**

```ts
expect(buildPresetDiceExpression(diceRollPresetData[2]!, 3)).toBe('3d6');
const percentile = diceRollPresetData.find((preset) => preset.id === 'percentile')!;
expect(buildPresetDiceExpression(percentile, 8)).toBe('d%');
expect(createDiceRollHistoryItem('d20', results).results).toBe(results);
```

- [ ] **Step 2: Run red test**

Run: `pnpm test -- test/dice-roller.test.ts`

Expected: FAIL because the data and utility modules do not exist.

- [ ] **Step 3: Implement the minimal interfaces**

```ts
export interface DiceRollPreset { id: string; label: string; expression: string; supportsCount: boolean }
export interface DiceRollHistoryItem { id: string; expression: string; results: DiceExpressionResult[] }
export function buildPresetDiceExpression(preset: DiceRollPreset, count: number) {
  return preset.supportsCount ? `${count}${preset.expression}` : preset.expression;
}
export function createDiceRollHistoryItem(expression: string, results: DiceExpressionResult[]): DiceRollHistoryItem {
  return { id: crypto.randomUUID(), expression, results };
}
```

Create D2, D4, D6, D8, D10, D12, D20, D100, DF, D% preset records. Only the D% record has `supportsCount: false`.

- [ ] **Step 4: Run green test and commit**

Run: `pnpm test -- test/dice-roller.test.ts`

Expected: PASS.

Run: `git add app/data/dice-roller.types.ts app/data/dice-roller-presets.data.ts app/utils/dice-roller.ts test/dice-roller.test.ts; git commit -m "2026 0711 기능: 주사위 프리셋과 이력 모델 추가"`

### Task 2: 주사위 굴리기 렌더러

**Files:**
- Create: `app/components/diceRoller/DiceRoller.vue`
- Create: `app/components/diceRoller/DiceRollerResult.vue`
- Test: `test/dice-roller-component.test.ts`

**Interfaces:** `diceRollPresetData`, `buildPresetDiceExpression`, `createDiceRollHistoryItem`, `rollDiceExpression`을 사용해 프리셋·커스텀 탭, 탭별 이력, 오류 상태를 만든다.

- [ ] **Step 1: Write failing component tests**

```ts
const wrapper = mount(DiceRoller);
expect(wrapper.get('[data-testid="preset-count"]').attributes('type')).toBe('number');
expect(wrapper.get('[data-testid="preset-select"]').text()).toContain('D20');
await wrapper.get('[data-testid="custom-tab"]').trigger('click');
expect(wrapper.get('[data-testid="custom-expression"]').exists()).toBe(true);
```

- [ ] **Step 2: Run red test**

Run: `pnpm test -- test/dice-roller-component.test.ts`

Expected: FAIL because `DiceRoller.vue` does not exist.

- [ ] **Step 3: Implement the renderer**

```ts
const activeTab = ref<'preset' | 'custom'>('preset');
const presetCount = ref(1);
const presetId = ref('d20');
const customExpression = ref('');
const presetHistory = ref<DiceRollHistoryItem[]>([]);
const customHistory = ref<DiceRollHistoryItem[]>([]);
function onSelectTab(tab: 'preset' | 'custom') { activeTab.value = tab; }
function onRollPreset() { /* construct, execute, prepend preset history */ }
function onRollCustom() { /* reject blank input, execute, prepend custom history */ }
```

Use `cva` and `cn`. The preset control is `[number input] [select] | [button]`; the custom control is `[expression input] | [button]`. Selecting D% must set `presetCount` to `1` and disable its input. Catch library errors in the active tab only. Render each result's expression and total unconditionally; branch on `RollKind` before accessing detailed dice fields. The outer component uses `min-h-0 overflow-hidden`; only the history list uses `flex-1 min-h-0 overflow-y-auto`.

- [ ] **Step 4: Add red tests for D% and blank custom input**

```ts
await wrapper.get('[data-testid="preset-select"]').setValue('percentile');
expect((wrapper.get('[data-testid="preset-count"]').element as HTMLInputElement).value).toBe('1');
expect(wrapper.get('[data-testid="preset-count"]').attributes('disabled')).toBeDefined();
await wrapper.get('[data-testid="custom-roll"]').trigger('click');
expect(wrapper.get('[data-testid="custom-error"]').text()).toContain('주사위식');
```

Run: `pnpm test -- test/dice-roller-component.test.ts`

Expected: FAIL before the two behaviors are implemented, then PASS after implementation.

- [ ] **Step 5: Commit**

Run: `git add app/components/diceRoller/DiceRoller.vue app/components/diceRoller/DiceRollerResult.vue test/dice-roller-component.test.ts; git commit -m "2026 0711 기능: 주사위 굴리기 화면 추가"`

### Task 3: 앱 페이지 조립과 통합 검증

**Files:**
- Create: `app/pages/apps/dice-roller.vue`
- Modify: `test/dice-roller-component.test.ts`

**Interfaces:** `DiceRoller.vue`를 소비하며 렌더링 컴포넌트만 조립하는 `/apps/dice-roller` 페이지를 만든다.

- [ ] **Step 1: Write failing route test**

```ts
const source = readFileSync(resolve(process.cwd(), 'app/pages/apps/dice-roller.vue'), 'utf8');
expect(source).toContain("import DiceRoller from '~/components/diceRoller/DiceRoller.vue'");
expect(source).toContain('<DiceRoller />');
```

- [ ] **Step 2: Run red test**

Run: `pnpm test -- test/dice-roller-component.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement route assembly**

```vue
<script setup lang="ts">
import DiceRoller from '~/components/diceRoller/DiceRoller.vue';
</script>

<template>
  <DiceRoller />
</template>
```

- [ ] **Step 4: Run complete verification**

Run: `pnpm test -- test/dice-roller.test.ts test/dice-roller-component.test.ts && pnpm lint && pnpm build`

Expected: all focused tests, lint, and Nuxt build exit with code 0.

- [ ] **Step 5: Browser-check the route**

Open `/apps/dice-roller`. Confirm both tabs work, D% locks count at 1, a long history scrolls only inside its panel, and the document does not gain a vertical scrollbar.

- [ ] **Step 6: Commit**

Run: `git add app/pages/apps/dice-roller.vue test/dice-roller-component.test.ts; git commit -m "2026 0711 기능: 주사위 굴리기 페이지 연결"`
