
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-500 shadow-lg border-b border-red-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1">
                <img 
                  src="/lovable-uploads/3497ffa0-ead8-4742-8fe6-37a983c9cc07.png" 
                  alt="SB2 Turbo Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SB2 TURBO</h1>
                <p className="text-sm text-red-100">Seu companheiro de emagrecimento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                <Bell className="w-3 h-3 mr-1" />
                3 lembretes ativos
              </Badge>
              <Button size="sm" variant="outline" className="border-red-200 text-white hover:bg-red-700">
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
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-800 border-gray-700">
            <TabsTrigger value="home" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">
              <Home className="w-4 h-4 mr-1" />
              Início
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Dashboard</TabsTrigger>
            <TabsTrigger value="weight" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Peso</TabsTrigger>
            <TabsTrigger value="supplement" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Suplemento</TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">AI Coach</TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peso Atual</CardTitle>
                  <CardDescription className="text-red-100">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72.5 kg</div>
                  <p className="text-sm text-red-100 mt-1">-2.3kg este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-gray-700 to-gray-600 text-white border-gray-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Meta</CardTitle>
                  <CardDescription className="text-gray-200">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.0 kg</div>
                  <p className="text-sm text-gray-200 mt-1">Faltam 4.5kg</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-700 to-red-800 text-white border-red-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                  <CardDescription className="text-red-100">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12 dias</div>
                  <p className="text-sm text-red-100 mt-1">Tomando SB2 Turbo</p>
                </CardContent>
              </Card>
            </div>

            <DailyHabit />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Peso Atual</CardTitle>
                  <CardDescription className="text-red-100">
                    Último registro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">72.5 kg</div>
                  <p className="text-sm text-red-100 mt-1">-2.3kg este mês</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-gray-700 to-gray-600 text-white border-gray-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Meta</CardTitle>
                  <CardDescription className="text-gray-200">
                    Objetivo de peso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">68.0 kg</div>
                  <p className="text-sm text-gray-200 mt-1">Faltam 4.5kg</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-700 to-red-800 text-white border-red-600">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sequência</CardTitle>
                  <CardDescription className="text-red-100">
                    Dias consecutivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12 dias</div>
                  <p className="text-sm text-red-100 mt-1">Tomando SB2 Turbo</p>
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
