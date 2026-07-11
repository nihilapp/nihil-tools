import { placeNameGeneratorData,
  type PlaceNameConnectorSlotKey,
  type PlaceNameWordPools } from '~/data/place-name-generator.data';

export type PlaceNameGenerationCount = 1 | 5 | 10;
type ConnectorPools = Record<PlaceNameConnectorSlotKey, string[]>;

const basicPatterns = [
  'nounOf',
  'adjective',
  'subjectVerb',
  'eventAdnominal',
] as const;

function pick<T>(items: readonly T[]) {
  const item = items[Math.floor(Math.random() * items.length)];

  if (item === undefined) {
    throw new Error('이름 생성에 사용할 데이터가 비어 있습니다.');
  }

  return item;
}

function hasFinalConsonant(word: string) {
  const last = word.charCodeAt(word.length - 1);

  if (last < 0xac00 || last > 0xd7a3) {
    return false;
  }

  return (last - 0xac00) % 28 !== 0;
}

export function subjectParticle(word: string) {
  return hasFinalConsonant(word)
    ? '이'
    : '가';
}

export function objectParticle(word: string) {
  return hasFinalConsonant(word)
    ? '을'
    : '를';
}

function applyConnectorTemplate(template: string, noun: string, region: string) {
  if (template.includes('을/를')) {
    return template
      .replace('{명사}을/를', `${noun}${objectParticle(noun)}`)
      .replace('{지역}', region);
  }

  return template
    .replace('{명사}', noun)
    .replace('{지역}', region);
}

function createBasicName(wordPools: PlaceNameWordPools) {
  const region = pick(placeNameGeneratorData.regionPool);
  const pattern = pick(basicPatterns);

  switch (pattern) {
    case 'nounOf':
      return `${pick(wordPools.nouns)}의 ${region}`;

    case 'adjective':
      return `${pick(wordPools.adjectives)} ${region}`;

    case 'subjectVerb': {
      const subject = pick(wordPools.subjects);

      return `${subject}${subjectParticle(subject)} ${pick(placeNameGeneratorData.subjectVerbPool)} ${region}`;
    }

    case 'eventAdnominal':
      return `${pick(wordPools.eventAdnominals)} ${region}`;
  }
}

function createConnectorName(pools: ConnectorPools) {
  const template = pick(Object.keys(placeNameGeneratorData.connectorTemplateToSlot));
  const slotKey = placeNameGeneratorData.connectorTemplateToSlot[template];

  if (slotKey === undefined) {
    throw new Error(`연결어 템플릿의 슬롯을 찾을 수 없습니다: ${template}`);
  }

  const noun = pick(pools[slotKey]);
  const region = pick(placeNameGeneratorData.regionPool);

  return applyConnectorTemplate(template, noun, region);
}

function createPlaceName() {
  const { connectorSlotPools, wordPools } = placeNameGeneratorData;
  const pools = connectorSlotPools as ConnectorPools;

  return Math.random() < 0.6
    ? createBasicName(wordPools)
    : createConnectorName(pools);
}

export function generatePlaceNames(count: PlaceNameGenerationCount) {
  const results = new Set<string>();

  while (results.size < count) {
    results.add(createPlaceName());
  }

  return Array.from(results);
}
