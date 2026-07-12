import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SessionRollTablePage from '~/pages/apps/session-roll-table.vue';

describe('SessionRollTablePage', () => {
  beforeEach(() => {
    vi.stubGlobal('useHead', vi.fn());
  });

  it('renders the session roll table at the apps route', () => {
    const wrapper = mount(SessionRollTablePage);

    expect(wrapper.text()).toContain('세션 롤 테이블');
  });
});
