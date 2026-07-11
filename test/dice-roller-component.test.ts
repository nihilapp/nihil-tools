import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import DiceRoller from '~/components/diceRoller/DiceRoller.vue';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('DiceRoller', () => {
  it('renders preset controls before rolling', () => {
    const wrapper = mount(DiceRoller);

    expect(wrapper.get('[data-testid="preset-count"]').attributes('type')).toBe('number');
    expect(wrapper.get('[data-testid="preset-select"]').text()).toContain('D20');
    expect(wrapper.get('[data-testid="preset-roll"]').text()).toBe('굴리기');
  });

  it('shows custom input after selecting the custom tab', async () => {
    const wrapper = mount(DiceRoller);

    await wrapper.get('[data-testid="custom-tab"]').trigger('click');

    expect(wrapper.get('[data-testid="custom-expression"]').exists()).toBe(true);
  });

  it('locks the count at one for D%', async () => {
    const wrapper = mount(DiceRoller);

    await wrapper.get('[data-testid="preset-count"]').setValue(3);
    await wrapper.get('[data-testid="preset-select"]').setValue('percentile');

    expect((wrapper.get('[data-testid="preset-count"]').element as HTMLInputElement).value).toBe('1');
    expect(wrapper.get('[data-testid="preset-count"]').attributes('disabled')).toBeDefined();
  });

  it('shows an error for a blank custom expression', async () => {
    const wrapper = mount(DiceRoller);

    await wrapper.get('[data-testid="custom-tab"]').trigger('click');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.get('[data-testid="custom-error"]').text()).toContain('주사위식');
  });
});

describe('dice roller route', () => {
  it('keeps the page as a renderer-only assembly', () => {
    const source = readFileSync(resolve(process.cwd(), 'app/pages/apps/dice-roller.vue'), 'utf8');

    expect(source).toContain('import DiceRoller from \'~/components/diceRoller/DiceRoller.vue\'');
    expect(source).toContain('<DiceRoller />');
  });
});
