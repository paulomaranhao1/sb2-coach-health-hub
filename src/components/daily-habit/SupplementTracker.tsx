
import { Card, CardContent } from "@/components/ui/card";
import CapsuleButtons from "./CapsuleButtons";
import FirstMealTracker from "./FirstMealTracker";

const SupplementTracker = () => {
  return (
    <div className="space-y-4">
      {/* SB2 TURBO Manhã */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <CardContent className="p-4">
          <CapsuleButtons type="morning" />
        </CardContent>
      </Card>
      
      <FirstMealTracker />
      
      {/* SB2 TURBO Noite */}
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
        <CardContent className="p-4">
          <CapsuleButtons type="evening" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementTracker;
