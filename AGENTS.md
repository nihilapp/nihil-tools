# AGENTS.md

## 목적

- 이 문서는 `nihil-tools` 작업 시 따르는 기본 규칙을 정리한 문서다.
- 규칙은 프로젝트 진행에 따라 계속 추가될 수 있다.

## 디렉터리 구조

### 루트

- 기본 루트 구조는 `app`, `server`, `public`를 사용한다.

### app

- `app` 내부 기본 구조는 `assets`, `components`, `composables`, `config`, `data`, `layouts`, `pages`, `types`, `utils`를 사용한다.

### data

- 앱 내부에서 직접 사용하는 정적 데이터는 `data`에 둔다.
- DB까지는 아니더라도 앱에서 참조하는 데이터는 우선 `data`를 사용한다.
- 파일명은 `<name>.data.ts` 형식으로 통일한다.

### config

- 설정성 값이 필요한 경우 `config`에 둔다.

### assets/styles

- `app/assets/styles`에는 커스텀 Tailwind 규칙이 들어 있다.
- 디자인 작업 시 이 경로를 항상 먼저 참고한다.

## import 규칙

- `app` 내부 코드와 테스트에서 앱 소스는 `~/` 별칭으로 import한다. 예: `~/utils/cn`, `~/data/example.data`.
- `server` 내부 코드와 테스트에서 서버 소스는 `~~/server/` 별칭으로 import한다. 예: `~~/server/utils/example`.
- `../` 또는 `../../` 같은 상위 상대 경로 import는 사용하지 않는다.

## 페이지 작성 규칙

- 페이지 컴포넌트는 직접 UI를 구성하지 않는다.
- 모든 페이지는 렌더링 컴포넌트를 import해서 조립하는 역할만 맡는다.
- 예를 들어 홈 화면은 별도 `Home` 렌더링 컴포넌트를 만들고, `pages/index.vue`에서는 해당 컴포넌트를 불러와 사용한다.

## 컴포넌트 작성 규칙

- 모든 렌더링 컴포넌트와 UI 컴포넌트는 `cva` 구조를 따른다.
- 템플릿에서는 `utils/cn`을 적극적으로 사용한다.
- 기본 `cva` 구조는 아래 형태를 기준으로 유지한다.

```ts
const cssVariants = cva(
  [
    '',
  ],
  {
    variants: {},
    compoundVariants: [

    ],
    defaultVariants: {},
  },
);
```

```html
<header
  :class="cn([
    cssVariants({}),
    props.class,
  ])"
>
```

## 명명 규칙

- 모든 상호작용 함수 이름은 `on<액션><대상>` 형식을 사용한다.
- `handle` 같은 명칭은 사용하지 않는다.

## 라이브러리 규칙

- 시간 관련 처리는 웬만하면 `luxon`을 사용한다.
