<script setup lang="ts">
import { ref } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiCheckbox from '~/components/ui/UiCheckbox.vue';
import UiCard from '~/components/ui/UiCard.vue';
import UiInput from '~/components/ui/UiInput.vue';
import UiPanel from '~/components/ui/UiPanel.vue';
import UiPanelDivider from '~/components/ui/UiPanelDivider.vue';
import UiRadioGroup from '~/components/ui/UiRadioGroup.vue';
import UiSection from '~/components/ui/UiSection.vue';
import UiSelect from '~/components/ui/UiSelect.vue';
import UiTextarea from '~/components/ui/UiTextarea.vue';

const inputValue = ref('');
const textareaValue = ref('');
const selectValue = ref('default');
const checkboxValue = ref(false);
const radioValue = ref('comfortable');

const buttonVariants = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'danger',
] as const;

const navigationItems = [
  { href: '#tokens', label: '토큰' },
  { href: '#buttons', label: '버튼' },
  { href: '#inputs', label: '입력' },
  { href: '#choices', label: '선택' },
  { href: '#feedback', label: '피드백' },
  { href: '#layout', label: '레이아웃' },
];

const selectOptions = [
  { label: '기본 선택지', value: 'default' },
  { label: '다른 선택지', value: 'alternative' },
  { disabled: true, label: '비활성 선택지', value: 'disabled' },
];

const radioOptions = [
  { label: '여유 있게', value: 'comfortable' },
  { label: '조밀하게', value: 'compact' },
  { disabled: true, label: '사용 불가', value: 'unavailable' },
];

const tokenItems = [
  { class: 'bg-canvas', label: 'Canvas', value: 'canvas' },
  { class: 'bg-canvas-soft', label: 'Canvas soft', value: 'canvas-soft' },
  { class: 'bg-surface', label: 'Surface', value: 'surface' },
  { class: 'bg-ink', label: 'Ink', value: 'ink' },
  { class: 'bg-ink-muted', label: 'Ink muted', value: 'ink-muted' },
  { class: 'bg-hairline', label: 'Hairline', value: 'hairline' },
  { class: 'bg-primary', label: 'Primary', value: 'primary' },
  { class: 'bg-danger', label: 'Danger', value: 'danger' },
];
</script>

