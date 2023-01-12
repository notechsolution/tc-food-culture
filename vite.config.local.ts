import * as path from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';

const pathResolve = (dir: string) => {
  return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
  '/@': pathResolve('./client/src/'),
  'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};
// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    resolve: { alias },
    root: process.cwd(),
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver() as any],
      }),
      vueSetupExtend
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
