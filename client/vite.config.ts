import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Access environment variables
    define: {
      'process.env': env,
    },
    server: {
      port: parseInt(env.VITE_PORT || '3000', 10),
      // Enable HMR (Hot Module Replacement)
      hmr: true,
      // Watch for file changes in development
      watch: {
        usePolling: true, // Useful for Docker or WSL
      },
    },
    build: {
      // Optimize build output
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true, // Generate source maps for debugging
      minify: 'terser', // Minify the output
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs in production
        },
      },
    },
  };
});