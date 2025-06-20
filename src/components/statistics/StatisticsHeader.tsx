
import { BarChart3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatisticsHeaderProps {
  onShare?: () => void;
}

const StatisticsHeader = ({ onShare }: StatisticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Estatísticas Completas
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe seu progresso e conquistas em detalhes
        </p>
      </div>
      {onShare && (
        <Button 
          variant="outline" 
          onClick={onShare}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      )}
    </div>
  );
};

export default StatisticsHeader;
