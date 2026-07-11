import { describe, expect, it } from 'vitest';
import { getMonsterSubtypeData, monsterRollTableData } from '../app/data/monster-roll-table.data';

describe('monsterRollTableData', () => {
  it('keeps the seven lightweight monster concept pools', () => {
    expect(monsterRollTableData.origins).toHaveLength(15);
    expect(monsterRollTableData.majorTypes).toHaveLength(14);
    expect(monsterRollTableData.subtypes).toHaveLength(274);
    expect(monsterRollTableData.sizes).toHaveLength(6);
    expect(monsterRollTableData.groupStructures).toHaveLength(21);
    expect(monsterRollTableData.behaviors).toHaveLength(18);
    expect(monsterRollTableData.combatStyles).toHaveLength(87);
  });

  it('only returns subtypes that belong to the selected major type', () => {
    const subtypes = getMonsterSubtypeData('undead');

    expect(subtypes.length).toBeGreaterThan(0);
    expect(subtypes.every((subtype: { majorTypeId: string; }) => subtype.majorTypeId === 'undead')).toBe(true);
  });
});
