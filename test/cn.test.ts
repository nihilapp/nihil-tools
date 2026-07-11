import { describe, expect, it } from 'vitest';

import { cn } from '../app/utils/cn';

describe('cn', () => {
  it('merges conditional classes and resolves Tailwind conflicts', () => {
    const isHidden = false;

    expect(cn(
      'px-2',
      isHidden
        ? 'hidden'
        : undefined,
      'px-4',
      [
        'text-sm',
        undefined,
      ],
    )).toBe('px-4 text-sm');
  });
});
