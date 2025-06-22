
import { memo } from "react";
import DailyHabitComponent from "./daily-habit/DailyHabit";

const DailyHabit = memo(() => {
  return <DailyHabitComponent />;
});

DailyHabit.displayName = 'DailyHabit';

export default DailyHabit;
