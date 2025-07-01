
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { preloadCriticalResources } from "@/utils/optimizedPerformance";
import { cleanupUnusedScripts, cleanupUnusedPreloads, optimizeConsoleOutput } from "@/utils/cleanupScripts";
import { lazy, Suspense, useEffect } from "react";
import { LoadingPage } from "@/components/ui/loading-states";

const LazyIndex = lazy(() => import("./pages/Index"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1
    }
  }
});

function App() {
  useEffect(() => {
    // Otimizar console output primeiro
    optimizeConsoleOutput();
    
    // Preload apenas recursos críticos
    preloadCriticalResources();
    
    // Limpar scripts e elementos não utilizados
    cleanupUnusedScripts();
    cleanupUnusedPreloads();
    
    // Force light theme
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="w-full min-h-screen bg-slate-50">
          <Sonner 
            position="top-center"
            toastOptions={{
              style: {
                background: 'white',
                color: 'rgb(51 65 85)',
                border: '1px solid rgb(226 232 240)'
              }
            }}
          />
          <Router>
            <Suspense fallback={<LoadingPage text="Carregando SB2coach.ai..." />}>
              <Routes>
                <Route path="/" element={<LazyIndex />} />
                <Route path="*" element={<LazyIndex />} />
              </Routes>
            </Suspense>
          </Router>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
