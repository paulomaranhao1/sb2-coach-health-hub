import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
}
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  benefits
}: FeatureCardProps) => {
  return <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="text-center pb-4 bg-slate-500">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-lg font-bold text-gray-800">
          {title}
        </CardTitle>
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          EM BREVE
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm text-center">
          {description}
        </p>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 text-sm">Benefícios:</h4>
          <ul className="space-y-1">
            {benefits.map((benefit, idx) => <li key={idx} className="text-xs text-gray-600 flex items-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                {benefit}
              </li>)}
          </ul>
        </div>
      </CardContent>
    </Card>;
};
export default FeatureCard;