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
    <div className="space-y-6">
      <SupplementHeader />

      <div className="grid gap-6">
        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className={`border-2 ${morningTaken ? 'border-green-200 bg-green-50' : isTimeForMorning ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Manhã ({times.morning})
                </CardTitle>
                {morningTaken ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Tomado
                  </Badge>
                ) : isTimeForMorning ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Hora de tomar!
                  </Badge>
                ) : (
                  <Badge variant="outline">Pendente</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!morningTaken && (
                <Button 
                  onClick={() => markAsTaken('morning')}
                  className="w-full"
                  variant={isTimeForMorning ? "default" : "outline"}
                >
                  Marcar como tomado
                </Button>
              )}
              {morningTaken && (
                <p className="text-green-600 font-medium text-center">
                  ✅ SB2 TURBO da manhã já foi tomado hoje!
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={`border-2 ${eveningTaken ? 'border-green-200 bg-green-50' : isTimeForEvening ? 'border-orange-200 bg-orange-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Noite ({times.evening})
                </CardTitle>
                {eveningTaken ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Tomado
                  </Badge>
                ) : isTimeForEvening ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Hora de tomar!
                  </Badge>
                ) : (
                  <Badge variant="outline">Pendente</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!eveningTaken && (
                <Button 
                  onClick={() => markAsTaken('evening')}
                  className="w-full"
                  variant={isTimeForEvening ? "default" : "outline"}
                >
                  Marcar como tomado
                </Button>
              )}
              {eveningTaken && (
                <p className="text-green-600 font-medium text-center">
                  ✅ SB2 TURBO da noite já foi tomado hoje!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
              >
                {showConfig ? 'Ocultar' : 'Configurar Horários'}
              </Button>
            </div>
          </CardHeader>
          {showConfig && (
            <CardContent>
              <SupplementTimeConfig />
            </CardContent>
          )}
        </Card>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💡 Como usar o SB2 TURBO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌅</span>
                <div>
                  <h4 className="font-semibold text-blue-800">Manhã</h4>
                  <p className="text-blue-600 text-sm">Tome 1 cápsula antes do café da manhã com água</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌙</span>
                <div>
                  <h4 className="font-semibold text-blue-800">Noite</h4>
                  <p className="text-blue-600 text-sm">Tome 1 cápsula antes do jantar com água</p>
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
