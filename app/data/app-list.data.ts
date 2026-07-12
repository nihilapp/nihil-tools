export interface AppListItem {
  name: string;
  description: string;
  icon: string;
  url: string;
}

export const appListData: AppListItem[] = [
  {
    name: '세션 롤 테이블',
    description: '랜덤한 세션 정보를 생성합니다.',
    icon: 'boxicons:calendar',
    url: '/session-roll-table',
  },
  {
    name: '몬스터 롤 테이블',
    description: '랜덤한 몬스터의 유형, CR를 생성합니다.',
    icon: 'game-icons:orc-head',
    url: '/monster-roll-table',
  },
  {
    name: '장소 이름 생성기',
    description: '장소 이름을 생성합니다.',
    icon: 'material-symbols:map',
    url: '/place-name-generator',
  },
  {
    name: '주사위 굴리기',
    description: '주사위를 굴립니다.',
    icon: 'material-symbols:map',
    url: '/dice-roller',
  },
  {
    name: '이미지 WebP 변환',
    description: 'PNG와 JPG 이미지를 WebP로 일괄 변환합니다.',
    icon: 'material-symbols:image',
    url: '/apps/image-webp-converter',
  },
];
