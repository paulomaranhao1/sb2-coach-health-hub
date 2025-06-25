
import { BarChart3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatisticsHeaderProps {
  onShare?: () => void;
}

const StatisticsHeader = ({ onShare }: StatisticsHeaderProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-2 px-[24px]">
          <BarChart3 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-slate-600 py-0 px-[6px]">
            Estatísticas Completas
          </h1>
        </div>
        {onShare && (
          <Button 
            variant="outline" 
            onClick={onShare}
            size="sm"
            className="flex items-center gap-2 mr-6"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        )}
      </div>
      <p className="text-slate-500 font-medium px-[24px]">
        Acompanhe seu progresso e conquistas em detalhes
      </p>
    </div>
  );
};

export default StatisticsHeader;
