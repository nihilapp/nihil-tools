import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SessionRollTable from '~/components/sessionRollTable/SessionRollTable.vue';

describe('SessionRollTable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('shows one reason candidate when the candidate-count roll is zero', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const wrapper = mount(SessionRollTable);

    await wrapper.get('button[data-action="generate"]').trigger('click');

    expect(wrapper.findAll('[data-role="reason-candidate"]')).toHaveLength(1);
  });

  it('shows two distinct reason candidates when the candidate-count roll is high', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const wrapper = mount(SessionRollTable);

    await wrapper.get('button[data-action="generate"]').trigger('click');

    const candidates = wrapper.findAll('[data-role="reason-candidate"]');
    expect(candidates).toHaveLength(2);
    expect(new Set(candidates.map(candidate => candidate.text())).size).toBe(2);
  });
});
