# WebP 이미지 변환기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PNG와 JPG/JPEG 여러 파일을 브라우저에서 WebP로 변환하고 개별 또는 일괄 다운로드하는 앱을 만든다.

**Architecture:** 변환 대상의 상태와 Canvas 변환은 `app/utils/image-webp-converter.ts`에서 관리 가능한 순수 함수와 브라우저 변환 함수로 나눈다. `ImageWebpConverter.vue`는 파일 입력, 드롭 이벤트, 변환 대기열과 다운로드 UI를 담당하고, `/apps/image-webp-converter` 페이지는 이 컴포넌트만 조립한다.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, TypeScript, Canvas `toBlob`, Vitest, Vue Test Utils, class-variance-authority, Tailwind CSS 4.

## Global Constraints

- PNG, JPG, JPEG만 변환 대상으로 허용한다.
- 모든 변환은 서버 업로드 없이 브라우저 Canvas에서 `image/webp` Blob으로 처리한다.
- 품질 범위는 0.4~1, 기본값은 0.85다.
- 결과 파일명은 원본 확장자를 제거한 뒤 `.webp`를 붙인다.
- 페이지는 렌더링 컴포넌트만 조립하고, `app` 내부 import는 `~/` 별칭을 사용한다.
- 렌더링 및 UI 컴포넌트는 `cva`와 `cn` 구조를 사용하고 상호작용 함수 이름은 `on<액션><대상>` 형식으로 작성한다.
- Object URL은 항목 제거, 전체 초기화, 컴포넌트 해제 시 해제한다.
- ZIP 생성, 서버 저장, 크기 조절은 구현하지 않는다.

---

## 파일 구조

- Create: `app/data/image-webp-converter.data.ts` — 허용 MIME 형식과 기본 품질 상수
- Create: `app/data/image-webp-converter.types.ts` — 변환 상태와 대기열 항목 타입
- Create: `app/utils/image-webp-converter.ts` — 파일 판별, 결과명, 크기/절감률 계산, Canvas Blob 변환
- Create: `app/components/imageWebpConverter/ImageWebpConverter.vue` — 드롭 영역, 옵션, 대기열, 다운로드 UI
- Create: `app/pages/apps/image-webp-converter.vue` — 렌더링 컴포넌트 조립 전용 페이지
- Modify: `app/data/app-list.data.ts` — 새 앱 카드 등록
- Create: `test/image-webp-converter.test.ts` — 유틸리티 동작 테스트
- Create: `test/image-webp-converter-component.test.ts` — 파일 추가와 변환 대상 UI 테스트

### Task 1: 변환 도메인 유틸리티

**Files:**
- Create: `app/data/image-webp-converter.data.ts`
- Create: `app/data/image-webp-converter.types.ts`
- Create: `app/utils/image-webp-converter.ts`
- Test: `test/image-webp-converter.test.ts`

**Interfaces:**
- Produces: `isConvertibleImageFile(file: File): boolean`
- Produces: `getWebpOutputName(fileName: string): string`
- Produces: `formatFileSize(bytes: number): string`
- Produces: `getSavedPercent(sourceSize: number, outputSize: number): number`
- Produces: `convertImageFileToWebp(file: File, quality: number): Promise<Blob>`

- [ ] **Step 1: 입력 파일 판별과 출력 이름의 실패 테스트를 작성한다.**

```ts
import { describe, expect, it } from 'vitest';

import {
  getSavedPercent,
  getWebpOutputName,
  isConvertibleImageFile,
} from '~/utils/image-webp-converter';

describe('image-webp-converter', () => {
  it('accepts PNG, JPG, and JPEG files only', () => {
    expect(isConvertibleImageFile(new File(['png'], 'map.PNG', { type: 'image/png' }))).toBe(true);
    expect(isConvertibleImageFile(new File(['jpg'], 'portrait.jpg', { type: 'image/jpeg' }))).toBe(true);
    expect(isConvertibleImageFile(new File(['jpeg'], 'portrait.JPEG', { type: '' }))).toBe(true);
    expect(isConvertibleImageFile(new File(['gif'], 'motion.gif', { type: 'image/gif' }))).toBe(false);
  });

  it('creates a WebP output name and never reports a negative saving', () => {
    expect(getWebpOutputName('image.final.JPG')).toBe('image.final.webp');
    expect(getSavedPercent(100, 140)).toBe(0);
  });
});
```

- [ ] **Step 2: 실패를 확인한다.**

