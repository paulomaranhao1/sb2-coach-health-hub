
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, Timer, Camera, Star } from 'lucide-react';
import AchievementCard from './AchievementCard';

interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'weight' | 'fasting' | 'calories' | 'general';
  points: number;
  requirement: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface AchievementTabsProps {
  achievements: Achievement[];
  userAchievements: string[];
}

const AchievementTabs = ({ achievements, userAchievements }: AchievementTabsProps) => {
  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.category === category).map(achievement => ({
      ...achievement,
      isUnlocked: userAchievements.includes(achievement.id)
    }));
  };

  return (
    <Tabs defaultValue="weight" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="weight" className="flex items-center gap-2">
          <Scale className="w-4 h-4" />
          Peso
        </TabsTrigger>
        <TabsTrigger value="fasting" className="flex items-center gap-2">
          <Timer className="w-4 h-4" />
          Jejum
        </TabsTrigger>
        <TabsTrigger value="calories" className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          Calorias
        </TabsTrigger>
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          Geral
        </TabsTrigger>
      </TabsList>

      {(['weight', 'fasting', 'calories', 'general'] as const).map(category => (
        <TabsContent key={category} value={category} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAchievementsByCategory(category).map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AchievementTabs;
