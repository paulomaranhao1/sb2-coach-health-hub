
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
          // Core essencial
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          
          // UI básico (crítico)
          ui_core: ['@radix-ui/react-slot', '@radix-ui/react-toast'],
          
          // UI avançado (lazy)
          ui_advanced: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-dropdown-menu'
          ],
          
          // Utilitários
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          
          // Supabase
          supabase: ['@supabase/supabase-js'],
          
          // Query
          query: ['@tanstack/react-query'],
          
          // Icons (lazy)
          icons: ['lucide-react']
        }
      },
      onwarn(warning, warn) {
        // Suprimir warnings de dependências removidas
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.code === 'UNUSED_EXTERNAL_IMPORT' ||
          warning.message.includes('recharts') ||
          warning.message.includes('embla-carousel') ||
          warning.message.includes('react-day-picker') ||
          warning.message.includes('cmdk') ||
          warning.message.includes('vaul')
        ) {
          return;
        }
        warn(warning);
      }
    },
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: 'esbuild'
  },
  define: {
    __SUPPRESS_CONSOLE_WARNINGS__: mode === 'production',
    global: 'globalThis'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query'
    ],
    exclude: [
      // Excluir dependências removidas
      'recharts',
      'embla-carousel-react',
      'react-day-picker',
      'cmdk',
      'vaul'
    ]
  },
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    },
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
