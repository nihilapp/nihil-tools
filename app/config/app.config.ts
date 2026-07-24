export const appConfig = {
  site: {
    title: '니힐의 도구상자',
    description: 'TRPG 진행과 창작을 돕는 여러 도구를 한곳에 모은 니힐의 도구상자입니다.',
    keywords: 'TRPG, 테이블탑 RPG, 주사위, 랜덤 생성기, 창작 도구',
    url: 'https://nihil-tools.nihilncunia.com',
    type: 'website' as const,
    version: '1.0.0',
  },
  author: {
    name: 'NIHILncunia',
    url: 'https://github.com/nihilncunia',
  },
  images: {
    cover: {
      link: '/images/nihil-web-logo.png',
      alt: '니힐의 도구상자 로고',
    },
    logo: '/images/nihil-web-logo.png',
    darkLogo: '/images/nihil-web-logo-w.png',
  },
  google: {
    verification: '',
    adSrc: '',
    analyticsId: '',
  },
  api: {
    route: '/api',
  },
} as const;
