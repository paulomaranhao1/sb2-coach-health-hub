
import { Card, CardContent } from "@/components/ui/card";
import CapsuleButtons from "./CapsuleButtons";
import FirstMealTracker from "./FirstMealTracker";

const SupplementTracker = () => {
  return (
    <div className="space-y-6">
      {/* SB2 TURBO Manhã */}
      <Card className="border-0 shadow-card hover:shadow-lg transition-all duration-300 bg-white hover-lift">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">🌅 SB2 TURBO - Manhã</h3>
            <p className="text-sm text-gray-600">Tome em jejum, 30min antes da primeira refeição</p>
          </div>
          <CapsuleButtons type="morning" />
        </CardContent>
      </Card>
      
      <FirstMealTracker />
      
      {/* SB2 TURBO Noite */}
      <Card className="border-0 shadow-card hover:shadow-lg transition-all duration-300 bg-white hover-lift">
        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-1">🌙 SB2 TURBO - Noite</h3>
            <p className="text-sm text-gray-600">Tome 2h após o jantar ou antes de dormir</p>
          </div>
          <CapsuleButtons type="evening" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementTracker;
