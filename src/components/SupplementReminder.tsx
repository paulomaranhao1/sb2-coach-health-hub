
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import SupplementTimeConfig from "./daily-habit/SupplementTimeConfig";
import SupplementHeader from "./daily-habit/SupplementHeader";

const SupplementReminder = () => {
  const [morningTaken, setMorningTaken] = useState(false);
  const [eveningTaken, setEveningTaken] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Load today's supplement status
    const today = new Date().toDateString();
    const savedStatus = localStorage.getItem(`supplement_status_${today}`);
    if (savedStatus) {
      const status = JSON.parse(savedStatus);
      setMorningTaken(status.morning || false);
      setEveningTaken(status.evening || false);
    }

    return () => clearInterval(timer);
  }, []);

  const markAsTaken = (period: 'morning' | 'evening') => {
    const today = new Date().toDateString();
    const currentStatus = {
      morning: morningTaken,
      evening: eveningTaken,
      [period]: true
    };
    
    localStorage.setItem(`supplement_status_${today}`, JSON.stringify(currentStatus));
    
    if (period === 'morning') {
      setMorningTaken(true);
      toast.success("💊 SB2 TURBO da manhã registrado!");
    } else {
      setEveningTaken(true);
      toast.success("💊 SB2 TURBO da noite registrado!");
    }
  };

  const getSupplementTimes = () => {
    const saved = localStorage.getItem('sb2_supplement_times');
    return saved ? JSON.parse(saved) : { morning: '08:00', evening: '20:00' };
  };

  const times = getSupplementTimes();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

  const isTimeForMorning = currentTimeString >= times.morning && !morningTaken;
  const isTimeForEvening = currentTimeString >= times.evening && !eveningTaken;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <SupplementHeader />

        {/* Status Cards with improved spacing */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
            morningTaken 
              ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100' 
              : isTimeForMorning 
                ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100' 
                : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-800">Manhã ({times.morning})</span>
                </CardTitle>
                {morningTaken ? (
                  <Badge variant="secondary" className="bg-green-200 text-green-800 px-3 py-1 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tomado
                  </Badge>
                ) : isTimeForMorning ? (
                  <Badge variant="secondary" className="bg-orange-200 text-orange-800 px-3 py-1 text-sm font-semibold animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Hora de tomar!
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-3 py-1 text-sm">Pendente</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {!morningTaken && (
                <Button 
                  onClick={() => markAsTaken('morning')}
                  className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                    isTimeForMorning 
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Marcar como tomado
                </Button>
              )}
              {morningTaken && (
                <div className="text-center py-4">
                  <p className="text-green-700 font-semibold text-lg">
                    ✅ SB2 TURBO da manhã já foi tomado hoje!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${
            eveningTaken 
              ? 'border-green-300 bg-gradient-to-br from-green-50 to-green-100' 
              : isTimeForEvening 
                ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100' 
                : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  <span className="text-gray-800">Noite ({times.evening})</span>
                </CardTitle>
                {eveningTaken ? (
                  <Badge variant="secondary" className="bg-green-200 text-green-800 px-3 py-1 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Tomado
                  </Badge>
                ) : isTimeForEvening ? (
                  <Badge variant="secondary" className="bg-orange-200 text-orange-800 px-3 py-1 text-sm font-semibold animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Hora de tomar!
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-3 py-1 text-sm">Pendente</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {!eveningTaken && (
                <Button 
                  onClick={() => markAsTaken('evening')}
                  className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                    isTimeForEvening 
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl' 
                      : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  Marcar como tomado
                </Button>
              )}
              {eveningTaken && (
                <div className="text-center py-4">
                  <p className="text-green-700 font-semibold text-lg">
                    ✅ SB2 TURBO da noite já foi tomado hoje!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Card with better spacing */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-3">
                <Settings className="w-6 h-6 text-gray-600" />
                <span className="text-gray-800">Configurações</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
                className="px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                {showConfig ? 'Ocultar' : 'Configurar Horários'}
              </Button>
            </div>
          </CardHeader>
          {showConfig && (
            <CardContent className="pt-2">
              <SupplementTimeConfig />
            </CardContent>
          )}
        </Card>

        {/* Instructions Card with improved design */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
              💡 Como usar o SB2 TURBO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-blue-200">
                <span className="text-3xl flex-shrink-0">🌅</span>
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-900 text-lg">Manhã</h4>
                  <p className="text-blue-700 text-base leading-relaxed">
                    Tome 1 cápsula antes do café da manhã com água
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white/70 rounded-xl border border-blue-200">
                <span className="text-3xl flex-shrink-0">🌙</span>
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-900 text-lg">Noite</h4>
                  <p className="text-blue-700 text-base leading-relaxed">
                    Tome 1 cápsula antes do jantar com água
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplementReminder;
