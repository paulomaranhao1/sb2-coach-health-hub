
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

export const GamificationCardsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-[10px] px-[10px] bg-slate-200 rounded-2xl">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="glass border-0 shadow-lg">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const StatusCardsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const ProgressChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-64 w-full" />
    </CardContent>
  </Card>
);

export const LoadingCard = ({ text = "Carregando dados..." }: { text?: string }) => {
  return (
    <div className="w-full h-32 bg-card/50 backdrop-blur-sm rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center animate-pulse">
      <Loading text={text} variant="zap" />
    </div>
  );
};

export const LoadingSection = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading text={text} variant="heart" />
    </div>
  );
};

export const LoadingPage = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="lg" text={text} variant="heart" />
      </div>
    </div>
  );
};
