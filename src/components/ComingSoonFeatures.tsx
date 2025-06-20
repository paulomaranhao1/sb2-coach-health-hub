
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Sparkles, Clock, Zap, Brain, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ComingSoonFeatures = () => {
  const { toast } = useToast();

  const handleNotifyMe = (featureName: string) => {
    toast({
      title: "🔔 Notificação Ativada!",
      description: `Você será notificado quando ${featureName} estiver disponível!`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeatures;
