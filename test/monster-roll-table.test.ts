import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import MonsterRollTable from '~/components/monsterRollTable/MonsterRollTable.vue';

describe('MonsterRollTable', () => {
  it('generates a monster concept card', async () => {
    const wrapper = mount(MonsterRollTable);

    await wrapper.get('button[data-action="generate"]').trigger('click');

    expect(wrapper.text()).toContain('출현 맥락');
    expect(wrapper.text()).toContain('세부 분류');
    expect(wrapper.text()).toContain('전투 방식');
  });
});
