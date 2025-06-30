
import OptimizedDailyPointsCollector from "@/components/optimized/OptimizedDailyPointsCollector";
import DailyHabit from "./daily-habit/DailyHabit";

const DailyHabitWrapper = () => {
  return (
    <div className="space-y-4">
      <OptimizedDailyPointsCollector />
      <DailyHabit />
    </div>
  );
};

export default DailyHabitWrapper;
