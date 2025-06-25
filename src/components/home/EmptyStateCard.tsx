
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Camera, Clock } from "lucide-react";

interface EmptyStateCardProps {
  title: string;
  description: string;
  actionText: string;
  onAction: () => void;
  icon: 'weight' | 'photo' | 'fasting' | 'progress';
}

const EmptyStateCard = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon 
}: EmptyStateCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'weight':
        return <TrendingUp className="w-8 h-8 text-blue-500" />;
      case 'photo':
        return <Camera className="w-8 h-8 text-green-500" />;
      case 'fasting':
        return <Clock className="w-8 h-8 text-purple-500" />;
      case 'progress':
        return <TrendingUp className="w-8 h-8 text-orange-500" />;
      default:
        return <Plus className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3 group-hover:scale-110 transition-transform">
          {getIcon()}
        </div>
        <CardTitle className="text-lg text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-gray-600 mb-4 group-hover:text-gray-800 transition-colors">
          {description}
        </p>
        <Button 
          onClick={onAction}
          className="w-full group-hover:shadow-md transition-shadow"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
