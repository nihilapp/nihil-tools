import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ImageWebpConverter from '~/components/imageWebpConverter/ImageWebpConverter.vue';

describe('ImageWebpConverter', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: vi.fn(() => ''),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('queues PNG and JPG files but ignores unsupported files', async () => {
    const wrapper = mount(ImageWebpConverter, {
      global: {
        stubs: {
          Icon: true,
        },
      },
    });
    const input = wrapper.get('[data-testid="image-file-input"]');

    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [
        new File(['png'], 'map.png', { type: 'image/png' }),
        new File(['jpg'], 'portrait.jpg', { type: 'image/jpeg' }),
        new File(['gif'], 'motion.gif', { type: 'image/gif' }),
      ],
    });
    await input.trigger('change');

    expect(wrapper.findAll('[data-testid="queue-item"]')).toHaveLength(2);
    expect(wrapper.get('[data-testid="convert-all"]').attributes('disabled')).toBeUndefined();
  });
});
