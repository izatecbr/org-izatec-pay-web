import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import path from 'path';
import tailwind from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, 'src');
  const env = loadEnv(mode, process.cwd(), '');
  const production = env.NODE_ENV === 'production';

  return {
    root: rootDir,
    base: '/',
    appType: 'spa',
    plugins: [
      vue(),
    ],
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwind(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': rootDir,
        '@/api': path.resolve(rootDir, 'api'),
      }
    },
    build: {
      minify: production,
      sourcemap: production,
      outDir: path.resolve(rootDir, '..', 'dist'),
    },
  }
});
