
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Droplets, Pill, Heart, Gift } from "lucide-react";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InstructionsDialog = ({ open, onOpenChange }: InstructionsDialogProps) => {
  const handleDismiss = () => {
    localStorage.setItem('sb2_instructions_dismissed', 'true');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            🎯 Como usar sua Rotina Diária
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ✨ Siga esta ordem para máximos resultados:
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">1. Registre seu Peso</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Acompanhe sua evolução diariamente</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full">
                <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">2. Beba Água</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Mantenha-se hidratado durante o dia</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-full">
                <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">3. Tome seus Suplementos</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Siga os horários configurados</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="bg-red-100 dark:bg-red-800/30 p-2 rounded-full">
                <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">4. Mantenha-se Motivado</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Leia sua mensagem motivacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="bg-yellow-100 dark:bg-yellow-800/30 p-2 rounded-full">
                <Gift className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">5. Colete seus Pontos Diários</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ganhe 10 pontos por dia para subir de nível!</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
              🏆 Dica importante:
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Seguindo essa rotina diariamente, você maximiza seus resultados e ainda ganha pontos para desbloquear conquistas!
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Fechar
          </Button>
          <Button 
            onClick={handleDismiss}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Entendi! Não mostrar novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
