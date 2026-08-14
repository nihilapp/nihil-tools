# Password Hash Tester Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 문자열의 고정 해시와 비밀번호 해시를 생성하고 기존 해시를 비교하는 테스트 전용 앱을 만든다.

**Architecture:** Vue 화면은 입력, 알고리즘별 옵션, 결과 상태만 관리하고 Nuxt API에 Hash 또는 Compare 요청을 보낸다. 서버 유틸리티는 입력 검증, Node 고정 해시, bcrypt·argon2id 생성과 비교를 한 곳에서 제공하며 API 라우트는 요청 본문과 no-store 응답 헤더만 담당한다.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Node `crypto`, `bcryptjs`, `argon2`, Vitest, Vue Test Utils, happy-dom.

## Global Constraints

- 제공 알고리즘은 `MD5`, `SHA-1`, `SHA-256`, `SHA-512`, `bcrypt`, `argon2id`로 한정한다.
- MD5와 SHA-1은 레거시이며 비밀번호 저장에 사용하면 안 된다는 경고를 항상 표시한다.
- 원문과 해시를 데이터베이스, 파일, 브라우저 저장소, URL, 애플리케이션 로그에 기록하지 않는다.
- Hash와 Compare API 응답은 `Cache-Control: no-store`를 설정한다.
- `app` 내부 import는 `~/` 별칭, `server` 내부 import는 `~~/server/` 별칭을 사용한다.
- 페이지는 렌더링 컴포넌트를 조립만 하며, UI는 `cva`와 `cn` 및 기존 `UiPanel` 원시 컴포넌트를 사용한다.
- 모든 상호작용 함수 이름은 `on<액션><대상>` 형식을 사용한다.

---

## File Structure

- Create: `app/types/password-hash-tester.ts` — 클라이언트와 API가 공유하는 알고리즘, 요청, 결과 타입.
- Create: `app/data/password-hash-tester.data.ts` — UI 레이블, 레거시 경고, bcrypt·argon2id 기본값과 허용 범위.
- Create: `server/utils/password-hash-tester.ts` — 검증, 해시 생성, 비교, 해시 형식 감지.
- Create: `server/api/password-hash/hash.post.ts` — Hash POST API와 no-store 응답.
- Create: `server/api/password-hash/compare.post.ts` — Compare POST API와 no-store 응답.
- Create: `app/components/passwordHashTester/PasswordHashTester.vue` — Hash/Compare 패널과 API 상태 화면.
- Create: `app/pages/apps/password-hash-tester.vue` — 메타데이터와 렌더링 컴포넌트 조립.
- Modify: `app/data/app-list.data.ts` — 도구 목록 등록.
- Modify: `package.json`, `pnpm-lock.yaml` — 서버 해시 의존성 추가.
- Create: `test/server/password-hash-tester.test.ts` — 고정 해시, 비밀번호 해시, 검증 실패 테스트.
- Create: `test/components/PasswordHashTester.test.ts` — UI 입력·옵션·Hash/Compare 상태 테스트.

### Task 1: 해시 도메인 계약과 검증 유틸리티

**Files:**
- Create: `app/types/password-hash-tester.ts`
- Create: `app/data/password-hash-tester.data.ts`
- Create: `server/utils/password-hash-tester.ts`
- Test: `test/server/password-hash-tester.test.ts`

**Interfaces:**
- Produces: `PasswordHashAlgorithm`, `HashRequest`, `CompareRequest`, `HashResult`, `CompareResult`.
- Produces: `createPasswordHash(request: HashRequest): Promise<HashResult>` and `comparePasswordHash(request: CompareRequest): Promise<CompareResult>`.
- Produces: `detectPasswordHashAlgorithm(hash: string): 'bcrypt' | 'argon2id' | null`.

- [ ] **Step 1: Write failing server utility tests**

