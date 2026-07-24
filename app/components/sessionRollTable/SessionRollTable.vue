<script setup lang="ts">
import { computed, ref } from 'vue';
import { cva } from 'class-variance-authority';

import UiButton from '~/components/ui/UiButton.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import { getLeagueNoticeDataByTab, getLeagueNoticeReasonCandidates, getLeagueRequesterCandidates, leagueNoticeTabData, sessionRollTableData } from '~/data/session-roll-table.data';
import type { CivilianNoticeData, LeagueNoticeData, LeagueNoticeTabId } from '~/data/session-roll-table.types';
import { cn } from '~/utils/cn';

type RequestCategory = 'civilian' | 'league';

interface GeneratedSessionBase {
  monsterTypes: string[];
  reasonTokens: string[];
  requester: string;
  terrain: string;
  theme: string;
}

interface GeneratedLeagueSession extends GeneratedSessionBase {
  category: 'league';
  notice: LeagueNoticeData;
}

interface GeneratedCivilianSession extends GeneratedSessionBase {
  category: 'civilian';
  notice: CivilianNoticeData;
}

type GeneratedSession = GeneratedLeagueSession | GeneratedCivilianSession;

const cssVariants = cva([
  'flex h-full min-h-0 flex-col gap-2 overflow-hidden',
], {
  variants: {},
  compoundVariants: [

  ],
  defaultVariants: {},
});

const requestCategory = ref<RequestCategory>('league');
const leagueNoticeTab = ref<LeagueNoticeTabId>('all');
const generatedSession = ref<GeneratedSession | null>(null);

const leagueNotices = computed(() => getLeagueNoticeDataByTab(leagueNoticeTab.value));
const requestCandidateCount = computed(() => requestCategory.value === 'league'
  ? `${leagueNotices.value.length}개 공고 후보`
  : `${sessionRollTableData.civilianNotices.length}개 의뢰 후보`);

function selectRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function selectRandomItems<T>(items: T[], count: number): T[] {
  const candidates = [
    ...items,
  ];
  const selected: T[] = [
  ];

  while (selected.length < count && candidates.length > 0) {
    selected.push(candidates.splice(Math.floor(Math.random() * candidates.length), 1)[0]!);
  }

  return selected;
}

function selectReasonCandidates(items: string[]): string[] {
  return selectRandomItems(items, 1 + Math.floor(Math.random() * 2));
}

function createLeagueSession(notice: LeagueNoticeData): GeneratedLeagueSession {
  return {
    category: 'league',
    monsterTypes: notice.monsterTypes,
    notice,
    reasonTokens: selectReasonCandidates(getLeagueNoticeReasonCandidates(notice)),
    requester: selectRandomItem(getLeagueRequesterCandidates(notice.requesterCategories)),
    terrain: selectRandomItem(sessionRollTableData.terrains),
    theme: selectRandomItem(sessionRollTableData.themes),
  };
}

function createCivilianSession(notice: CivilianNoticeData): GeneratedCivilianSession {
  return {
    category: 'civilian',
    monsterTypes: notice.monsterTypes,
    notice,
    reasonTokens: selectReasonCandidates(notice.reasonCandidates),
    requester: selectRandomItem(notice.requesterCandidates),
    terrain: selectRandomItem(sessionRollTableData.terrains),
    theme: selectRandomItem(sessionRollTableData.themes),
  };
}

function createGeneratedSession(): GeneratedSession {
  if (requestCategory.value === 'league') {
    return createLeagueSession(selectRandomItem(leagueNotices.value));
  }

  return createCivilianSession(selectRandomItem(sessionRollTableData.civilianNotices));
}

function onSelectRequestCategory(category: RequestCategory) {
  requestCategory.value = category;
  generatedSession.value = null;
}

function onSelectLeagueNoticeTab(tabId: LeagueNoticeTabId) {
  leagueNoticeTab.value = tabId;
  generatedSession.value = null;
}

function onGenerateSession() {
  generatedSession.value = createGeneratedSession();
}

function onGenerateRequest() {
  if (!generatedSession.value) {
    onGenerateSession();
    return;
  }

  const previousEnvironment = {
    terrain: generatedSession.value.terrain,
    theme: generatedSession.value.theme,
  };

  generatedSession.value = {
    ...createGeneratedSession(),
    ...previousEnvironment,
  };
}

function onGenerateEnvironment() {
  if (!generatedSession.value) {
    onGenerateSession();
    return;
  }

  generatedSession.value = {
    ...generatedSession.value,
    terrain: selectRandomItem(sessionRollTableData.terrains),
    theme: selectRandomItem(sessionRollTableData.themes),
  };
}

function onResetSession() {
  generatedSession.value = null;
}
</script>