<template>
  <main class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
    <header class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <p class="text-sm font-600 text-primary">Development</p>
        <h1 class="text-h2 font-700 tracking-tight text-ink">스타일 카탈로그</h1>
        <p class="text-sm text-ink-muted">
          공용 UI 컴포넌트와 상태를 한 화면에서 비교하는 개발용 페이지입니다.
        </p>
      </div>
      <nav
        aria-label="스타일 카탈로그 섹션"
        class="flex flex-wrap gap-2"
      >
        <a
          v-for="item in navigationItems"
          :key="item.href"
          :href="item.href"
          class="rounded-2 border border-hairline bg-surface px-2 py-1 text-sm text-ink transition-colors hover:bg-canvas-soft"
        >{{ item.label }}</a>
      </nav>
    </header>

    <UiSection
      id="tokens"
      title="토큰"
      description="공용 색상, 기본 간격, 모서리 규칙입니다."
    >
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <UiCard
          v-for="token in tokenItems"
          :key="token.value"
          padding="sm"
        >
          <div
            :class="token.class"
            class="h-12 rounded-2 border border-hairline"
          />
          <div class="mt-2 flex items-center justify-between gap-2 text-sm">
            <span class="font-600 text-ink">{{ token.label }}</span>
            <code class="text-ink-muted">{{ token.value }}</code>
          </div>
        </UiCard>
      </div>
      <div class="grid gap-3 md:grid-cols-2">
        <UiCard padding="sm">
          <p class="text-sm font-600 text-ink">기본 간격</p>
          <div class="mt-2 flex items-end gap-2">
            <span class="h-2 w-2 bg-primary" />
            <span class="h-4 w-4 bg-primary" />
            <span class="h-6 w-6 bg-primary" />
            <span class="h-8 w-8 bg-primary" />
          </div>
        </UiCard>
        <UiCard padding="sm">
          <p class="text-sm font-600 text-ink">기본 모서리</p>
          <div class="mt-2 h-8 w-full rounded-2 border border-primary bg-primary/10" />
        </UiCard>
      </div>
    </UiSection>

    <UiSection
      id="buttons"
      title="버튼"
      description="모든 버튼 변형과 크기, 비활성 및 로딩 상태입니다."
    >
      <UiCard class="flex flex-col gap-4">
        <div
          v-for="size in ['sm', 'md'] as const"
          :key="size"
          class="flex flex-wrap items-center gap-2"
        >
          <UiButton
            v-for="variant in buttonVariants"
            :key="variant"
            :size="size"
            :variant="variant"
          >{{ variant.charAt(0).toUpperCase() + variant.slice(1) }}</UiButton>
        </div>
        <div class="flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
          <UiButton disabled>비활성</UiButton>
          <UiButton loading>로딩 중</UiButton>
        </div>
      </UiCard>
    </UiSection>

    <UiSection
      id="inputs"
      title="입력"
      description="한 줄과 여러 줄 입력의 기본, 라벨, 오류 상태입니다."
    >
      <div class="grid gap-3 md:grid-cols-2">
        <UiCard class="flex flex-col gap-3">
          <UiInput
            v-model="inputValue"
            label="기본 입력"
          />
          <UiInput
            label="오류 입력"
            error="값을 입력하세요."
          />
        </UiCard>
        <UiCard class="flex flex-col gap-3">
          <UiTextarea
            v-model="textareaValue"
            label="기본 텍스트 영역"
            placeholder="여러 줄 내용을 입력하세요."
          />
          <UiTextarea
            label="오류 텍스트 영역"
            error="설명을 입력하세요."
          />
        </UiCard>
      </div>
    </UiSection>

    <UiSection
      id="choices"
      title="선택"
      description="선택 상자, 체크박스, 라디오 그룹의 상태입니다."
    >
      <div class="grid gap-3 md:grid-cols-3">
        <UiCard>
          <UiSelect
            v-model="selectValue"
            label="선택 상자"
            :options="selectOptions"
          />
        </UiCard>
        <UiCard>
          <UiCheckbox
            v-model="checkboxValue"
            label="알림을 받습니다"
          />
        </UiCard>
        <UiCard>
          <UiRadioGroup
            v-model="radioValue"
            label="밀도"
            :options="radioOptions"
          />
        </UiCard>
      </div>
    </UiSection>

    <UiSection
      id="feedback"
      title="피드백"
      description="입력 오류와 사용할 수 없는 컨트롤의 표현입니다."
    >
      <UiCard class="grid gap-3 md:grid-cols-3">
        <UiInput
          label="필수 값"
          error="필수 항목입니다."
        />
        <UiTextarea
          label="필수 설명"
          error="설명을 입력하세요."
        />
        <div class="flex flex-col gap-3">
          <UiCheckbox
            disabled
            label="비활성 체크박스"
          />
          <UiButton disabled>비활성 버튼</UiButton>
        </div>
      </UiCard>
    </UiSection>

    <UiSection
      id="layout"
      title="레이아웃"
      description="중첩 가능한 패널 디바이더와 표면 전용 카드를 조합합니다."
    >
      <UiPanelDivider
        direction="column"
        class="min-h-96"
      >
        <UiPanel
          role="section"
          :width="1"
          background="soft"
        >
          <p class="text-sm font-600 text-ink">상단 패널 · 1 비율</p>
          <p class="mt-1 text-sm text-ink-muted">
            세로 디바이더 안에서 폭을 지정하지 않은 항목은 모두 같은 flex 비율을 사용합니다.
          </p>
        </UiPanel>

        <UiPanelDivider
          direction="row"
          :width="2"
        >
          <UiPanel
            role="main"
            :width="3"
          >
            <p class="text-sm font-600 text-ink">중첩 패널 분할 · Main 3 비율</p>
            <p class="mt-1 text-sm text-ink-muted">
              하단 디바이더는 상위에서 2 비율을 차지하고, 내부에서는 다시 3:1로 나뉩니다.
            </p>
            <UiCard class="mt-3">
              <p class="text-sm font-600 text-ink">UiCard</p>
              <p class="mt-1 text-sm text-ink-muted">카드는 패널 안의 표면 콘텐츠 단위입니다.</p>
            </UiCard>
          </UiPanel>

          <UiPanel
            role="aside"
            :width="1"
            background="soft"
          >
            <p class="text-sm font-600 text-ink">Aside 1 비율</p>
            <div class="mt-3 flex flex-col gap-2">
              <UiButton size="sm">작업</UiButton>
              <UiButton
                size="sm"
                variant="outline"
              >보조 작업</UiButton>
            </div>
          </UiPanel>
        </UiPanelDivider>
      </UiPanelDivider>
    </UiSection>
  </main>
</template>
