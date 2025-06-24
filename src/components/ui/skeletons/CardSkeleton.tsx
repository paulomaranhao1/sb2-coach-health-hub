
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  showHeader?: boolean;
  contentHeight?: string;
}

const CardSkeleton = ({ showHeader = true, contentHeight = "h-20" }: CardSkeletonProps) => {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
      )}
      <CardContent>
        <Skeleton className={`w-full ${contentHeight}`} />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
