import { appListData, type AppListItem } from '../data/app-list.data';
import { appConfig } from '~/config/app.config';

export interface AppNavigationItem extends AppListItem {
  id: string;
  detailPath: string;
}

export interface AppPageMeta {
  title: string;
  subtitle: string;
}

export function resolveDefaultEntryPath() {
  return '/apps';
}

export function createAppId(url: string) {
  return url
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
}

export function buildAppNavigation(items: AppListItem[] = appListData): AppNavigationItem[] {
  return items.map((item) => {
    const id = createAppId(item.url);

    return {
      ...item,
      id,
      detailPath: `/apps/${id}`,
    };
  });
}

export function findAppById(id: string, items: AppNavigationItem[] = buildAppNavigation()) {
  return items.find((item) => item.id === id) ?? null;
}

export function findAppByPath(path: string, items: AppNavigationItem[] = buildAppNavigation()) {
  return items.find((item) => path === item.detailPath || path.startsWith(`${item.detailPath}/`)) ?? null;
}

export function resolvePageMeta(path: string, appCount: number, appName?: string | null): AppPageMeta {
  if (path === '/') {
    return {
      title: appConfig.site.title,
      subtitle: `${appCount}개의 앱을 한 곳에서 관리합니다.`,
    };
  }

  if (path === '/apps') {
    return {
      title: '앱 목록',
      subtitle: `${appCount}개의 앱을 탐색할 수 있습니다.`,
    };
  }

  return {
    title: appName ?? '앱',
    subtitle: '선택한 앱의 기본 화면입니다.',
  };
}
