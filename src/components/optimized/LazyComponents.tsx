
import { lazy } from 'react';

// Lazy loading para componentes pesados
export const LazyProgressDashboard = lazy(() => import('@/components/ProgressDashboard'));
export const LazyStatisticsOverview = lazy(() => import('@/components/statistics/StatisticsOverview'));
export const LazyWeightEvolutionChart = lazy(() => import('@/components/progress/WeightEvolutionChart'));
export const LazySecondaryCharts = lazy(() => import('@/components/progress/SecondaryCharts'));
export const LazyPhotoAnalyzer = lazy(() => import('@/components/calorie-counter/PhotoAnalyzer'));
export const LazyAnalysisHistory = lazy(() => import('@/components/calorie-counter/AnalysisHistory'));

// Componente de fallback para loading
export const ChartLoadingFallback = () => (
  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      <p className="text-sm text-gray-600">Carregando gráficos...</p>
    </div>
  </div>
);

export const ComponentLoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);
