
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructionsDialog = ({ open, onOpenChange }: InstructionsDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('sb2_instructions_dismissed', 'true');
    }
    onOpenChange(false);
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setDontShowAgain(checked === true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Info className="w-5 h-5" />
            📋 Rotina Diária - Como usar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Clique em cada ação conforme realizar durante o dia:
          </p>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500 dark:text-red-400">1.</span>
              <div className="text-gray-800 dark:text-gray-100">
                <strong>Registrar Peso:</strong> Anote seu peso do dia para acompanhar seu progresso
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500 dark:text-red-400">2.</span>
              <div className="text-gray-800 dark:text-gray-100">
                <strong>Hidratação:</strong> Registre copos (200ml) ou garrafas (500ml) conforme beber água
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500 dark:text-red-400">3.</span>
              <div className="text-gray-800 dark:text-gray-100">
                <strong>SB2 TURBO Manhã:</strong> Marque quando tomar a primeira dose do suplemento
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500 dark:text-red-400">4.</span>
              <div className="text-gray-800 dark:text-gray-100">
                <strong>Primeira Refeição:</strong> Marque quando fizer sua primeira refeição do dia
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-semibold text-red-500 dark:text-red-400">5.</span>
              <div className="text-gray-800 dark:text-gray-100">
                <strong>SB2 TURBO Noite:</strong> Marque quando tomar a segunda dose do suplemento
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300">
              💡 <strong>Dica:</strong> Siga essa ordem para melhores resultados em sua jornada de emagrecimento!
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="dont-show-again"
              className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              Não exibir mais estas instruções
            </label>
          </div>
          
          <Button onClick={handleClose} className="w-full">
            Entendi! 👍
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
