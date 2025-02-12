import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the project.
 * - Uses the React plugin.
 * - Sets the server port to 3000 and opens the browser automatically.
 * - Outputs the build to the `dist` folder.
 * - Enables automatic reload on file changes.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Set your preferred port
    open: true, // Automatically open the browser
    watch: {
      usePolling: true, // Enable polling for file changes (useful in some environments like Docker or WSL)
      interval: 1000, // Polling interval in milliseconds
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build
  },
});