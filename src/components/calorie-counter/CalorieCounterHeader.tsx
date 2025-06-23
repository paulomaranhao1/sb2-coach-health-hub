
import { Camera, Zap } from "lucide-react";

const CalorieCounterHeader = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <Camera className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-600">
          Contador de Calorias
        </h1>
      </div>
      <p className="text-slate-500 font-medium">
        Descubra as calorias dos seus alimentos com inteligência artificial
      </p>
    </div>
  );
};

export default CalorieCounterHeader;
