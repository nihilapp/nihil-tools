import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: [
    '@nuxt/eslint',
  ],
  css: [
    '~/assets/styles/tailwind.css',
  ],
  vite: {
    optimizeDeps: {
      include: [
        '@iconify/vue',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
    },
    plugins: [
      tailwindcss(),
    ],
  },
});
