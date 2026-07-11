import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SessionRollTablePage from '~/pages/apps/session-roll-table.vue';

describe('SessionRollTablePage', () => {
  it('renders the session roll table at the apps route', () => {
    const wrapper = mount(SessionRollTablePage);

    expect(wrapper.text()).toContain('세션 롤 테이블');
  });
});
