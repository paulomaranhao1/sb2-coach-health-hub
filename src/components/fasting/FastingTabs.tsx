
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Settings, Clock, Flame, Brain, Heart, Zap } from "lucide-react";

interface FastingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: string;
  completed: boolean;
}

interface FastingGoal {
  weekly: number;
  monthly: number;
  currentWeek: number;
  currentMonth: number;
}

interface FastingTabsProps {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  reminders: {
    start: boolean;
    halfway: boolean;
    end: boolean;
  };
  setReminders: (reminders: any) => void;
  fastingGoals: FastingGoal;
  setFastingGoals: (goals: any) => void;
  fastingHistory: FastingSession[];
  totalFasts: number;
  fastingPlans: any;
}

const FastingTabs = ({
  notifications,
  setNotifications,
  reminders,
  setReminders,
  fastingGoals,
  setFastingGoals,
  fastingHistory,
  totalFasts,
  fastingPlans
}: FastingTabsProps) => {
  return (
    <Tabs defaultValue="benefits" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="benefits">Benefícios</TabsTrigger>
        <TabsTrigger value="tips">Dicas</TabsTrigger>
        <TabsTrigger value="science">Ciência</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
      </TabsList>
      
      <TabsContent value="benefits" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>🧬 Benefícios Científicos do Jejum Intermitente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                  <Flame className="w-4 h-4" /> Perda de Peso
                </h4>
                <p className="text-sm">Acelera o metabolismo e promove a queima de gordura corporal de forma eficiente</p>
                <Badge variant="secondary" className="text-xs">Queima 300-700+ calorias extras</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Saúde Cerebral
                </h4>
                <p className="text-sm">Melhora a função cognitiva, memória e pode proteger contra Alzheimer</p>
                <Badge variant="secondary" className="text-xs">+40% BDNF (fator de crescimento neural)</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-600">🔄 Autofagia</h4>
                <p className="text-sm">Processo de limpeza celular que remove componentes danificados e toxinas</p>
                <Badge variant="secondary" className="text-xs">Ativa após 16-18h de jejum</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-600 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Saúde Cardiovascular
                </h4>
                <p className="text-sm">Reduz pressão arterial, colesterol e inflamação</p>
                <Badge variant="secondary" className="text-xs">-10-15% fatores de risco</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-600">📈 Sensibilidade à Insulina</h4>
                <p className="text-sm">Melhora controle glicêmico e previne diabetes tipo 2</p>
                <Badge variant="secondary" className="text-xs">+20-30% sensibilidade</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Energia e Longevidade
                </h4>
                <p className="text-sm">Energia mais estável, hormônios otimizados e aumento da longevidade</p>
                <Badge variant="secondary" className="text-xs">+15-20% expectativa de vida (estudos)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="tips" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>💡 Dicas Avançadas para Jejum de Sucesso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold">Hidratação Estratégica</h4>
                  <p className="text-sm text-gray-600 mb-2">Beba 2-3L de água, chás sem açúcar e café preto. Adicione eletrólitos se necessário.</p>
                  <Badge variant="outline" className="text-xs">🧂 Pitada de sal rosa no primeiro copo</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold">Progressão Inteligente</h4>
                  <p className="text-sm text-gray-600 mb-2">12:12 → 14:10 → 16:8 → 18:6. Aumente 2h por semana.</p>
                  <Badge variant="outline" className="text-xs">📈 Adaptação gradual = sucesso sustentável</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold">Atividades Produtivas</h4>
                  <p className="text-sm text-gray-600 mb-2">Trabalho, exercícios leves, leitura, meditação durante o jejum.</p>
                  <Badge variant="outline" className="text-xs">🧘‍♀️ Mindfulness potencializa os benefícios</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 className="font-semibold">Quebra de Jejum Perfeita</h4>
                  <p className="text-sm text-gray-600 mb-2">Comece com vegetais, proteínas magras, gorduras boas. Evite açúcar e carboidratos refinados.</p>
                  <Badge variant="outline" className="text-xs">🥗 1ª refeição determina como você se sentirá</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <div>
                  <h4 className="font-semibold">Sinais do Corpo</h4>
                  <p className="text-sm text-gray-600 mb-2">Tontura, fraqueza extrema, náusea = pare imediatamente. Jejum deve ser confortável.</p>
                  <Badge variant="destructive" className="text-xs">⚠️ Sua segurança é prioridade</Badge>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                <div>
                  <h4 className="font-semibold">Timing Ideal</h4>
                  <p className="text-sm text-gray-600 mb-2">Termine a última refeição às 20h, quebre o jejum às 12h (16:8). Alinhado com ritmo circadiano.</p>
                  <Badge variant="outline" className="text-xs">🌙 Jejum durante o sono = mais fácil</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="science" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              🔬 A Ciência por Trás do Jejum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600">Fases do Jejum</h4>
                <div className="mt-2 space-y-2 text-sm">
                  <p><strong>0-4h:</strong> Digestão e absorção</p>
                  <p><strong>4-12h:</strong> Estado pós-absortivo, uso de glicogênio</p>
                  <p><strong>12-18h:</strong> Cetose inicial, queima de gordura</p>
                  <p><strong>18-24h:</strong> Autofagia ativa, regeneração celular</p>
                  <p><strong>24h+:</strong> Cetose profunda, máximos benefícios</p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600">Hormônios Otimizados</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p>• <strong>Hormônio do Crescimento:</strong> +1300-2000%</p>
                  <p>• <strong>Noradrenalina:</strong> +117% (queima gordura)</p>
                  <p>• <strong>Insulina:</strong> -20-31% (sensibilidade melhora)</p>
                  <p>• <strong>IGF-1:</strong> Redução controlada (longevidade)</p>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-600">Estudos Recentes</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p>• <strong>Harvard 2023:</strong> JI reduz inflamação em 40%</p>
                  <p>• <strong>Cell 2022:</strong> Autofagia previne câncer</p>
                  <p>• <strong>Nature 2023:</strong> Jejum aumenta longevidade</p>
                  <p>• <strong>NEJM 2019:</strong> Benefícios cardiovasculares comprovados</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações do Jejum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notificações */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Notificações</h4>
                  <p className="text-sm text-gray-600">Receber alertas sobre o jejum</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              {notifications && (
                <div className="ml-4 space-y-3 border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Início do jejum</label>
                    <Switch
                      checked={reminders.start}
                      onCheckedChange={(checked) => setReminders(prev => ({ ...prev, start: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Meio do jejum (50%)</label>
                    <Switch
                      checked={reminders.halfway}
                      onCheckedChange={(checked) => setReminders(prev => ({ ...prev, halfway: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">Final do jejum</label>
                    <Switch
                      checked={reminders.end}
                      onCheckedChange={(checked) => setReminders(prev => ({ ...prev, end: checked }))}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Metas */}
            <div className="space-y-4">
              <h4 className="font-semibold">Metas Personalizadas</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Jejuns por semana</label>
                  <Select
                    value={fastingGoals.weekly.toString()}
                    onValueChange={(value) => setFastingGoals(prev => ({ ...prev, weekly: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 jejuns</SelectItem>
                      <SelectItem value="4">4 jejuns</SelectItem>
                      <SelectItem value="5">5 jejuns</SelectItem>
                      <SelectItem value="6">6 jejuns</SelectItem>
                      <SelectItem value="7">7 jejuns (diário)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Jejuns por mês</label>
                  <Select
                    value={fastingGoals.monthly.toString()}
                    onValueChange={(value) => setFastingGoals(prev => ({ ...prev, monthly: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 jejuns</SelectItem>
                      <SelectItem value="20">20 jejuns</SelectItem>
                      <SelectItem value="25">25 jejuns</SelectItem>
                      <SelectItem value="30">30 jejuns (diário)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="history" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📊 Histórico Detalhado</span>
              <Badge variant="secondary">{totalFasts} registros</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fastingHistory.length > 0 ? (
              <div className="space-y-3">
                {fastingHistory.slice(0, 20).map((fast) => (
                  <div key={fast.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${fast.completed ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{fast.type}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(fast.startTime).toLocaleDateString('pt-BR')} às {new Date(fast.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {fast.completed && fast.endTime && (
                          <p className="text-xs text-gray-500">
                            Duração: {Math.round((new Date(fast.endTime).getTime() - new Date(fast.startTime).getTime()) / (1000 * 60 * 60))}h
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={fast.completed ? "default" : "secondary"}>
                        {fast.completed ? "✅ Completo" : "❌ Interrompido"}
                      </Badge>
                      {fast.completed && (
                        <p className="text-xs text-green-600 mt-1">
                          +{fastingPlans[fast.type as keyof typeof fastingPlans]?.calories?.replace('Queima ', '').replace(' extra', '') || '50 pontos'}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {fastingHistory.length > 20 && (
                  <p className="text-center text-sm text-gray-500 pt-4 border-t">
                    E mais {fastingHistory.length - 20} registros...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Nenhum jejum registrado ainda</p>
                <p className="text-sm text-gray-500">Comece seu primeiro jejum para ver o histórico aqui!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FastingTabs;
