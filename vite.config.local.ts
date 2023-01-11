import * as path from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    resolve: {
      alias: [
        {
          find: '/@',
          replacement: `${path.resolve(__dirname, 'client/src')}/`,
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        }
      ]
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver() as any],
      }),
    ],
    publicDir: 'client/public',
    build: {
    outDir: 'dist/client',
        chunkSizeWarningLimit: 1000
  },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT as unknown as number,
      hmr: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001/api',
              changeOrigin: true,
              rewrite: (path) =>
              path.replace('/api', '/')
        }
      }
    },
    css: { preprocessorOptions: { css: { charset: false } } },
    define: {
      __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
