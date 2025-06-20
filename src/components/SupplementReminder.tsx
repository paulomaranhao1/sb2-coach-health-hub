import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lightbulb, MessageCircle } from "lucide-react";
import SupplementTimeConfig from "./daily-habit/SupplementTimeConfig";
import ReminderSettings from "./ReminderSettings";

const SupplementReminder = () => {
  const importantTips = [
    {
      icon: "🤖",
      title: "Chat IA Personalizado",
      description: "Ative o recurso de Chat IA para receber recomendações personalizadas baseadas no seu perfil e objetivos",
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700"
    },
    {
      icon: "💧",
      title: "Hidratação Essencial",
      description: "Tome sempre com água e mantenha-se hidratado - mínimo 2 litros por dia",
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
    },
    {
      icon: "🥗",
      title: "Alimentação Balanceada",
      description: "Combine com uma dieta equilibrada rica em proteínas, fibras e nutrientes para potencializar os resultados",
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
    },
    {
      icon: "🏃‍♀️",
      title: "Atividade Física Regular",
      description: "Pratique exercícios pelo menos 3x por semana - combine cardio e musculação para melhores resultados",
      color: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700"
    },
    {
      icon: "😴",
      title: "Sono de Qualidade",
      description: "Durma de 7-9 horas por noite - o sono adequado é fundamental para a recuperação e metabolismo",
      color: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700"
    },
    {
      icon: "📊",
      title: "Monitore seu Progresso",
      description: "Registre seu peso regularmente e acompanhe suas métricas no app para manter a motivação",
      color: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Configuração de Horários */}
      <SupplementTimeConfig />

      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            SB2 Turbo - Rotina Diária
          </CardTitle>
          <CardDescription className="text-white/90">
            2 cápsulas por dia conforme orientação - lembretes automáticos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-white">Manhã</h4>
              <p className="text-sm text-white/90">1 cápsula antes do café</p>
              <p className="text-xs text-white/80 mt-1">Lembrete automático no horário configurado</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-white">Noite</h4>
              <p className="text-sm text-white/90">1 cápsula antes do jantar</p>
              <p className="text-xs text-white/80 mt-1">Lembrete automático no horário configurado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Dicas Importantes para Melhores Resultados
          </CardTitle>
          <CardDescription>
            Siga essas orientações para maximizar os benefícios do SB2 TURBO
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {importantTips.map((tip, index) => (
            <div key={index} className={`flex items-start gap-3 p-4 rounded-lg border ${tip.color}`}>
              <div className="text-2xl flex-shrink-0">{tip.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{tip.title}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-purple-800 dark:text-purple-200 mb-1">💡 Dica Especial</p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Use o Chat IA regularmente para receber orientações personalizadas sobre dieta, exercícios e otimização dos seus resultados com SB2 TURBO!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReminderSettings />
    </div>
  );
};

export default SupplementReminder;
