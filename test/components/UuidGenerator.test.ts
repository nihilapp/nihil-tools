import { version } from 'uuid';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UuidGenerator from '~/components/uuidGenerator/UuidGenerator.vue';

const writeTextMock = vi.fn();

afterEach(() => {
  writeTextMock.mockReset();
  vi.unstubAllGlobals();
});

describe('UuidGenerator', () => {
  it('uses v7 as the default UUID version', () => {
    const wrapper = mount(UuidGenerator);

    expect((wrapper.get('[data-testid="uuid-version"] input[value="v7"]').element as HTMLInputElement).checked)
      .toBe(true);
  });

  it('creates the selected number of UUIDs in the selected version', async () => {
    const wrapper = mount(UuidGenerator);

    await wrapper.get('[data-testid="uuid-version"] input[value="v4"]').setValue();
    await wrapper.get('[data-testid="uuid-count-5"]').trigger('click');
    await wrapper.get('[data-testid="generate-uuid"]').trigger('click');

    const uuidValues = wrapper.findAll('[data-testid="generated-uuid-value"]');

    expect(uuidValues).toHaveLength(5);
    expect(uuidValues.every((uuidValue) => version(uuidValue.text()) === 4)).toBe(true);
  });

  it('adds the newest generated UUIDs before existing results', async () => {
    const wrapper = mount(UuidGenerator);

    await wrapper.get('[data-testid="uuid-version"] input[value="v4"]').setValue();
    await wrapper.get('[data-testid="generate-uuid"]').trigger('click');

    await wrapper.get('[data-testid="uuid-version"] input[value="v7"]').setValue();
    await wrapper.get('[data-testid="generate-uuid"]').trigger('click');

    const uuidValues = wrapper.findAll('[data-testid="generated-uuid-value"]');

    expect(uuidValues).toHaveLength(2);
    expect(version(uuidValues[0].text())).toBe(7);
    expect(version(uuidValues[1].text())).toBe(4);
  });

  it('copies an individual UUID to the clipboard', async () => {
    writeTextMock.mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    const wrapper = mount(UuidGenerator);

    await wrapper.get('[data-testid="generate-uuid"]').trigger('click');

    const uuid = wrapper.get('[data-testid="generated-uuid-value"]').text();

    await wrapper.get('[data-testid="copy-uuid"]').trigger('click');

    expect(writeTextMock).toHaveBeenCalledWith(uuid);
    expect(wrapper.text()).toContain('복사되었습니다.');
  });

  it('clears generated UUIDs when reset is clicked', async () => {
    const wrapper = mount(UuidGenerator);

    await wrapper.get('[data-testid="generate-uuid"]').trigger('click');
    await wrapper.get('[data-testid="reset-uuid"]').trigger('click');

    expect(wrapper.find('[data-testid="generated-uuid-value"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('생성하기를 누르면 UUID가 표시됩니다.');
  });
});
