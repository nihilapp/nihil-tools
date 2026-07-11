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

const connectorTemplateToSlot: Record<string, string> = {
  "{명사}에 잠긴 {지역}": "immersion_media_for_에_잠긴",
  "{명사}에 물든 {지역}": "stain_media_for_에_물든",
  "{명사}에 삼켜진 {지역}": "devouring_force_for_에_삼켜진",
  "{명사} 아래의 {지역}": "overhead_or_hierarchy_for_아래의",
  "{명사} 너머의 {지역}": "boundary_for_너머의",
  "{명사} 사이의 {지역}": "plural_landmark_for_사이의",
  "{명사} 끝의 {지역}": "terminal_axis_for_끝의",
  "{명사} 없는 {지역}": "absence_object_for_없는",
  "{명사}을/를 잃은 {지역}": "lost_object_for_을를_잃은",
  "{명사}을/를 기다리는 {지역}": "awaited_object_for_을를_기다리는",
};

function pick<T>(items: T[]): T {
  if (items.length === 0) throw new Error("Cannot pick from an empty array.");
  return items[Math.floor(Math.random() * items.length)];
}

function hasFinalConsonant(word: string): boolean {
  const last = word.charCodeAt(word.length - 1);
  if (last < 0xac00 || last > 0xd7a3) return false;
  return (last - 0xac00) % 28 !== 0;
}

function subjectParticle(word: string): string {
  return hasFinalConsonant(word) ? "이" : "가";
}

function objectParticle(word: string): string {
  return hasFinalConsonant(word) ? "을" : "를";
}

function applyConnectorTemplate(template: string, noun: string, region: string): string {
  if (template.includes("을/를")) {
    return template
      .replace("{명사}을/를", noun + objectParticle(noun))
      .replace("{지역}", region);
  }

  return template
    .replace("{명사}", noun)
    .replace("{지역}", region);
}

function generateBasicName(
  wordPools: WordPools,
  regions: RegionEntry[],
  verbs: string[]
): string {
  const region = pick(regions).text;
  const pattern = pick(["nounOf", "adjective", "subjectVerb", "eventAdnominal"] as const);

  switch (pattern) {
    case "nounOf": {
      return `${pick(wordPools.nouns)}의 ${region}`;
    }
    case "adjective": {
      return `${pick(wordPools.adjectives)} ${region}`;
    }
    case "subjectVerb": {
      const subject = pick(wordPools.subjects);
      const verb = pick(verbs);
      return `${subject}${subjectParticle(subject)} ${verb} ${region}`;
    }
    case "eventAdnominal": {
      return `${pick(wordPools.eventAdnominals)} ${region}`;
    }
  }
}

function generateConnectorName(
  connectorPools: ConnectorPools,
  regions: RegionEntry[]
): string {
  const template = pick(Object.keys(connectorTemplateToSlot));
  const slot = connectorTemplateToSlot[template];
  const noun = pick(connectorPools[slot]);
  const region = pick(regions).text;

  return applyConnectorTemplate(template, noun, region);
}
