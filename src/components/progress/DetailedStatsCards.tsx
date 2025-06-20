
import { Card, CardContent } from "@/components/ui/card";

const DetailedStatsCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">93%</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">Aderência</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">Dias seguidos</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">0.4kg</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">Perda semanal</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">24.1</p>
            <p className="text-sm text-slate-800 dark:text-slate-200">IMC atual</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedStatsCards;
