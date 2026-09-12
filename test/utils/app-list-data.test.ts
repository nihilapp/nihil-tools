import { describe, expect, it } from 'vitest';

import { appListData } from '~/data/app-list.data';

describe('appListData', () => {
  it('registers the character counter app', () => {
    expect(appListData).toContainEqual({
      name: '글자 수 체크',
      description: '공백 포함·미포함 글자 수를 실시간으로 확인합니다.',
      icon: 'material-symbols:format-letter-spacing',
      url: '/character-counter',
    });
  });
});