Run: `pnpm test -- test/image-webp-converter.test.ts`  
Expected: `Failed to resolve import "~/utils/image-webp-converter"` 또는 해당 export 누락으로 실패한다.

- [ ] **Step 3: 최소 데이터와 유틸리티 구현을 작성한다.**

```ts
// app/data/image-webp-converter.data.ts
export const convertibleImageMimeTypes = [
  'image/jpeg',
  'image/png',
] as const;

export const defaultImageWebpQuality = 0.85;

// app/utils/image-webp-converter.ts
import { convertibleImageMimeTypes } from '~/data/image-webp-converter.data';

export function isConvertibleImageFile(file: File): boolean {
  return convertibleImageMimeTypes.includes(file.type as typeof convertibleImageMimeTypes[number])
    || /\.(jpe?g|png)$/i.test(file.name);
}

export function getWebpOutputName(fileName: string): string {
  return `${fileName.replace(/\.(jpe?g|png)$/i, '')}.webp`;
}

export function getSavedPercent(sourceSize: number, outputSize: number): number {
  if (sourceSize <= 0 || outputSize <= 0) return 0;
  return Math.max(0, Math.round((1 - outputSize / sourceSize) * 100));
}
```

`formatFileSize`는 B/KB/MB/GB를 표시하고, `convertImageFileToWebp`는 `createImageBitmap` 우선·`Image` 대체 흐름으로 이미지를 읽은 뒤 Canvas `toBlob`의 `image/webp` 결과 Blob을 반환한다. Canvas context 또는 Blob이 없으면 한국어 오류를 throw한다.

- [ ] **Step 4: 유틸리티 테스트 통과를 확인한다.**

Run: `pnpm test -- test/image-webp-converter.test.ts`  
Expected: 2개 테스트가 통과한다.

- [ ] **Step 5: 첫 작업을 커밋한다.**

```bash
git add app/data/image-webp-converter.data.ts app/data/image-webp-converter.types.ts app/utils/image-webp-converter.ts test/image-webp-converter.test.ts
git commit -m "2026 0712 기능: WebP 변환 유틸리티 추가"
```

### Task 2: 변환기 화면과 대기열

**Files:**
- Create: `app/components/imageWebpConverter/ImageWebpConverter.vue`
- Test: `test/image-webp-converter-component.test.ts`

**Interfaces:**
- Consumes: `defaultImageWebpQuality`, `isConvertibleImageFile`, `getWebpOutputName`, `formatFileSize`, `getSavedPercent`, `convertImageFileToWebp`
- Produces: `ImageWebpConverter` 컴포넌트; `data-testid="image-file-input"`, `data-testid="convert-all"`, `data-testid="queue-item"`를 제공한다.

- [ ] **Step 1: 여러 파일 추가와 버튼 상태의 실패 UI 테스트를 작성한다.**

```ts
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ImageWebpConverter from '~/components/imageWebpConverter/ImageWebpConverter.vue';

describe('ImageWebpConverter', () => {
  it('queues PNG and JPG files but ignores unsupported files', async () => {
    const wrapper = mount(ImageWebpConverter);
    const input = wrapper.get('[data-testid="image-file-input"]');

    await input.trigger('change', {
      target: {
        files: [
          new File(['png'], 'map.png', { type: 'image/png' }),
          new File(['jpg'], 'portrait.jpg', { type: 'image/jpeg' }),
          new File(['gif'], 'motion.gif', { type: 'image/gif' }),
        ],
        value: '',
      },
    });

    expect(wrapper.findAll('[data-testid="queue-item"]')).toHaveLength(2);
    expect(wrapper.get('[data-testid="convert-all"]').attributes('disabled')).toBeUndefined();
  });
});
```

- [ ] **Step 2: 실패를 확인한다.**

Run: `pnpm test -- test/image-webp-converter-component.test.ts`  
Expected: `ImageWebpConverter.vue`를 찾지 못해 실패한다.

- [ ] **Step 3: 대기열 컴포넌트를 구현한다.**

`ImageWebpConverter.vue`에 다음을 구현한다.

