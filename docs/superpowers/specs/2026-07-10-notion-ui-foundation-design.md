# Notion UI Foundation Design

## Goal

`nihil-tools` 전체에서 재사용할 Notion 계열의 차분한 작업 도구 UI 기반을 만든다. Notion의 기능이나 화면 구조를 복제하지 않고, 밝은 문서형 캔버스, 흰 표면, 얇은 경계, 하나의 파란 행동색, 8px 라운드, 컴팩트한 입력 밀도만 디자인 언어로 가져온다.

첫 구현 대상은 공용 토큰, UI 프리미티브, 공용 레이아웃, 앱 목록 및 장소 이름 생성기 화면이다. 향후 도구 화면은 같은 프리미티브를 조합해 구현한다.

## Scope

### Include

- 의미 기반 색상, 크기, 그림자, 포커스 토큰
- 섹션, 표면, 툴바, 빈 상태
- 버튼, 아이콘 버튼, 입력, 텍스트영역, 드롭다운, 체크박스, 라디오 그룹, 스위치
- 선택 그룹, 태그, 배지, 탭
- 공용 헤더, 콘텐츠 영역, 푸터
- 얇은 페이지 래퍼와 렌더링 뷰 분리
- 앱 목록과 장소 이름 생성기 화면의 공용 UI 전환

### Exclude

- Notion의 내비게이션, 편집기, 데이터베이스, 블록 모델 복제
- 아직 사용처가 없는 데이터 테이블, 대화상자, 필터 빌더, 파일 업로드 컴포넌트
- 새로운 디자인 라이브러리 추가
- 애플리케이션별 생성 규칙 또는 데이터 구조 변경

## Design Rules

- 페이지 배경은 따뜻한 밝은 캔버스이며, 작업 영역은 흰 표면과 1px 경계로 구분한다.
- 구조적 강조는 파란색 하나만 사용한다. 다색은 상태나 도메인 데이터를 표현해야 할 때만 제한적으로 사용한다.
- 카드, 버튼, 입력, 메뉴, 태그의 기본 라운드는 8px이다.
- 글자 간격은 항상 `0`으로 둔다. `DESIGN-notion.md`의 음수 자간은 이 프로젝트에 적용하지 않는다.
- UI는 설명보다 행동과 결과를 우선한다. 특히 도구 화면의 결과는 가능한 한 빠르게 보인다.
- 모든 상호작용 함수는 `on<액션><대상>` 형식으로 이름을 짓는다.
- 렌더링 및 UI 컴포넌트는 `cva`와 `cn`을 사용한다.

## Token Layer

`app/assets/styles`에 기존 범용 팔레트를 유지한 채 의미 기반 토큰을 추가한다.

| Token group | Purpose |
| --- | --- |
| `canvas`, `canvas-soft`, `surface` | 앱 배경과 표면 계층 |
| `ink`, `ink-secondary`, `ink-muted`, `ink-faint` | 본문 및 보조 텍스트 |
| `hairline` | 경계와 구분선 |
| `primary`, `primary-active`, `on-primary` | 주 동작과 활성 상태 |
| `focus`, `danger`, `success` | 접근성 및 의미 상태 |
| `shadow-surface`, `shadow-overlay` | 표면과 오버레이의 미세한 깊이 |

토큰은 Tailwind 4에서 사용할 수 있도록 `@theme`으로 선언한다. 기존 `black-*`, `blue-*` 클래스를 즉시 제거하지 않으며, 화면 전환 시 의미 토큰으로 교체한다.

## Component Architecture

공용 프리미티브는 `app/components/ui/`에 둔다. 컴포넌트는 하나의 조작 또는 표현 책임만 가지며, 앱별 상태와 비즈니스 로직을 갖지 않는다.

### Layout and Surface

| Component | Responsibility | Key API |
| --- | --- | --- |
| `UiSection` | 제목, 선택적 설명, 헤더 액션, 본문, 선택적 푸터를 갖는 기본 작업 영역 | `title`, `description`, `tone`, `header-actions`, `default`, `footer` slots |
| `UiSurface` | 카드와 패널의 경계, 배경, 여백, 높이 변형 제공 | `variant: default | soft | outlined`, `padding` |
| `UiToolbar` | 다수의 버튼과 폼 조작을 줄바꿈 가능한 밀도 높은 영역에 정렬 | `align`, `default` slot |
| `UiEmptyState` | 결과 없음, 초기 상태, 사용 불가 상태를 일관되게 표현 | `title`, `description`, `icon`, `action` slot |

### Actions and Selection

| Component | Responsibility | Key API |
| --- | --- | --- |
| `UiButton` | 텍스트 기반 명령 실행 | `variant`, `size`, `loading`, `disabled`, `type` |
| `UiIconButton` | 도구 모음과 행 단위의 아이콘 명령 | `label`, `icon`, `variant`, `size`, `disabled` |
| `UiChoiceGroup` | 세그먼트 또는 칩 기반 단일/다중 선택 | `modelValue`, `options`, `multiple`, `appearance` |
| `UiTabs` | 같은 화면 안의 배타적 뷰 전환 | `modelValue`, `items` |
| `UiTag` | 제거 가능하거나 선택 가능한 분류/필터 항목 | `label`, `selected`, `removable`, `tone` |
| `UiBadge` | 읽기 전용 상태 및 개수 표현 | `tone`, `size` |

