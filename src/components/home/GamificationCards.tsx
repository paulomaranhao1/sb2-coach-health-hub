import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface GamificationCardsProps {
  userStats: any;
}
const GamificationCards = ({
  userStats
}: GamificationCardsProps) => {
  if (!userStats) return null;
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 py-[10px] px-[10px] bg-slate-200">
      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            🏆 Nível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.level}</div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            ⭐ Pontos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.points}</div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            🛡️ Escudos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.shields?.length || 0}</div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
            🎨 Figurinhas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{userStats.stickers?.length || 0}</div>
        </CardContent>
      </Card>
    </div>;
};
export default GamificationCards;