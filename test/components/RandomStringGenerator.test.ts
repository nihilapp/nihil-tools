import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import RandomStringGenerator from '~/components/randomStringGenerator/RandomStringGenerator.vue';

describe('RandomStringGenerator', () => {
  it('creates a result with the requested numeric length', async () => {
    const wrapper = mount(RandomStringGenerator);

    await wrapper.get('[data-testid="string-length"] input').setValue('24');
    await wrapper.get('[data-testid="generate-string"]').trigger('click');

    expect(wrapper.get('[data-testid="generated-string"]').text()).toHaveLength(24);
  });

  it('shows guidance instead of generating when every character range is unchecked', async () => {
    const wrapper = mount(RandomStringGenerator);

    const ranges = wrapper.findAll('[data-testid="character-range"] input');

    for (const range of ranges) {
      if ((range.element as HTMLInputElement).checked) {
        await range.setValue(false);
      }
    }

    await wrapper.get('[data-testid="generate-string"]').trigger('click');

    expect(wrapper.text()).toContain('하나 이상의 문자 범위를 선택하세요.');
    expect(wrapper.find('[data-testid="generated-string"]').exists()).toBe(false);
  });
});
