import { Camera, Zap } from "lucide-react";
const CalorieCounterHeader = () => {
  return <div className="mb-6">
      <div className="flex items-center gap-3 mb-2 px-[24px]">
        <Camera className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-600 py-0 px-[6px]">Foto Caloria</h1>
      </div>
      <p className="text-slate-500 font-medium">Envie a foto do seu alimento e descubra as calorias com inteligência artificial, veja o histórico e as estatísticas do que você come.</p>
    </div>;
};
export default CalorieCounterHeader;