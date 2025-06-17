
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Bell, Users } from "lucide-react";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "Maria Silva",
    email: "maria.silva@email.com",
    startDate: "2024-01-01",
    currentWeight: "72.5",
    goalWeight: "68.0",
    height: "165",
    age: "32"
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Meu Perfil
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/api/placeholder/80/80" />
              <AvatarFallback className="text-lg">MS</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                Membro desde Jan 2024
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
              <Input
                id="currentWeight"
                type="number"
                step="0.1"
                value={profile.currentWeight}
                onChange={(e) => setProfile({...profile, currentWeight: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="goalWeight">Meta de Peso (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                value={profile.goalWeight}
                onChange={(e) => setProfile({...profile, goalWeight: e.target.value})}
              />
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Salvar Alterações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Configurações de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Lembretes de Suplemento</p>
              <p className="text-sm text-gray-600">Receba notificações para tomar o SB2 Turbo</p>
            </div>
            <Button variant="outline" size="sm">Configurar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Relatórios Semanais</p>
              <p className="text-sm text-gray-600">Receba resumo do seu progresso</p>
            </div>
            <Button variant="outline" size="sm">Ativar</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dicas de Motivação</p>
              <p className="text-sm text-gray-600">Mensagens inspiradoras diárias</p>
            </div>
            <Button variant="outline" size="sm">Ativar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Suas Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <p className="font-medium text-green-900">Primeira Meta</p>
                <p className="text-sm text-green-700">Perdeu os primeiros 2kg</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl">🔥</div>
              <div>
                <p className="font-medium text-blue-900">Sequência</p>
                <p className="text-sm text-blue-700">12 dias seguidos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl">💪</div>
              <div>
                <p className="font-medium text-purple-900">Consistência</p>
                <p className="text-sm text-purple-700">93% de aderência</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl">📊</div>
              <div>
                <p className="font-medium text-orange-900">Progresso</p>
                <p className="text-sm text-orange-700">37% da meta alcançada</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
