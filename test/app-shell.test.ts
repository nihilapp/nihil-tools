import { describe, expect, it } from 'vitest';

import { buildAppNavigation, findAppById, resolveDefaultEntryPath, resolvePageMeta } from '../app/utils/app-shell';

describe('buildAppNavigation', () => {
  it('builds detail routes from app urls', () => {
    const items = buildAppNavigation([
      {
        name: '주사위 굴리기',
        description: '설명',
        icon: 'mdi:dice-multiple',
        url: '/dice-roller',
      },
    ]);

    expect(items).toEqual([
      {
        name: '주사위 굴리기',
        description: '설명',
        icon: 'mdi:dice-multiple',
        url: '/dice-roller',
        id: 'dice-roller',
        detailPath: '/apps/dice-roller',
      },
    ]);
  });
});

describe('findAppById', () => {
  it('finds an app from the derived detail id', () => {
    const items = buildAppNavigation([
      {
        name: '장소 이름 생성기',
        description: '설명',
        icon: 'mdi:map-marker',
        url: '/place-name-generator',
      },
    ]);

    expect(findAppById('place-name-generator', items)?.name).toBe('장소 이름 생성기');
    expect(findAppById('missing', items)).toBeNull();
  });
});

describe('resolvePageMeta', () => {
  it('returns the app name for detail pages', () => {
    expect(resolvePageMeta('/apps/place-name-generator', 4, '장소 이름 생성기')).toEqual({
      title: '장소 이름 생성기',
      subtitle: '선택한 앱의 기본 화면입니다.',
    });
  });
});

describe('resolveDefaultEntryPath', () => {
  it('uses the apps page as the default landing path', () => {
    expect(resolveDefaultEntryPath()).toBe('/apps');
  });
});
