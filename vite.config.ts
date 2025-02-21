import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Allows external access (useful for testing on mobile)
    port: 8080,        // Set a custom port (default is 5173)
    strictPort: true,  // Ensures Vite will use the specified port
    open: true,        // Automatically opens the browser on startup
    hmr: {             // Hot Module Replacement (HMR) for live reloading
      overlay: true,   // Show errors as an overlay in the browser
    },
    watch: {
      usePolling: true, // Enables polling mode for file changes (fixes issues on some systems)
    },
  },
  build: {
    sourcemap: true,   // Enables source maps for debugging
    minify: 'esbuild', // Uses esbuild for faster builds
    target: 'esnext',  // Ensures compatibility with modern browsers
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Auto-inject React import (no need to import manually)
  },
  resolve: {
    alias: {
      '@': '/src', // Allows usage of '@/' for easier imports
    },
  },
})
