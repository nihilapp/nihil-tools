import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CharacterCounter from '~/components/characterCounter/CharacterCounter.vue';

describe('CharacterCounter', () => {
  it('starts with both counts at zero', () => {
    const wrapper = mount(CharacterCounter);

    expect(wrapper.get('[data-testid="count-with-whitespace"]').text()).toContain('0');
    expect(wrapper.get('[data-testid="count-without-whitespace"]').text()).toContain('0');
  });

  it('updates whitespace-inclusive and whitespace-exclusive counts while typing', async () => {
    const wrapper = mount(CharacterCounter);

    await wrapper.get('[data-testid="character-counter-input"]').setValue('안녕 세상\n🙂');

    expect(wrapper.get('[data-testid="count-with-whitespace"]').text()).toContain('7');
    expect(wrapper.get('[data-testid="count-without-whitespace"]').text()).toContain('5');
  });
});
