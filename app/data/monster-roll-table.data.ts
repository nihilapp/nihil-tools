import { monsterBehaviorData, monsterCombatStyleData, monsterGroupStructureData, monsterMajorTypeData, monsterOriginData, monsterSizeData } from '~/data/monster-roll-table.core.data';
import { monsterSubtypeDataPart01 } from '~/data/monster-roll-table.subtype-01.data';
import { monsterSubtypeDataPart02 } from '~/data/monster-roll-table.subtype-02.data';
import { monsterSubtypeDataPart03 } from '~/data/monster-roll-table.subtype-03.data';
import { monsterSubtypeDataPart04 } from '~/data/monster-roll-table.subtype-04.data';
import type { MonsterSubtypeData } from '~/data/monster-roll-table.types';

const monsterSubtypeData: MonsterSubtypeData[] = [
  ...monsterSubtypeDataPart01,
  ...monsterSubtypeDataPart02,
  ...monsterSubtypeDataPart03,
  ...monsterSubtypeDataPart04,
];

export const monsterRollTableData = {
  behaviors: monsterBehaviorData,
  combatStyles: monsterCombatStyleData,
  groupStructures: monsterGroupStructureData,
  majorTypes: monsterMajorTypeData,
  origins: monsterOriginData,
  sizes: monsterSizeData,
  subtypes: monsterSubtypeData,
};

export function getMonsterSubtypeData(majorTypeId: string): MonsterSubtypeData[] {
  return monsterSubtypeData.filter(subtype => subtype.majorTypeId === majorTypeId);
}
