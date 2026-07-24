# 니힐의 도구상자 사이트 메타데이터 설계

## 목표

`nihil-tools.nihilncunia.com`의 모든 페이지가 `useSetMeta`를 사용해 고유한 제목, 정규 URL, 설명, 키워드, Open Graph 정보를 노출하도록 한다.

## 공통 사이트 설정

`app/config/app.config.ts`는 다음 공통 정보를 단일 원본으로 관리한다.

- 사이트명: `니힐의 도구상자`
- 기준 URL: `https://nihil-tools.nihilncunia.com`
- 기본 설명과 공통 키워드: TRPG 진행과 창작을 돕는 여러 도구를 모은 웹 도구상자라는 사이트 정체성
- 기본 커버 이미지: `/images/nihil-web-logo.png`
- 기본 이미지 대체 텍스트: `니힐의 도구상자 로고`
- 작성자 정보와 기존 Google/API 설정

`useSetMeta`는 공통 설정을 기본값으로 사용하고, 개별 페이지가 전달한 설명·키워드·이미지·robots 값을 덮어쓴다. 이미지는 `public` 기준 경로로 선언하고, 훅에서 기준 URL을 더해 절대 Open Graph URL을 만든다.

## 페이지별 메타 원칙

모든 `app/pages/**/*.vue` 페이지는 `useSetMeta`를 호출한다. 페이지 제목은 사이트명을 훅에서 뒤에 붙이는 기존 규칙을 유지한다.

| 경로 | 제목 | 메타 초점 |
| --- | --- | --- |
| `/` | 니힐의 도구상자 | 여러 TRPG·창작 도구를 모은 진입 페이지 |
| `/apps` | 앱 목록 | 제공 도구 탐색과 선택 |
| `/apps/session-roll-table` | 세션 롤 테이블 | 세션 주제·공고·상황 생성 |
| `/apps/monster-roll-table` | 몬스터 롤 테이블 | 몬스터 유형과 난이도 생성 |
| `/apps/place-name-generator` | 장소 이름 생성기 | 판타지 장소명 생성 |
| `/apps/dice-roller` | 주사위 굴리기 | TRPG 주사위 식과 결과 |
| `/apps/image-webp-converter` | 이미지 WebP 변환 | 브라우저 내 PNG·JPG 일괄 변환 |
| `/apps/random-keyword-generator` | 랜덤 키워드 생성기 | 창작 키워드와 발상 생성 |
| `/apps/random-keyword-generator/background-story` | 캐릭터 배경 스토리 생성기 | 캐릭터 출신·목적·배경 생성 |
| `/apps/:id` | 선택한 앱 이름 | 앱 목록 항목에서 제목·URL·설명을 계산 |
| `/dev/style` | 개발용 스타일 카탈로그 | 내부 개발 확인용 화면, `noindex, nofollow` |

각 앱의 설명과 키워드는 그 앱의 실제 기능을 직접 설명한다. 모든 앱이 같은 사이트 공통 키워드를 공유하되, 주사위·이미지 변환·캐릭터 창작처럼 검색 의도가 다른 단어를 개별 키워드로 추가한다.

## 동적·리디렉션 페이지

- `/apps/:id`는 `appListData`에서 앱을 찾은 경우 해당 앱의 이름·설명·상세 경로를 사용한다.
- 알 수 없는 앱은 기존 404 처리와 충돌하지 않도록 안전한 기본 메타를 사용한다.
- `/`는 리디렉션 동작을 유지하되, 브라우저가 렌더링하는 동안에도 사이트 기본 메타를 선언한다.

## 검증

- `appConfig`의 사이트명, 기준 URL, 기본 커버 경로를 단위 테스트로 확인한다.
- `useSetMeta`가 만들어내는 canonical URL, Open Graph 이미지 URL, 제목 조합을 단위 테스트로 확인한다.
- 각 페이지 소스가 `useSetMeta`를 호출하고 자기 경로를 전달하는지 정적 테스트로 확인한다.
- 대상 테스트와 프로덕션 빌드를 실행한다.