```ts
import { describe, expect, it } from 'vitest';
import {
  comparePasswordHash,
  createPasswordHash,
  detectPasswordHashAlgorithm,
} from '~~/server/utils/password-hash-tester';

describe('password hash tester', () => {
  it('creates known deterministic SHA-256 output', async () => {
    await expect(createPasswordHash({ algorithm: 'sha256', value: 'hello' }))
      .resolves.toMatchObject({ hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' });
  });

  it('creates distinct bcrypt hashes that both compare to the source', async () => {
    const first = await createPasswordHash({ algorithm: 'bcrypt', value: 'hello', bcryptCost: 4 });
    const second = await createPasswordHash({ algorithm: 'bcrypt', value: 'hello', bcryptCost: 4 });

    expect(first.hash).not.toBe(second.hash);
    await expect(comparePasswordHash({ algorithm: 'bcrypt', value: 'hello', hash: first.hash })).resolves.toMatchObject({ matched: true });
  });

  it('rejects empty values and malformed password hashes', async () => {
    await expect(createPasswordHash({ algorithm: 'sha256', value: '' })).rejects.toThrow('문자열을 입력해 주세요.');
    await expect(comparePasswordHash({ algorithm: 'bcrypt', value: 'hello', hash: 'invalid' })).rejects.toThrow('해시 형식이 올바르지 않습니다.');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run test/server/password-hash-tester.test.ts`

Expected: FAIL because `~~/server/utils/password-hash-tester` does not exist.

- [ ] **Step 3: Define shared types and static data**

```ts
export type PasswordHashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'bcrypt' | 'argon2id';

export interface HashRequest {
  algorithm: PasswordHashAlgorithm
  value: string
  bcryptCost?: number
  argon2MemoryCost?: number
  argon2TimeCost?: number
  argon2Parallelism?: number
}

export interface CompareRequest {
  algorithm: PasswordHashAlgorithm
  value: string
  hash: string
}
```

Export fixed-hash labels, the legacy warning, `bcryptCost: 12`, and argon2id defaults of memory `19456`, time `2`, parallelism `1`. Export explicit numeric bounds so the server and UI use the same values.

- [ ] **Step 4: Implement the minimal server utility**

```ts
export async function createPasswordHash(request: HashRequest): Promise<HashResult> {
  assertHashValue(request.value);

  if (isFixedAlgorithm(request.algorithm)) {
    return { algorithm: request.algorithm, hash: createHash(request.algorithm).update(request.value, 'utf8').digest('hex') };
  }

  if (request.algorithm === 'bcrypt') {
    return { algorithm: 'bcrypt', hash: await bcrypt.hash(request.value, validateBcryptCost(request.bcryptCost)) };
  }

  return { algorithm: 'argon2id', hash: await argon2.hash(request.value, buildArgon2Options(request)) };
}
```

Use Node `timingSafeEqual` only after confirming fixed-hash strings have the same byte length. For bcrypt/argon2id, validate their identifying prefix before calling the library comparison function. Throw Korean `Error` messages for empty input, unsupported algorithms, invalid option ranges, and malformed hashes.

- [ ] **Step 5: Run the focused utility tests**

Run: `pnpm vitest run test/server/password-hash-tester.test.ts`

Expected: PASS. Add assertions for MD5/SHA-1/SHA-512, argon2id same-source match and different-source mismatch, and `$2a$`/`$2b$` plus `$argon2id$` detection before marking this step complete.

- [ ] **Step 6: Commit the domain layer**

```bash
git add app/types/password-hash-tester.ts app/data/password-hash-tester.data.ts server/utils/password-hash-tester.ts test/server/password-hash-tester.test.ts
git commit -m "2026 0814 [feat]: 해시 테스트 도메인 로직 추가"
```

### Task 2: no-store Hash·Compare API 추가

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `server/api/password-hash/hash.post.ts`
- Create: `server/api/password-hash/compare.post.ts`
- Test: `test/server/password-hash-tester.test.ts`

**Interfaces:**
- Consumes: `createPasswordHash`, `comparePasswordHash`, `HashRequest`, `CompareRequest` from Task 1.
- Produces: `POST /api/password-hash/hash` and `POST /api/password-hash/compare`.