```ts
type ConversionStatus = 'pending' | 'converting' | 'done' | 'error';

function onAddFiles(fileList: FileList | File[]) {
  const nextItems = Array.from(fileList)
    .filter(isConvertibleImageFile)
    .map((sourceFile) => ({
      errorMessage: null,
      id: crypto.randomUUID(),
      outputBlob: null,
      outputName: getWebpOutputName(sourceFile.name),
      outputUrl: null,
      sourceFile,
      sourceUrl: URL.createObjectURL(sourceFile),
      status: 'pending' as const,
    }));

  items.value.push(...nextItems);
}

async function onConvertAll() {
  const targets = items.value.filter((item) => item.status === 'pending' || item.status === 'error');
  for (const item of targets) await onConvertItem(item);
}
```

템플릿은 `cva`/`cn`으로 외곽 레이아웃을 만들고, 드롭 영역에 `dragenter`, `dragover`, `dragleave`, `drop` 이벤트를 연결한다. 옵션 카드에는 품질 range와 원본/완료 파일 수·원본 용량·절감률을 둔다. 목록에는 미리보기, 파일명, 상태, 오류, 개별 다운로드·삭제 버튼을 둔다. 완료 파일 모두 다운로드와 목록 비우기를 제공한다. `onRemoveItem`, `onClearAll`, `onBeforeUnmount`에서 각 항목의 원본·결과 Object URL을 해제한다.

- [ ] **Step 4: UI 테스트 통과를 확인한다.**

Run: `pnpm test -- test/image-webp-converter-component.test.ts`  
Expected: 1개 테스트가 통과한다.

- [ ] **Step 5: 두 번째 작업을 커밋한다.**

```bash
git add app/components/imageWebpConverter/ImageWebpConverter.vue test/image-webp-converter-component.test.ts
git commit -m "2026 0712 기능: WebP 이미지 변환 화면 추가"
```

### Task 3: 라우트와 앱 목록 연결

**Files:**
- Create: `app/pages/apps/image-webp-converter.vue`
- Modify: `app/data/app-list.data.ts`
- Test: `test/image-webp-converter-component.test.ts`

**Interfaces:**
- Consumes: `ImageWebpConverter`
- Produces: `/apps/image-webp-converter` 경로와 앱 목록의 `이미지 WebP 변환` 카드

- [ ] **Step 1: 목록 데이터와 라우트 조립의 실패 테스트를 추가한다.**

```ts
import { appListData } from '~/data/app-list.data';

it('registers the image WebP converter in the app list', () => {
  expect(appListData).toContainEqual(expect.objectContaining({
    name: '이미지 WebP 변환',
    url: '/apps/image-webp-converter',
  }));
});
```

- [ ] **Step 2: 실패를 확인한다.**

Run: `pnpm test -- test/image-webp-converter-component.test.ts`  
Expected: 새 앱 목록 항목이 없어 assertion이 실패한다.

- [ ] **Step 3: 목록과 페이지를 연결한다.**

```ts
// app/data/app-list.data.ts에 추가
{
  name: '이미지 WebP 변환',
  description: 'PNG와 JPG 이미지를 WebP로 일괄 변환합니다.',
  icon: 'material-symbols:image',
  url: '/apps/image-webp-converter',
},
```

```vue
<!-- app/pages/apps/image-webp-converter.vue -->
<script setup lang="ts">
import ImageWebpConverter from '~/components/imageWebpConverter/ImageWebpConverter.vue';
</script>

<template>
  <ImageWebpConverter />
</template>
```

- [ ] **Step 4: 전체 대상 테스트를 통과시킨다.**

Run: `pnpm test -- test/image-webp-converter.test.ts test/image-webp-converter-component.test.ts`  
Expected: 모든 테스트가 통과한다.

- [ ] **Step 5: 전체 검증을 실행한다.**

Run: `pnpm lint`  
Expected: 종료 코드 0.

Run: `pnpm test`  
Expected: 종료 코드 0.

Run: `pnpm build`  
Expected: 종료 코드 0.

- [ ] **Step 6: 세 번째 작업을 커밋한다.**

```bash
git add app/data/app-list.data.ts app/pages/apps/image-webp-converter.vue test/image-webp-converter-component.test.ts
git commit -m "2026 0712 기능: WebP 변환 앱 연결"
```

## 자체 점검

- 명세의 파일 형식, 다중 선택, 드래그 앤 드롭, 품질 조절, 상태, 개별/일괄 다운로드, 삭제, 용량과 절감률, Object URL 해제는 Task 1~3에 모두 연결했다.
- 서버 업로드와 ZIP 생성, 편집 기능은 어떤 작업에도 포함하지 않았다.
- 경로, 함수명, 타입, 명령어는 각 작업에서 명시했고 미정 요구사항을 남기지 않았다.
