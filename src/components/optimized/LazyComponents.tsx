
import { lazy, Suspense } from 'react';
import { LoadingCard, LoadingSection } from '@/components/ui/loading-states';
import { Card, CardContent } from '@/components/ui/card';

// Lazy loading para componentes pesados
export const LazyDashboardOverview = lazy(() => import('@/features/dashboard/components/DashboardOverview'));
export const LazyWeightEvolutionChart = lazy(() => import('@/components/progress/WeightEvolutionChart'));
export const LazySecondaryCharts = lazy(() => import('@/components/progress/SecondaryCharts'));
export const LazyPhotoAnalyzer = lazy(() => import('@/features/calorie-counter/components/PhotoAnalyzer'));
export const LazyAnalysisHistory = lazy(() => import('@/features/calorie-counter/components/AnalysisHistory'));
export const LazyAIChat = lazy(() => import('@/components/AIChat'));
export const LazyUserProfile = lazy(() => import('@/components/UserProfile'));
export const LazyAppSettings = lazy(() => import('@/components/AppSettings'));

// Componentes de fallback mais sofisticados
export const ChartLoadingFallback = () => (
  <Card className="animate-pulse">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <LoadingSection text="Carregando gráfico..." />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ComponentLoadingFallback = () => (
  <LoadingCard text="Carregando componente..." />
);

export const DashboardLoadingFallback = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    </div>
  </div>
);

export const ProfileLoadingFallback = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// HOCs para facilitar o uso de lazy loading
export const withLazyLoading = <P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent: React.ComponentType = ComponentLoadingFallback
) => {
  const LazyComponent: React.FC<P> = (props) => (
    <Suspense fallback={<FallbackComponent />}>
      <Component {...props} />
    </Suspense>
  );
  
  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  return LazyComponent;
};

// Lazy wrappers prontos para usar
export const LazyDashboardOverviewWithFallback = withLazyLoading(
  LazyDashboardOverview, 
  DashboardLoadingFallback
);

export const LazyWeightEvolutionChartWithFallback = withLazyLoading(
  LazyWeightEvolutionChart,
  ChartLoadingFallback
);

export const LazyUserProfileWithFallback = withLazyLoading(
  LazyUserProfile,
  ProfileLoadingFallback
);
