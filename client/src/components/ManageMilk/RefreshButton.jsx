import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RefreshCw } from "lucide-react";
import { fetchAllUsers, selectUsersRefreshing } from "../../store/slices/userSlice.js";
import {
  fetchAllMilkEntries,
  selectCurrentMonth,
  selectCurrentYear,
  selectEntriesRefreshing,
} from "../../store/slices/milkEntrySlice.js";

const RefreshButton = ({
  onSuccess,
  onError,
  variant = "default", // 'default' | 'compact' | 'icon'
  className = "",
}) => {
  const dispatch = useDispatch();

  const isUsersRefreshing = useSelector(selectUsersRefreshing);
  const isEntriesRefreshing = useSelector(selectEntriesRefreshing);
  const currentMonth = useSelector(selectCurrentMonth);
  const currentYear = useSelector(selectCurrentYear);

  const isRefreshing = isUsersRefreshing || isEntriesRefreshing;

  const handleRefresh = async () => {
    try {
      await Promise.all([
        dispatch(fetchAllUsers()).unwrap(),
        dispatch(
          fetchAllMilkEntries({
            month: currentMonth,
            year: currentYear,
            forceRefresh: true,
          })
        ).unwrap(),
      ]);
      onSuccess?.("Data refreshed successfully!");
    } catch (error) {
      onError?.(error || "Failed to refresh data");
    }
  };

  const variants = {
    default: `
      flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider
      transition-all duration-300 shadow-lg
      ${
        isRefreshing
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-200 active:scale-95"
      }
    `,
    compact: `
      flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase
      transition-all
      ${
        isRefreshing
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95"
      }
    `,
    icon: `
      p-2.5 rounded-xl transition-all
      ${
        isRefreshing
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 active:scale-95"
      }
    `,
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`${variants[variant]} ${className}`}
      title="Refresh data"
    >
      <RefreshCw
        size={variant === "icon" ? 16 : 14}
        className={isRefreshing ? "animate-spin" : ""}
      />
      {variant !== "icon" && <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>}
    </button>
  );
};

export default RefreshButton;
