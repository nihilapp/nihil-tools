<script setup lang="ts">
import { ref } from 'vue';
import { cva } from 'class-variance-authority';

import UiButton from '~/components/ui/UiButton.vue';
import { getMonsterSubtypeData, monsterRollTableData } from '~/data/monster-roll-table.data';
import type { MonsterMajorTypeData, MonsterOptionData, MonsterOriginData, MonsterSubtypeData } from '~/data/monster-roll-table.types';
import { cn } from '~/utils/cn';

interface GeneratedMonster {
  behaviors: MonsterOptionData[];
  combatStyles: MonsterOptionData[];
  groupStructure: MonsterOptionData;
  majorType: MonsterMajorTypeData;
  origin: MonsterOriginData;
  size: MonsterOptionData;
  subtype: MonsterSubtypeData;
}

const cssVariants = cva([
  'flex min-h-0 flex-col gap-2',
], {
  variants: {},
  compoundVariants: [

  ],
  defaultVariants: {},
});

const generatedMonster = ref<GeneratedMonster | null>(null);

function selectRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function selectRandomItems<T>(items: T[]): T[] {
  const count = Math.random() < 0.5 ? 1 : 2;
  const candidates = [...items];
  const selected: T[] = [];

  while (selected.length < count && candidates.length > 0) {
    const index = Math.floor(Math.random() * candidates.length);
    selected.push(candidates.splice(index, 1)[0]!);
  }

  return selected;
}

function createMonster(): GeneratedMonster {
  const majorType = selectRandomItem(monsterRollTableData.majorTypes);

  return {
    behaviors: selectRandomItems(monsterRollTableData.behaviors),
    combatStyles: selectRandomItems(monsterRollTableData.combatStyles),
    groupStructure: selectRandomItem(monsterRollTableData.groupStructures),
    majorType,
    origin: selectRandomItem(monsterRollTableData.origins),
    size: selectRandomItem(monsterRollTableData.sizes),
    subtype: selectRandomItem(getMonsterSubtypeData(majorType.id)),
  };
}

function onGenerateMonster() {
  generatedMonster.value = createMonster();
}

function onGenerateMonsterCore() {
  if (!generatedMonster.value) {
    onGenerateMonster();
    return;
  }

  const majorType = selectRandomItem(monsterRollTableData.majorTypes);

  generatedMonster.value = {
    ...generatedMonster.value,
    majorType,
    origin: selectRandomItem(monsterRollTableData.origins),
    subtype: selectRandomItem(getMonsterSubtypeData(majorType.id)),
  };
}

function onGenerateEncounterStructure() {
  if (!generatedMonster.value) {
    onGenerateMonster();
    return;
  }

  generatedMonster.value = {
    ...generatedMonster.value,
    behaviors: selectRandomItems(monsterRollTableData.behaviors),
    combatStyles: selectRandomItems(monsterRollTableData.combatStyles),
    groupStructure: selectRandomItem(monsterRollTableData.groupStructures),
    size: selectRandomItem(monsterRollTableData.sizes),
  };
}

function onResetMonster() {
  generatedMonster.value = null;
}
</script>

<template>
  <section :class="cn([cssVariants({})])">
    <header class="rounded-2 border border-hairline bg-surface p-3">
      <h1 class="text-h4 font-700 text-ink">
        몬스터 롤 테이블
      </h1>
      <p class="mt-1 text-sm text-ink-muted">
        몬스터의 정체와 조우 방식을 빠르게 조합합니다.
      </p>
    </header>

    <article class="flex items-center justify-between gap-2 rounded-2 border border-hairline bg-surface p-3">
      <span class="text-sm font-600 text-ink-muted">
        7개 요소 · 경량 몬스터 콘셉트
      </span>
      <div class="flex gap-2">
        <UiButton class="border border-primary" data-action="generate" variant="primary" @click="onGenerateMonster">
          생성하기
        </UiButton>
        <UiButton data-action="reset" variant="secondary" @click="onResetMonster">
          초기화
        </UiButton>
      </div>
    </article>

    <article class="min-h-0 rounded-2 border border-hairline bg-surface p-3">
      <template v-if="generatedMonster">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <p class="text-sm font-700 text-primary">
              {{ generatedMonster.origin.label }} 출현
            </p>
            <h2 class="text-h5 font-700 text-ink">
              {{ generatedMonster.majorType.label }} ─ {{ generatedMonster.subtype.label }}
            </h2>
          </div>
          <div class="flex gap-2">
            <UiButton size="sm" @click="onGenerateMonsterCore">
              핵심 재생성
            </UiButton>
            <UiButton size="sm" @click="onGenerateEncounterStructure">
              조우 재생성
            </UiButton>
          </div>
        </div>

        <dl class="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div>
            <dt class="text-ink-muted">출현 맥락</dt>
            <dd class="mt-1 font-700 text-ink">{{ generatedMonster.origin.label }}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">크기</dt>
            <dd class="mt-1 font-700 text-ink">{{ generatedMonster.size.label }}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">집단 구조</dt>
            <dd class="mt-1 font-700 text-ink">{{ generatedMonster.groupStructure.label }}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">세부 분류</dt>
            <dd class="mt-1 font-700 text-ink">{{ generatedMonster.subtype.label }}</dd>
          </div>
        </dl>

        <div class="mt-3">
          <p class="text-sm text-ink-muted">행동</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span v-for="behavior in generatedMonster.behaviors" :key="behavior.id" class="rounded-2 bg-canvas-soft px-2 py-1 text-sm font-600 text-ink">
              {{ behavior.label }}
            </span>
          </div>
        </div>

        <div class="mt-3">
          <p class="text-sm text-ink-muted">전투 방식</p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span v-for="combatStyle in generatedMonster.combatStyles" :key="combatStyle.id" class="rounded-2 border border-primary/30 bg-primary/10 px-2 py-1 text-sm font-600 text-primary">
              {{ combatStyle.label }}
            </span>
          </div>
        </div>
      </template>

      <div v-else class="flex min-h-48 items-center justify-center rounded-2 border border-dashed border-hairline bg-canvas-soft p-3 text-sm text-ink-muted">
        생성하기를 누르면 몬스터 콘셉트가 표시됩니다.
      </div>
    </article>
  </section>
</template>
