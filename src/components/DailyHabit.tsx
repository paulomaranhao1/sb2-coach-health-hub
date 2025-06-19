
import { useUserProfile } from "@/hooks/useUserProfile";
import CapsuleButtons from "./daily-habit/CapsuleButtons";
import WaterTracker from "./daily-habit/WaterTracker";
import MotivationalSection from "./daily-habit/MotivationalSection";
import SupplementInfo from "./daily-habit/SupplementInfo";

const DailyHabit = () => {
  const { profile } = useUserProfile();

  return (
    <div className="space-y-6">
      <CapsuleButtons />
      <WaterTracker />
      <MotivationalSection />
      <SupplementInfo />
    </div>
  );
};

export default DailyHabit;
