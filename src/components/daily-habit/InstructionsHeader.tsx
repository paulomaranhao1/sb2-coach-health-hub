
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface InstructionsHeaderProps {
  onShowInstructions: () => void;
}

const InstructionsHeader = ({ onShowInstructions }: InstructionsHeaderProps) => {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-blue-800 dark:text-blue-200">
              📋 Rotina Diária - Siga a ordem dos botões + Colete seus pontos!
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onShowInstructions}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30 font-bold"
          >
            Ver instruções
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructionsHeader;
