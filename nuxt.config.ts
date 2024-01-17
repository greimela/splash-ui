// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindForms from '@tailwindcss/forms';
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';

export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxt/devtools', '@nuxtjs/tailwindcss'],
  app: {
    head: {
      title: 'Splash! UI',
      meta: [
        {
          name: 'description',
          content:
            'An experimental UI for Splash!, a decentralized network for sharing Offers across the Chia ecosystem.',
        },
      ],
    },
  },
  tailwindcss: {
    config: {
      plugins: [tailwindForms],
    },
  },
  vite: {
    resolve: {
      alias: {
        stream: 'stream-browserify',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [NodeGlobalsPolyfillPlugin()],
      },
    },
  },
});
