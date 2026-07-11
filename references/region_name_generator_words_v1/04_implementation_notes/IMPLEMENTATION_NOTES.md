# Implementation Notes

## 데이터 모델 권장안

명사 하나에 모든 연결어를 허용하지 말고, 패턴별로 허용 가능한 명사 슬롯을 둡니다.
가장 단순한 구현은 `connector_slot_pools`의 배열을 직접 참조하는 방식입니다.

```ts
type WordPools = {
  nouns: string[];
  adjectives: string[];
  subjects: string[];
  eventAdnominals: string[];
};

type ConnectorPools = Record<string, string[]>;

type RegionEntry = {
  text: string;
  tags?: string[];
};
```

## 추천 패턴 선택 로직

1. 기본 패턴과 연결어 패턴에 각각 가중치를 둡니다.
2. 연결어 패턴이 선택되면, 해당 슬롯 풀에서 명사를 뽑습니다.
3. 지역명사에도 태그를 붙일 수 있다면 더 좋습니다.
4. 결과가 너무 짧거나 너무 평범하면 재추첨합니다.

## 지역 태그를 추가할 때의 예시

```ts
const regions = [
  { text: '숲', tags: ['natural', 'forest', 'wild'] },
  { text: '늪', tags: ['natural', 'swamp', 'ominous'] },
  { text: '성채', tags: ['civilized', 'fortress', 'ruin'] },
  { text: '호수', tags: ['natural', 'water', 'sacred'] },
];
```

지역 태그까지 붙이면 `피에 물든 전장`, `노을에 물든 해안`, `안개에 잠긴 늪`처럼 궁합 좋은 결과를 더 자주 만들 수 있습니다.
