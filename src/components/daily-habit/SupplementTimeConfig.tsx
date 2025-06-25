import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
interface SupplementTime {
  morning: string;
  evening: string;
}
const SupplementTimeConfig = () => {
  const [times, setTimes] = useState<SupplementTime>(() => {
    const saved = localStorage.getItem('sb2_supplement_times');
    return saved ? JSON.parse(saved) : {
      morning: '08:00',
      evening: '20:00'
    };
  });
  const [tempTimes, setTempTimes] = useState(times);
  const handleSave = () => {
    setTimes(tempTimes);
    localStorage.setItem('sb2_supplement_times', JSON.stringify(tempTimes));
    toast.success("Horários salvos com sucesso!");
  };
  const handleReset = () => {
    const defaultTimes = {
      morning: '08:00',
      evening: '20:00'
    };
    setTempTimes(defaultTimes);
    setTimes(defaultTimes);
    localStorage.setItem('sb2_supplement_times', JSON.stringify(defaultTimes));
    toast.success("Horários restaurados para o padrão!");
  };
  return <Card className="border-0 shadow-lg">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Configurar Horários SB2 TURBO
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="morning-time" className="text-sm font-medium">
              Horário da Manhã
            </Label>
            <Input id="morning-time" type="time" value={tempTimes.morning} onChange={e => setTempTimes(prev => ({
            ...prev,
            morning: e.target.value
          }))} className="w-full" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recomendado: antes do café da manhã
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evening-time" className="text-sm font-medium">
              Horário da Noite
            </Label>
            <Input id="evening-time" type="time" value={tempTimes.evening} onChange={e => setTempTimes(prev => ({
            ...prev,
            evening: e.target.value
          }))} className="w-full" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recomendado: antes do jantar
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Horários
          </Button>
          <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Restaurar Padrão
          </Button>
        </div>

        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Horários atuais:</strong> {times.morning} e {times.evening}
          </p>
        </div>
      </CardContent>
    </Card>;
};
export default SupplementTimeConfig;