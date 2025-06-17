
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MessageSquare, User, Users, Home } from "lucide-react";
import WeightTracker from "@/components/WeightTracker";
import SupplementReminder from "@/components/SupplementReminder";
import AIChat from "@/components/AIChat";
import ProgressDashboard from "@/components/ProgressDashboard";
import UserProfile from "@/components/UserProfile";
import WelcomeScreen from "@/components/WelcomeScreen";
import DailyHabit from "@/components/DailyHabit";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S2</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SB2fit</h1>
                <p className="text-sm text-gray-600">Seu companheiro de emagrecimento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Bell className="w-3 h-3 mr-1" />
                3 lembretes ativos
              </Badge>
              <Button size="sm" variant="outline">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="home">
              <Home className="w-4 h-4 mr-1" />
              Início
            </TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="weight">Peso</TabsTrigger>
            <TabsTrigger value="supplement">Suplemento</TabsTrigger>
            <TabsTrigger value="chat">AI Coach</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peso Atual</CardTitle>
                  <CardDescription className="text-blue-100">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72.5 kg</div>
                  <p className="text-sm text-blue-100 mt-1">-2.3kg este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Meta</CardTitle>
                  <CardDescription className="text-purple-100">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.0 kg</div>
                  <p className="text-sm text-purple-100 mt-1">Faltam 4.5kg</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                  <CardDescription className="text-green-100">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12 dias</div>
                  <p className="text-sm text-green-100 mt-1">Tomando SB2 Turbo</p>
                </CardContent>
              </Card>
            </div>

            <DailyHabit />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peso Atual</CardTitle>
                  <CardDescription className="text-blue-100">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72.5 kg</div>
                  <p className="text-sm text-blue-100 mt-1">-2.3kg este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Meta</CardTitle>
                  <CardDescription className="text-purple-100">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.0 kg</div>
                  <p className="text-sm text-purple-100 mt-1">Faltam 4.5kg</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                  <CardDescription className="text-green-100">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12 dias</div>
                  <p className="text-sm text-green-100 mt-1">Tomando SB2 Turbo</p>
                </CardContent>
              </Card>
            </div>

            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="weight">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="supplement">
            <SupplementReminder />
          </TabsContent>

          <TabsContent value="chat">
            <AIChat />
          </TabsContent>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
