import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // Proxy configuration for API calls (optional - uncomment if needed)
        // proxy: {
        //   '/api': {
        //     target: env.VITE_API_BASE_URL || 'http://localhost:8080',
        //     changeOrigin: true,
        //     rewrite: (path) => path.replace(/^\/api/, ''),
        //   },
        // },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
