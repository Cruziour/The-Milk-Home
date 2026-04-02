import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  selectCurrentMonth,
  selectCurrentYear,
  navigateToPrevMonth,
  navigateToNextMonth,
} from "../../app/features/milkEntrySlice";
import { getMonthName } from "../../utils/dateUtils";

const MonthNavigator = () => {
  const dispatch = useDispatch();
  const currentMonth = useSelector(selectCurrentMonth);
  const currentYear = useSelector(selectCurrentYear);

  return (
    <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-2xl border border-gray-100">
      <button
        onClick={() => dispatch(navigateToPrevMonth())}
        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
        aria-label="Previous month"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-xs font-black uppercase text-gray-700">
        {getMonthName(currentMonth)} {currentYear}
      </span>
      <button
        onClick={() => dispatch(navigateToNextMonth())}
        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
        aria-label="Next month"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default MonthNavigator;
