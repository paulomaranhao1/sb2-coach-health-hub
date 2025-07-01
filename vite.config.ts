
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8080
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          supabase: ['@supabase/supabase-js']
        }
      },
      onwarn(warning, warn) {
        // Suprimir warnings específicos durante o build
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.code === 'UNUSED_EXTERNAL_IMPORT' ||
          warning.message.includes('ambient-light-sensor') ||
          warning.message.includes('battery') ||
          warning.message.includes('vr') ||
          warning.message.includes('facebook') ||
          warning.message.includes('firebase')
        ) {
          return;
        }
        warn(warning);
      }
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  },
  define: {
    __SUPPRESS_CONSOLE_WARNINGS__: mode === 'production',
    global: 'globalThis'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@supabase/supabase-js'
    ],
    exclude: [
      // Excluir pacotes que podem causar warnings
      'firebase',
      '@firebase/app',
      '@firebase/firestore'
    ]
  },
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  }
}));
