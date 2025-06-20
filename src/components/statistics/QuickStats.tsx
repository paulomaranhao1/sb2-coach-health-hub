
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Target, Award } from "lucide-react";

interface QuickStatsProps {
  userProfile: any;
  userStats: any;
  weightHistory?: any[];
}

const QuickStats = ({ userProfile, userStats, weightHistory = [] }: QuickStatsProps) => {
  const currentWeight = userProfile?.weight || 0;
  const goalWeight = userProfile?.goal_weight || 0;
  const weightLoss = weightHistory.length > 0 ? 
    (weightHistory[0].weight - weightHistory[weightHistory.length - 1].weight) : 0;
  const remaining = currentWeight - goalWeight;

  const stats = [
    {
      icon: TrendingDown,
      label: "Perdidos",
      value: `${weightLoss.toFixed(1)}kg`,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Target,
      label: "Restantes",
      value: `${remaining.toFixed(1)}kg`,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: TrendingUp,
      label: "Nível",
      value: userStats?.level || 1,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: Award,
      label: "Sequência",
      value: `${userStats?.streak || 0} dias`,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
