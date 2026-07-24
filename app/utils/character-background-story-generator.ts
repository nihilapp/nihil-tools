import { characterBackgroundStoryCommonData } from '~/data/random-keywords/renewal/character-background-story-common.data';
import { characterBackgroundStoryFantasyData } from '~/data/random-keywords/renewal/character-background-story-fantasy.data';
import { characterBackgroundStoryRealWorldData } from '~/data/random-keywords/renewal/character-background-story-real-world.data';
import { renewalCharacterRacesData } from '~/data/random-keywords/renewal/renewal-character-races.data';
import { renewalPeopleOccupationsData } from '~/data/random-keywords/renewal/renewal-people-occupations.data';
import type { CharacterBackgroundStoryMode, CharacterBackgroundStoryResult } from '~/types/character-background-story-generator';

function pickOne<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

function getOccupations(): string[] {
  return Object.entries(renewalPeopleOccupationsData)
    .filter(([
      key,
    ]) => key.endsWith('Occupations'))
    .flatMap(([
      , value,
    ]) => value as readonly string[]);
}

function getRace(random: () => number): string {
  const race = pickOne(renewalCharacterRacesData.raceKeywords, random);

  return race.split('/').at(-1)!;
}

function getRealWorldOrigin(random: () => number): string {
  return pickOne(characterBackgroundStoryRealWorldData.origins, random);
}

function getFantasyOrigin(random: () => number): string {
  const modifier = pickOne(characterBackgroundStoryFantasyData.originModifiers, random);
  const location = pickOne(characterBackgroundStoryFantasyData.originLocations, random);

  return `${modifier} ${location}`;
}

function getCommonOrigin(random: () => number): string {
  const originSources = [
    () => pickOne(characterBackgroundStoryCommonData.origins, random),
    () => getRealWorldOrigin(random),
    () => getFantasyOrigin(random),
  ];

  return pickOne(originSources, random)();
}

function getCommonPurpose(random: () => number): string {
  const purposeSources = [
    characterBackgroundStoryRealWorldData.goals,
    characterBackgroundStoryFantasyData.goals,
  ];

  return pickOne(pickOne(purposeSources, random), random);
}

export function generateCharacterBackgroundStory(
  mode: CharacterBackgroundStoryMode,
  random: () => number = Math.random,
): CharacterBackgroundStoryResult {
  const occupation = pickOne(getOccupations(), random);
  const purpose = mode === 'real-world'
    ? pickOne(characterBackgroundStoryRealWorldData.goals, random)
    : mode === 'fantasy'
      ? pickOne(characterBackgroundStoryFantasyData.goals, random)
      : getCommonPurpose(random);
  const origin = mode === 'real-world'
    ? getRealWorldOrigin(random)
    : mode === 'fantasy'
      ? getFantasyOrigin(random)
      : getCommonOrigin(random);
  const person = mode === 'fantasy'
    ? `${getRace(random)} ${occupation}`
    : occupation;

  return {
    mode,
    purpose,
    origin,
    person,
    'sentence': `${purpose}를 위해 ${origin}에서 온 ${person}`,
  };
}
