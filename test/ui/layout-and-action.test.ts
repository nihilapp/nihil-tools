import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import UiButton from '../../app/components/ui/UiButton.vue';
import UiSection from '../../app/components/ui/UiSection.vue';

describe('UiButton', () => {
  it('keeps the command label while disabled', () => {
    const wrapper = mount(UiButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: '생성',
      },
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('생성');
  });
});

describe('UiSection', () => {
  it('renders title, actions, and body separately', () => {
    const wrapper = mount(UiSection, {
      props: {
        title: '생성 설정',
      },
      slots: {
        'header-actions': '<button type="button">초기화</button>',
        default: '<p>본문</p>',
      },
    });

    expect(wrapper.text()).toContain('생성 설정');
    expect(wrapper.text()).toContain('초기화');
    expect(wrapper.text()).toContain('본문');
  });
});