<template>
  <UiPanelDivider
    direction="column"
    gap="sm"
    :class="cn([cssVariants({})])"
  >
    <UiPanel
      :width="0"
      background="surface">
      <header>
        <p class="text-sm text-ink-muted">
          의뢰와 세션 환경을 조합해 즉시 사용할 아이디어를 만듭니다.
        </p>
      </header>

      <div class="mt-3 border-t border-hairline pt-3">
        <div class="flex gap-2">
          <UiButton
            class="flex-1"
            data-category="league"
            :variant="requestCategory === 'league' ? 'primary' : 'secondary'"
            @click="onSelectRequestCategory('league')"
          >
            연맹 의뢰
          </UiButton>
          <UiButton
            class="flex-1"
            data-category="civilian"
            :variant="requestCategory === 'civilian' ? 'primary' : 'secondary'"
            @click="onSelectRequestCategory('civilian')"
          >
            민간 의뢰
          </UiButton>
        </div>

        <div
          v-if="requestCategory === 'league'"
          class="mt-3 flex gap-2 border-t border-hairline pt-3"
        >
          <UiButton
            v-for="tab in leagueNoticeTabData"
            :key="tab.id"
            :data-tab="tab.id"
            class="flex-1"
            size="sm"
            :variant="leagueNoticeTab === tab.id ? 'outline' : 'secondary'"
            @click="onSelectLeagueNoticeTab(tab.id)"
          >
            {{ tab.label }}
          </UiButton>
        </div>

        <div class="mt-3 flex items-center justify-between gap-2 rounded-2 border border-hairline p-2">
          <span class="text-sm font-600 text-ink-muted">
            {{ requestCandidateCount }}
          </span>
          <div class="flex gap-2">
            <UiButton
              class="border border-primary"
              data-action="generate"
              variant="primary"
              @click="onGenerateSession">
              생성하기
            </UiButton>
            <UiButton
              data-action="reset"
              variant="secondary"
              @click="onResetSession">
              초기화
            </UiButton>
          </div>
        </div>
      </div>
    </UiPanel>

    <UiPanel
      class="min-h-0 overflow-hidden"
      background="surface">
      <div
        v-if="generatedSession"
        class="h-full overflow-y-auto">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
          <div>
            <p class="text-sm font-700 text-primary">
              {{ generatedSession.category === 'league' ? '연맹 의뢰' : '민간 의뢰' }}
            </p>
            <h2 class="text-h5 font-700 text-ink">
              {{ generatedSession.category === 'league' ? generatedSession.notice.noticeType : generatedSession.notice.requestType }}
            </h2>
          </div>
          <div class="flex flex-wrap gap-2">
            <UiButton
              size="sm"
              @click="onGenerateRequest">
              의뢰 재생성
            </UiButton>
            <UiButton
              size="sm"
              @click="onGenerateEnvironment">
              환경 재생성
            </UiButton>
          </div>
        </div>

        <dl class="mt-3 grid gap-3 text-sm md:grid-cols-2">
          <div v-if="generatedSession.category === 'league'">
            <dt class="text-ink-muted">
              공고 계열
            </dt>
            <dd class="mt-1 font-700 text-ink">
              {{ generatedSession.notice.adventurerRole ?? '기밀 공고' }}
            </dd>
          </div>
          <div v-if="generatedSession.category === 'league'">
            <dt class="text-ink-muted">
              공고 그룹
            </dt>
            <dd class="mt-1 font-700 text-ink">
              {{ generatedSession.notice.noticeGroup }}
            </dd>
          </div>
          <div v-if="generatedSession.category === 'league' && generatedSession.notice.securityLevel !== '공개'">
            <dt class="text-ink-muted">
              보안 등급
            </dt>
            <dd class="mt-1 font-700 text-danger">
              {{ generatedSession.notice.securityLevel }}
            </dd>
          </div>
          <div>
            <dt class="text-ink-muted">
              의뢰자
            </dt>
            <dd class="mt-1 font-700 text-ink">
              {{ generatedSession.requester }}
            </dd>
          </div>
          <div>
            <dt class="text-ink-muted">
              테마
            </dt>
            <dd class="mt-1 font-700 text-ink">
              {{ generatedSession.theme }}
            </dd>
          </div>
          <div>
            <dt class="text-ink-muted">
              주요 지형
            </dt>
            <dd class="mt-1 font-700 text-ink">
              {{ generatedSession.terrain }}
            </dd>
          </div>
        </dl>

        <div class="mt-3">
          <p class="text-sm text-ink-muted">
            의뢰 사유
          </p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="token in generatedSession.reasonTokens"
              :key="token"
              data-role="reason-candidate"
              class="rounded-2 bg-canvas-soft px-2 py-1 text-sm font-600 text-ink"
            >
              {{ token }}
            </span>
          </div>
        </div>

        <div class="mt-3">
          <p class="text-sm text-ink-muted">
            몬스터 후보
          </p>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="monsterType in generatedSession.monsterTypes"
              :key="monsterType"
              class="rounded-2 border border-primary/30 bg-primary/10 px-2 py-1 text-sm font-600 text-primary"
            >
              {{ monsterType }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex min-h-48 items-center justify-center text-sm text-ink-muted"
      >
        생성하기를 누르면 세션 조합이 표시됩니다.
      </div>
    </UiPanel>
  </UiPanelDivider>
</template>
