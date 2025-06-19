
import { Card, CardContent } from "@/components/ui/card";

const SupplementInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="glass border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Dosagem SB2 TURBO</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">2 cápsulas/dia</p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Meta de Água</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              10 copos/dia 💧
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementInfo;