- [ ] **Step 1: Add server hashing dependencies**

Run: `pnpm add bcryptjs argon2`

Add `@types/bcryptjs` only if the installed package does not expose TypeScript declarations. Do not add client-side hashing packages.

- [ ] **Step 2: Write failing API-behavior tests**

Extend the Task 1 test to pass parsed request objects to the same service boundary used by both routes. Assert that a valid request returns `{ algorithm, hash }`, an invalid JSON shape returns the message `요청 형식이 올바르지 않습니다.`, and neither result type includes the submitted `value` property.

```ts
expect(await createHashResponse({ algorithm: 'sha256', value: 'hello' }))
  .toEqual({ algorithm: 'sha256', hash: expect.any(String) });
expect(await compareHashResponse({ algorithm: 'sha256', value: 'hello', hash: 'invalid' }))
  .toEqual({ algorithm: 'sha256', matched: false });
```

- [ ] **Step 3: Implement thin request handlers**

```ts
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');
  const body = await readBody<unknown>(event);

  return createHashResponse(body);
});
```

Create `createHashResponse` and `compareHashResponse` in the server utility so raw-body validation is testable without an HTTP server. Return `createError({ statusCode: 400, statusMessage: message })` from each handler when the utility rejects input. Do not call `console.log`, persistence APIs, or request logging with the body.

- [ ] **Step 4: Run API-boundary and package checks**

Run: `pnpm vitest run test/server/password-hash-tester.test.ts && pnpm exec nuxi typecheck`

Expected: PASS with the new dependency types resolved and all utility/API contract assertions passing.

- [ ] **Step 5: Commit the API layer**

```bash
git add package.json pnpm-lock.yaml server/api/password-hash/hash.post.ts server/api/password-hash/compare.post.ts server/utils/password-hash-tester.ts test/server/password-hash-tester.test.ts
git commit -m "2026 0814 [feat]: 해시 테스트 API 추가"
```

### Task 3: Hash·Compare 화면 및 도구 등록

**Files:**
- Create: `app/components/passwordHashTester/PasswordHashTester.vue`
- Create: `app/pages/apps/password-hash-tester.vue`
- Modify: `app/data/app-list.data.ts`
- Test: `test/components/PasswordHashTester.test.ts`

**Interfaces:**
- Consumes: Task 1 algorithm data and `POST /api/password-hash/hash`, `POST /api/password-hash/compare`.
- Produces: `/apps/password-hash-tester` route and `/apps` navigation entry.

- [ ] **Step 1: Write failing component tests**

```ts
it('shows bcrypt options only for bcrypt and sends a hash request', async () => {
  const wrapper = mount(PasswordHashTester, { global: { stubs: { UiPanel: true, UiPanelDivider: true } } });

  await wrapper.get('[data-testid="hash-value"]').setValue('hello');
  await wrapper.get('[data-testid="hash-algorithm"]').setValue('bcrypt');
  expect(wrapper.get('[data-testid="bcrypt-cost"]').exists()).toBe(true);

  await wrapper.get('[data-testid="hash-submit"]').trigger('click');
  expect(globalThis.$fetch).toHaveBeenCalledWith('/api/password-hash/hash', expect.objectContaining({ method: 'POST' }));
});
```

Mock `$fetch` to resolve Hash and Compare success payloads. Add tests for MD5/SHA-1 legacy warning, argon2id option visibility, compare matched and unmatched copy, invalid API response message, and clipboard fallback preserving the visible read-only result.

- [ ] **Step 2: Run the component test to verify it fails**

Run: `pnpm vitest run test/components/PasswordHashTester.test.ts`

Expected: FAIL because `PasswordHashTester.vue` does not exist.

- [ ] **Step 3: Implement the rendering component**

Create a `cva` root with `flex h-full min-h-0 flex-col gap-2 overflow-hidden`, then use two `UiPanel` children in a column `UiPanelDivider`.

