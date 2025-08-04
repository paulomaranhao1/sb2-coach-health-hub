
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense, useEffect } from "react";
import { LoadingPage } from "@/components/ui/loading-states";
import { useServiceWorker } from "@/hooks/useServiceWorker";

// Lazy load apenas a página principal
const LazyIndex = lazy(() => import("./pages/Index"));

// QueryClient otimizado com configurações mais agressivas
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1, // Reduzido para startup mais rápido
      networkMode: 'offlineFirst'
    }
  }
});

function App() {
  const { isSupported } = useServiceWorker();

  useEffect(() => {
    // Configurações mínimas para startup
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Limpar localStorage de welcome/tutorial para garantir acesso direto
    localStorage.removeItem('sb2_welcome_shown');
    localStorage.removeItem('sb2_tutorial_completed');
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
            <Suspense fallback={<LoadingPage text="Iniciando SB2coach.ai..." />}>
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
