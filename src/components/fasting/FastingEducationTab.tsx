
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const FastingEducationTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          🧬 Ciência do Jejum Intermitente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-blue-600">Fases do Jejum</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium text-sm">0-4h: Digestão</p>
                  <p className="text-xs text-gray-600">Absorção de nutrientes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div>
                  <p className="font-medium text-sm">4-12h: Glicogênio</p>
                  <p className="text-xs text-gray-600">Uso das reservas de açúcar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div>
                  <p className="font-medium text-sm">12-18h: Cetose</p>
                  <p className="text-xs text-gray-600">Queima de gordura intensificada</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div>
                  <p className="font-medium text-sm">18+h: Autofagia</p>
                  <p className="text-xs text-gray-600">Limpeza e regeneração celular</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-green-600">Benefícios Comprovados</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="font-medium text-sm">🔥 Perda de Peso</p>
                <p className="text-xs text-gray-600">Acelera metabolismo em até 14%</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-medium text-sm">🧠 Saúde Cerebral</p>
                <p className="text-xs text-gray-600">Aumenta BDNF em até 400%</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="font-medium text-sm">❤️ Saúde Cardíaca</p>
                <p className="text-xs text-gray-600">Reduz pressão e colesterol</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="font-medium text-sm">⚡ Longevidade</p>
                <p className="text-xs text-gray-600">Ativa genes de longevidade</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FastingEducationTab;