```vue
<form @submit.prevent="onSubmitHash">
  <UiInput v-model="hashValue" label="문자열" />
  <UiSelect v-model="hashAlgorithm" :options="hashAlgorithmOptions" label="해시 방식" />
  <UiButton data-testid="hash-submit" type="submit" variant="primary" :loading="isHashing">해시 생성</UiButton>
</form>
```

Use `UiTextarea` for source and existing hash input, but add a password/text visibility toggle with a native input only where the existing primitive cannot set `type="password"`. Render a read-only `<textarea>` for generated output and place the copy button beside it. On every submit, clear only that form's previous error and result before awaiting `$fetch`; never persist reactive state to storage.

Use the response result shape exactly: Hash shows `hash` and setting summary; Compare shows `matched === true` as `일치`, `matched === false` as `불일치`. API `400` messages must be shown as input-area errors, not generic success-like result cards.

- [ ] **Step 4: Register page metadata and app navigation**

```ts
useSetMeta({
  title: '비밀번호 해시 테스트',
  url: '/apps/password-hash-tester',
  description: '문자열을 여러 해시 방식으로 변환하고 기존 해시와 비교합니다.',
  keywords: '비밀번호 해시, bcrypt, argon2id, SHA-256, 해시 비교',
});
```

Add a navigation item named `비밀번호 해시 테스트`, description `문자열을 해시하고 기존 해시와 일치 여부를 확인합니다.`, icon `material-symbols:password`, and URL `/password-hash-tester`.

- [ ] **Step 5: Run focused UI tests and browser smoke test**

Run: `pnpm vitest run test/components/PasswordHashTester.test.ts && pnpm dev`

Expected: tests PASS; in the browser, open `/apps/password-hash-tester`, generate SHA-256 for `hello`, generate bcrypt twice to confirm different strings, and compare each bcrypt result with `hello` to confirm `일치`.

- [ ] **Step 6: Commit the interface**

```bash
git add app/components/passwordHashTester/PasswordHashTester.vue app/pages/apps/password-hash-tester.vue app/data/app-list.data.ts test/components/PasswordHashTester.test.ts
git commit -m "2026 0814 [feat]: 비밀번호 해시 테스트 화면 추가"
```

### Task 4: 전체 검증과 문서 동기화

**Files:**
- Modify: `README.md` — 앱 목록 또는 도구 안내가 있다면 새 도구와 테스트 전용·비저장 성격을 한 줄로 추가한다.
- Verify: `package.json`, `app`, `server`, `test`

**Interfaces:**
- Consumes: Tasks 1–3의 전체 구현.
- Produces: 빌드 가능한 도구와 재현 가능한 검증 증거.

- [ ] **Step 1: Check README inclusion point**

Run: `rg -n "도구|앱|WebP|주사위" README.md`

Expected: 새 도구를 한 줄로 추가할 기존 앱 목록 또는 안내 위치를 찾는다. 위치가 없으면 README를 변경하지 않고 이 판단을 커밋 메시지에 포함하지 않는다.

- [ ] **Step 2: Run the complete automated suite**

Run: `pnpm test && pnpm lint && pnpm build`

Expected: all tests, lint, and Nuxt production build PASS. If a pre-existing lint failure appears outside the touched files, record its exact path and rule separately; do not modify unrelated files.

- [ ] **Step 3: Perform manual security and behavior checks**

Verify all of the following in the browser and server output:

```text
1. Network responses for both POST endpoints include Cache-Control: no-store.
2. URL never includes source string or hash value.
3. Reloading the page clears previous input and result state.
4. Browser localStorage and sessionStorage have no password-hash tester entries.
5. The server terminal does not print source string or hash value.
```

- [ ] **Step 4: Commit documentation or verification-only changes**

```bash
git add README.md
git commit -m "2026 0814 [docs]: 해시 테스트 도구 안내 추가"
```

Run this commit only when Step 1 changed `README.md`; otherwise leave the implementation commits unchanged and report the verification result.
