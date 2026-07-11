# League Notice Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 새 연맹 공고 데이터 85개를 기준으로 `자유 탐사 연맹 공고 유형.md`를 갱신하고, 기존 공고와 신규 공고의 대응 및 세계관 근거를 비교 가능하게 만든다.

**Architecture:** TSV의 85개 행은 공고 이름, 공고 그룹, 보안 등급의 기준 목록으로 사용한다. 기존 공고 문서는 세계관 설명의 기준으로 유지하되, 공포의 의회·앙그라의 안개·잔향·검은 광기 관련 문서를 근거로 기밀 및 재분류 설명을 보강한다. 비교 결과는 참조 자료 아래의 별도 Markdown 보고서로 남긴다.

**Tech Stack:** Markdown, TSV, PowerShell 검증 명령

## Global Constraints

- 연맹 공고는 사적 고용 계약이 아닌 탐사 과제다.
- 민간 의뢰는 이 정합성 작업의 대상이 아니다.
- `기밀`은 보안 등급이며, `재앙 대응` 5개는 공포의 의회와 흑암교단 관련 기밀 공고로 설명한다.
- 던전 내부 몬스터와 던전 가디언은 던전 경계 밖으로 나오지 않는다.
- 앙그라권 레이드·사냥과 토템 가디언 레이드는 원정대 단위다.
- 기존 유형은 삭제하지 않고 신규 유형과의 대응, 흡수 또는 재배치 상태를 기록한다.

---

### Task 1: 공고 유형 대응 기준 확정

**Files:**
- Read: `references/세션 롤 테이블 참고자료/tables/league-notice-token-mapping.tsv`
- Read: `references/세션 롤 테이블 참고자료/자유 탐사 연맹 공고 유형.md`
- Create: `references/세션 롤 테이블 참고자료/docs/연맹 공고 유형 정합성 보고서.md`

**Produces:** 85개 신규 공고와 기존 공고의 대응, 흡수, 재배치, 미반영 상태를 그룹별로 기록한 보고서.

- [ ] TSV의 85개 행을 `공고 그룹 / 의뢰 유형 / 보안 등급`으로 집계한다.
- [ ] 기존 문서의 제1부~제3부 공고 헤딩을 추출한다.
- [ ] 같은 역할의 기존·신규 공고를 대응시키고, 이름이 달라진 항목은 명시한다.
- [ ] 기존에만 존재하는 공고는 흡수 대상, 별도 유지 대상, 신규 유형 후보 중 하나로 표시한다.
- [ ] 공포의 의회 관련 5개 기밀 공고의 대응 관계를 명시한다.
- [ ] PowerShell로 보고서에 17개 신규 공고 그룹 및 85개 신규 유형이 모두 언급되는지 확인한다.

### Task 2: 연맹 공고 유형 문서 갱신

**Files:**
- Modify: `references/세션 롤 테이블 참고자료/자유 탐사 연맹 공고 유형.md`

**Consumes:** Task 1의 정합성 보고서.

**Produces:** 새 공고 체계와 흑암교단/공포의 의회 연결을 설명하는 최신 연맹 공고 문서.

- [ ] 개요에 새 85개 유형이 공고 분류의 최신 기준임을 명시한다.
- [ ] 문명권 안전 관리, 전쟁·전장 조사, 전시 민생·구호를 비앙그라권 공고로 추가한다.
- [ ] 기존 그룹의 누락 유형을 해당 그룹에 추가한다.
- [ ] 제3부 기밀 분류를 공포의 의회가 배후인 재앙 대응 5개 유형으로 재구성한다.
- [ ] 기존 기밀 공고 중 다른 신규 그룹으로 흡수되는 항목은 해당 위치에서 연결을 설명한다.
- [ ] 앙그라의 안개, 잔향, 검은 광기, 던전 문서와 충돌하는 표현이 없는지 점검한다.

### Task 3: 정합성 검증 및 사용자용 요약

**Files:**
- Verify: `references/세션 롤 테이블 참고자료/tables/league-notice-token-mapping.tsv`
- Verify: `references/세션 롤 테이블 참고자료/자유 탐사 연맹 공고 유형.md`
- Verify: `references/세션 롤 테이블 참고자료/docs/연맹 공고 유형 정합성 보고서.md`

**Produces:** 검증 결과와 기존/신규 유형의 간략 비교표.

- [ ] TSV의 85개 신규 유형이 최신 문서 또는 정합성 보고서에 모두 대응하는지 확인한다.
- [ ] 기밀 공고 5개가 공포의 의회 및 흑암교단과 연결되는지 확인한다.
- [ ] 던전 경계 및 앙그라권 원정대 제약 문구가 보존되는지 확인한다.
- [ ] `git diff --check`로 Markdown 공백 오류를 확인한다.
- [ ] 사용자에게 기존 유형, 신규 유형, 간략한 의뢰 설명을 그룹별로 요약한다.
