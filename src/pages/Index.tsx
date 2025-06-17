
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MessageSquare, User, Users, Home, ShoppingCart, Menu } from "lucide-react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handlePurchase = () => {
    // Detectar localização e redirecionar para loja apropriada
    const isInBrazil = navigator.language.includes('pt') || 
                      Intl.DateTimeFormat().resolvedOptions().timeZone.includes('America/Sao_Paulo');
    
    const url = isInBrazil ? 'https://sb2turbo.com.br' : 'https://sb2turbo.com';
    window.open(url, '_blank');
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

  const tabItems = [
    { value: "home", label: "Início", icon: Home },
    { value: "dashboard", label: "Dashboard", icon: Calendar },
    { value: "weight", label: "Peso", icon: Calendar },
    { value: "supplement", label: "Suplemento", icon: Bell },
    { value: "chat", label: "AI Coach", icon: MessageSquare },
    { value: "profile", label: "Perfil", icon: User }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-red-500 shadow-lg border-b border-red-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg bg-white p-1">
                <img 
                  src="/lovable-uploads/bf6fca4b-d2fa-4dfb-9422-75f0f01befa7.png" 
                  alt="SB2FIT Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SB2FIT</h1>
                <p className="text-sm text-red-100">Seu companheiro de emagrecimento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handlePurchase}
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white border-0 hidden sm:flex"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar SB2 Turbo
              </Button>
              <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 hidden sm:flex">
                <Bell className="w-3 h-3 mr-1" />
                3 lembretes ativos
              </Badge>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-red-200 text-white hover:bg-red-700 bg-red-600/20 backdrop-blur-sm hidden sm:flex"
              >
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              {/* Mobile menu button */}
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-white hover:bg-red-700 bg-red-600/20 backdrop-blur-sm sm:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 sm:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-gray-800 w-64 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">Menu</h2>
            </div>
            <div className="p-4 space-y-2">
              {tabItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setActiveTab(item.value);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.value 
                      ? 'bg-red-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <Button 
                  onClick={handlePurchase}
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar SB2 Turbo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Tabs */}
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-gray-800 border-gray-700 hidden sm:grid">
            {tabItems.map((item) => (
              <TabsTrigger 
                key={item.value}
                value={item.value} 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300"
              >
                <item.icon className="w-4 h-4 mr-1" />
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Tabs - Simplified horizontal scroll */}
          <div className="sm:hidden mb-8">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.value 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

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
                  <p className="text-sm text-red-100 mt-1">Usando SB2FIT</p>
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
                  <p className="text-sm text-red-100 mt-1">Usando SB2FIT</p>
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
