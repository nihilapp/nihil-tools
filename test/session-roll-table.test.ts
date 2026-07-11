import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import SessionRollTable from '~/components/sessionRollTable/SessionRollTable.vue';

describe('SessionRollTable', () => {
  it('filters league notices by the selected role tab', async () => {
    const wrapper = mount(SessionRollTable);

    expect(wrapper.text()).toContain('85개 공고 후보');

    await wrapper.get('button[data-tab="resolver-hunter"]').trigger('click');

    expect(wrapper.text()).toContain('75개 공고 후보');

    await wrapper.get('button[data-tab="pioneer"]').trigger('click');

    expect(wrapper.text()).toContain('5개 공고 후보');
  });

  it('switches to civilian requests and generates a session card', async () => {
    const wrapper = mount(SessionRollTable);

    await wrapper.get('button[data-category="civilian"]').trigger('click');

    expect(wrapper.text()).toContain('12개 의뢰 후보');
    expect(wrapper.text()).not.toContain('개척자');

    await wrapper.get('button[data-action="generate"]').trigger('click');

    expect(wrapper.text()).toContain('의뢰 사유');
    expect(wrapper.text()).toContain('주요 지형');
    expect(wrapper.text()).toContain('몬스터 후보');
  });
});
