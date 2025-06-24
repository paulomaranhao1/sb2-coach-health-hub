import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
interface NewFeaturesHeaderProps {
  onBack: () => void;
}
const NewFeaturesHeader = ({
  onBack
}: NewFeaturesHeaderProps) => {
  return <>
      <div className="flex items-center mb-6">
        <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4 bg-slate-500">
          <Sparkles className="w-8 h-8 text-yellow-300 mr-3" />
          <h1 className="text-4xl font-bold text-white">
            Novidades SB2coach.ai
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-300 ml-3" />
        </div>
        <p className="text-xl text-red-100 mb-6">
          Descubra as próximas funcionalidades que revolucionarão sua jornada
        </p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-white font-semibold">
            🚀 Funcionalidades em desenvolvimento - Em breve disponíveis!
          </p>
        </div>
      </div>
    </>;
};
export default NewFeaturesHeader;