### Form Controls

| Component | Responsibility | Key API |
| --- | --- | --- |
| `UiInput` | 한 줄 텍스트 및 숫자 입력 | `modelValue`, `label`, `hint`, `error`, `type` |
| `UiTextarea` | 여러 줄 텍스트 입력 | `modelValue`, `label`, `hint`, `error`, `rows` |
| `UiSelect` | 옵션 목록 중 하나 선택 | `modelValue`, `label`, `options`, `placeholder`, `error` |
| `UiCheckbox` | 독립적인 불리언 설정 | `modelValue`, `label`, `description`, `disabled` |
| `UiRadioGroup` | 소수의 상호 배타적 옵션 선택 | `modelValue`, `label`, `options`, `error` |
| `UiSwitch` | 즉시 반영되는 불리언 설정 | `modelValue`, `label`, `description`, `disabled` |

모든 폼 컴포넌트는 `v-model`을 지원하고, 입력 이름, 보조 설명, 오류 메시지, 비활성 상태, 키보드 포커스 상태를 일관되게 제공한다. 레이블이 시각적으로 불필요한 경우에도 접근 가능한 이름을 제공할 수 있어야 한다.

## Visual States

- 기본: 흰 배경, `hairline` 경계, 잉크 텍스트
- Hover: 배경은 과도하게 바꾸지 않고 경계 또는 텍스트만 미세하게 강조
- Focus: 모든 조작 요소에 파란색 포커스 링
- Selected: 파란 경계 또는 연한 파란 표면으로 선택 상태 전달
- Disabled: 낮은 대비의 표면과 텍스트, 명확한 비활성 커서
- Error: 입력 하단 오류 문구와 오류 경계, 색상만으로 오류를 전달하지 않음
- Loading: 버튼 폭을 유지하고 레이블 대신 진행 표식을 표시하거나 함께 표시

## Page Composition

`app/pages/`는 경로 해석, 데이터 준비, 메타 설정, 렌더링 컴포넌트 조립만 수행한다. 화면 UI와 상호작용 상태는 `app/components/views/`로 옮긴다.

| Current file | Target rendering component |
| --- | --- |
| `app/pages/apps/index.vue` | `app/components/views/AppListView.vue` |
| `app/pages/apps/[id].vue` | `app/components/views/AppDetailView.vue` |
| 장소 이름 생성기 분기 | `app/components/views/PlaceNameGeneratorView.vue` |
| 미구현 앱 안내 | `app/components/views/AppPlaceholderView.vue` |

`AppDetailView`는 앱 식별자에 따라 뷰를 선택하거나 해당 책임을 별도 라우팅 구성으로 옮긴다. 장소 이름 생성기의 생성 상태와 `onGeneratePlaceNames`는 `PlaceNameGeneratorView`가 소유한다.

## Delivery Order

1. 의미 토큰과 공통 base 스타일을 추가한다.
2. `UiSurface`, `UiSection`, `UiButton`, `UiIconButton`을 만든다.
3. `UiInput`, `UiTextarea`, `UiSelect`, `UiCheckbox`, `UiRadioGroup`, `UiSwitch`을 만든다.
4. `UiChoiceGroup`, `UiTag`, `UiBadge`, `UiTabs`, `UiToolbar`, `UiEmptyState`를 만든다.
5. 공용 레이아웃을 새 토큰과 프리미티브로 전환한다.
6. 앱 목록과 장소 이름 생성기를 렌더링 뷰로 분리하고 전환한다.
7. 후속 도구는 이 기반 위에서 필요한 도메인 컴포넌트만 추가한다.

## Verification

- 각 컴포넌트의 variants 및 상태 조합은 단위 테스트로 확인한다.
- 선택, `v-model`, disabled, 오류 상태는 대표 컴포넌트 테스트로 확인한다.
- 앱 셸, 앱 목록, 장소 이름 생성기에는 좁은 화면과 넓은 화면의 브라우저 확인을 수행한다.
- 변경 파일 ESLint, 기존 유틸리티 테스트, Nuxt build를 실행한다.
- 전체 작업 완료 전 실제 화면에서 포커스, 키보드 조작, 넘침, 텍스트 절단 여부를 확인한다.

## Risks and Boundaries

- 미사용 복합 컴포넌트를 미리 만들지 않는다. 실제 화면 요구가 생길 때 프리미티브 조합으로 해결할 수 없는 경우에만 추가한다.
- `UiSection`은 페이지 섹션을 표현하는 구성 요소이며, 모든 `div`를 대체하는 범용 컨테이너가 아니다.
- 태그와 선택지는 현재 형태를 고정하지 않는다. 공통 모델과 상태만 제공하고, 실제 도구의 데이터 모델을 보면서 옵션 표현을 확장한다.
- 기존 작업 트리 변경을 되돌리거나 재구성하지 않는다. 이번 작업은 새 UI 기반과 이를 사용하는 화면에 한정한다.
