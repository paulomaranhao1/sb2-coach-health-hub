
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Droplets, Pill, Heart, Gift } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructionsDialog = ({
  open,
  onOpenChange
}: InstructionsDialogProps) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('sb2_instructions_dismissed', 'true');
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-md mx-auto border border-gray-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-slate-700 mb-2 sm:mb-4">
            🎯 Como usar sua Rotina Diária
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4 text-slate-600 max-h-[60vh] overflow-y-auto">
          <div className="p-3 sm:p-4 rounded-lg border border-blue-200 bg-blue-50">
            <p className="text-xs sm:text-sm font-semibold mb-2 text-blue-800">
              ✨ Siga esta ordem para máximos resultados:
            </p>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="bg-green-100 p-1.5 sm:p-2 rounded-full">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-green-800">1. Registre seu Peso</p>
                <p className="text-xs text-green-700">Acompanhe sua evolução diariamente</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full">
                <Droplets className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-blue-800">2. Beba Água</p>
                <p className="text-xs text-blue-700">Mantenha-se hidratado durante o dia</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="bg-purple-100 p-1.5 sm:p-2 rounded-full">
                <Pill className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-purple-800">3. Tome seus Suplementos</p>
                <p className="text-xs text-purple-700">Siga os horários configurados</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="bg-red-100 p-1.5 sm:p-2 rounded-full">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-red-800">4. Mantenha-se Motivado</p>
                <p className="text-xs text-red-700">Leia sua mensagem motivacional</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-yellow-200 bg-yellow-50">
              <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-full">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-semibold text-xs sm:text-sm text-yellow-800">5. Colete seus Pontos Diários</p>
                <p className="text-xs text-yellow-700">Ganhe 10 pontos por dia para subir de nível!</p>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-lg border border-green-200 bg-green-50">
            <p className="text-xs sm:text-sm font-semibold text-green-800 mb-1">
              🏆 Dica importante:
            </p>
            <p className="text-xs text-green-700">
              Seguindo essa rotina diariamente, você maximiza seus resultados e ainda ganha pontos para desbloquear conquistas!
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4 sm:mt-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dont-show-again" 
              checked={dontShowAgain} 
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)} 
            />
            <label htmlFor="dont-show-again" className="text-xs sm:text-sm text-slate-600 cursor-pointer">
              Não mostrar novamente
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 text-xs sm:text-sm">
              Fechar
            </Button>
            <Button onClick={handleClose} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
              Entendi!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
