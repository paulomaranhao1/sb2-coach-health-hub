
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusCardsProps {
  userProfile: any;
  userStats: any;
}

const StatusCards = ({ userProfile, userStats }: StatusCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg bg-gradient-to-r from-red-600 to-red-700 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
            Peso Atual
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Último registro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            {userProfile?.weight ? `${userProfile.weight} kg` : '--'}
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            {userProfile?.weight ? 'Registrado no perfil' : 'Adicione seu peso'}
          </p>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-green-700 dark:from-green-400 dark:to-green-500 bg-clip-text text-transparent">
            Meta
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Objetivo de peso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            {userProfile?.goal_weight ? `${userProfile.goal_weight} kg` : '--'}
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
            {userProfile?.weight && userProfile?.goal_weight 
              ? `Faltam ${(userProfile.weight - userProfile.goal_weight).toFixed(1)}kg` 
              : 'Defina sua meta'
            }
          </p>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
            Sequência
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Dias consecutivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 animate-pulse">
            {userStats?.streak || 0} dias
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">Usando SB2FIT</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusCards;
