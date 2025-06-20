
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StatisticsHeader from "./StatisticsHeader";
import QuickStats from "./QuickStats";
import ProgressOverview from "./ProgressOverview";
import StatusCards from "../home/StatusCards";
import GamificationCards from "../home/GamificationCards";
import ProgressDashboard from "../ProgressDashboard";

interface StatisticsOverviewProps {
  userProfile: any;
  userStats: any;
}

const StatisticsOverview = ({ userProfile, userStats }: StatisticsOverviewProps) => {
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWeightHistory();
  }, []);

  const loadWeightHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setWeightHistory(data || []);
    } catch (error) {
      console.error('Error loading weight history:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareProgress = async () => {
    const currentWeight = weightHistory.length > 0 ? 
      weightHistory[weightHistory.length - 1].weight : userProfile?.weight || 0;
    const initialWeight = weightHistory.length > 0 ? weightHistory[0].weight : 0;
    const weightLoss = initialWeight - currentWeight;

    try {
      const shareData = {
        title: 'SB2FIT - Meu Progresso',
        text: `Estou usando o SB2FIT! ${weightLoss > 0 ? `Já perdi ${weightLoss.toFixed(1)}kg` : `Peso atual: ${currentWeight}kg`} 💪`,
        url: window.location.origin
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link copiado!",
          description: "Cole onde quiser compartilhar seu progresso"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatisticsHeader onShare={shareProgress} />
      
      <QuickStats 
        userProfile={userProfile} 
        userStats={userStats} 
        weightHistory={weightHistory}
      />
      
      <ProgressOverview userProfile={userProfile} userStats={userStats} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <StatusCards userProfile={userProfile} userStats={userStats} />
        </div>
        <div className="space-y-6">
          <GamificationCards userStats={userStats} />
        </div>
      </div>
      
      <ProgressDashboard />
    </div>
  );
};

export default StatisticsOverview;
