
import { useUserProfile } from "@/hooks/useUserProfile";
import DailyHabitComponent from "./daily-habit/DailyHabit";

const DailyHabit = () => {
  const { profile } = useUserProfile();

  return <DailyHabitComponent />;
};

export default DailyHabit;
