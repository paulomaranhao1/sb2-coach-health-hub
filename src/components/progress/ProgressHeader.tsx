
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ProgressHeaderProps {
  hasData: boolean;
  onShare: () => void;
}

const ProgressHeader = ({ hasData, onShare }: ProgressHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">📊 Dashboard Completo</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral do seu progresso e estatísticas</p>
      </div>
      {hasData && (
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

export default ProgressHeader;
