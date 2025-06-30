
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { preloadCriticalResources } from "@/utils/optimizedPerformance";

// Lazy load pages for better performance
import { lazy, Suspense, useEffect } from "react";
import { LoadingPage } from "@/components/ui/loading-states";

const LazyIndex = lazy(() => import("./pages/Index"));
const LazyNotFound = lazy(() => import("./pages/NotFound"));
const LazyPrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LazyTermsOfService = lazy(() => import("./pages/TermsOfService"));
const LazyRoadmap = lazy(() => import("./pages/Roadmap"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    },
    mutations: {
      retry: 1
    }
  }
});

function App() {
  useEffect(() => {
    // Preload critical resources on app start
    preloadCriticalResources();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <Router>
          <Suspense fallback={<LoadingPage text="Carregando SB2coach.ai..." />}>
            <Routes>
              <Route path="/" element={<LazyIndex />} />
              <Route 
                path="/privacy-policy" 
                element={
                  <Suspense fallback={<LoadingPage text="Carregando..." />}>
                    <LazyPrivacyPolicy />
                  </Suspense>
                } 
              />
              <Route 
                path="/terms-of-service" 
                element={
                  <Suspense fallback={<LoadingPage text="Carregando..." />}>
                    <LazyTermsOfService />
                  </Suspense>
                } 
              />
              <Route 
                path="/roadmap" 
                element={
                  <Suspense fallback={<LoadingPage text="Carregando..." />}>
                    <LazyRoadmap />
                  </Suspense>
                } 
              />
              <Route 
                path="*" 
                element={
                  <Suspense fallback={<LoadingPage text="Carregando..." />}>
                    <LazyNotFound />
                  </Suspense>
                } 
              />
            </Routes>
          </Suspense>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
