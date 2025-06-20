
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AIQuickActions = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perguntas Populares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            Como acelerar o emagrecimento naturalmente?
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            Qual o melhor horário para tomar SB2 Turbo?
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            Alimentos que potencializam o emagrecimento
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            Como manter o peso após emagrecer?
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dicas Nutricionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">💡 Dica Nutricional</p>
            <p className="text-xs text-blue-700 mt-1">
              Beba água morna com limão 30 minutos antes do SB2 Turbo para potencializar a absorção
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900">🥗 Alimentação</p>
            <p className="text-xs text-green-700 mt-1">
              Priorize proteínas magras e fibras para manter a saciedade por mais tempo
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900">⏰ Timing</p>
            <p className="text-xs text-purple-700 mt-1">
              O melhor momento para exercícios é 1-2 horas após tomar o SB2 Turbo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIQuickActions;
