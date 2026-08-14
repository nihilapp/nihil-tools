import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import PasswordHashTester from '~/components/passwordHashTester/PasswordHashTester.vue';

const fetchMock = vi.fn();

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('PasswordHashTester', () => {
  it('shows the legacy warning for MD5', () => {
    const wrapper = mount(PasswordHashTester);

    expect(wrapper.text()).toContain('MD5와 SHA-1은 레거시 방식입니다.');
  });

  it('uses side-by-side panels with internal overflow areas', () => {
    const wrapper = mount(PasswordHashTester);

    expect(wrapper.get('[data-testid="hash-tester-layout"]').classes()).toContain('flex-row');
    expect(wrapper.get('[data-testid="hash-panel-content"]').classes()).toContain('overflow-y-auto');
    expect(wrapper.get('[data-testid="compare-panel-content"]').classes()).toContain('overflow-y-auto');
  });

  it('shows the bcrypt cost input when bcrypt is selected', async () => {
    const wrapper = mount(PasswordHashTester);

    await wrapper.get('[data-testid="hash-algorithm"] select').setValue('bcrypt');

    expect(wrapper.find('[data-testid="bcrypt-cost"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="argon2-memory-cost"]').exists()).toBe(false);
  });

  it('sends a hash request and displays the returned hash', async () => {
    fetchMock.mockResolvedValue({
      algorithm: 'sha256',
      hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
      settings: [
      ],
    });
    vi.stubGlobal('$fetch', fetchMock);

    const wrapper = mount(PasswordHashTester);

    await wrapper.get('[data-testid="hash-value"] input').setValue('hello');
    await wrapper.get('[data-testid="hash-form"]').trigger('submit');

    expect(fetchMock).toHaveBeenCalledWith('/api/password-hash/hash', {
      body: {
        algorithm: 'md5',
        value: 'hello',
      },
      method: 'POST',
    });
    expect((wrapper.get('[data-testid="hash-result"]').element as HTMLTextAreaElement).value)
      .toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('displays a mismatch comparison result', async () => {
    fetchMock.mockResolvedValue({
      algorithm: 'sha256',
      matched: false,
    });
    vi.stubGlobal('$fetch', fetchMock);

    const wrapper = mount(PasswordHashTester);

    await wrapper.get('[data-testid="compare-value"] textarea').setValue('other');
    await wrapper.get('[data-testid="compare-hash"] textarea').setValue('abc');
    await wrapper.get('[data-testid="compare-form"]').trigger('submit');

    expect(wrapper.get('[data-testid="compare-result"]').text()).toContain('불일치');
  });
});
