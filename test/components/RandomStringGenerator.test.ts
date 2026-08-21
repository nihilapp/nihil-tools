import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import RandomStringGenerator from '~/components/randomStringGenerator/RandomStringGenerator.vue';

const writeTextMock = vi.fn();

afterEach(() => {
  writeTextMock.mockReset();
  vi.unstubAllGlobals();
});

describe('RandomStringGenerator', () => {
  it('creates a result with the requested numeric length', async () => {
    const wrapper = mount(RandomStringGenerator);

    await wrapper.get('[data-testid="string-length"] input').setValue('24');
    await wrapper.get('[data-testid="generate-string"]').trigger('click');

    expect(wrapper.get('[data-testid="generated-string-value"]').text()).toHaveLength(24);
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
    expect(wrapper.find('[data-testid="generated-string-value"]').exists()).toBe(false);
  });

  it('clears generated results when reset is clicked', async () => {
    const wrapper = mount(RandomStringGenerator);

    await wrapper.get('[data-testid="generate-string"]').trigger('click');

    expect(wrapper.find('[data-testid="generated-string-value"]').exists()).toBe(true);

    await wrapper.get('[data-testid="reset-string"]').trigger('click');

    expect(wrapper.find('[data-testid="generated-string-value"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('생성하기를 누르면 문자열이 표시됩니다.');
  });

  it('copies a generated string to the clipboard', async () => {
    writeTextMock.mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    const wrapper = mount(RandomStringGenerator);

    await wrapper.get('[data-testid="generate-string"]').trigger('click');

    const generatedString = wrapper.get('[data-testid="generated-string-value"]').text();

    await wrapper.get('[data-testid="copy-string"]').trigger('click');

    expect(writeTextMock).toHaveBeenCalledWith(generatedString);
    expect(wrapper.text()).toContain('복사되었습니다.');
  });
});
