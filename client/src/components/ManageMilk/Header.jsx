import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RefreshCw, Milk, Clock } from "lucide-react";
import { getAllVendorsService, getAllMilkEntriesService } from "../../service/index.js";
import {
  setRefreshing as setUsersRefreshing,
  setError as setUsersError,
  setAllUsers,
  selectUsersRefreshing,
  selectUsersLastFetched,
} from "../../app/features/userSlice.js";
import {
  setRefreshing as setEntriesRefreshing,
  setError as setEntriesError,
  setAllEntries,
  selectCurrentMonth,
  selectCurrentYear,
  selectEntriesRefreshing,
  selectEntriesLastFetched,
} from "../../app/features/milkEntrySlice.js";

const Header = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();

  // Direct useSelector 
  const isUsersRefreshing = useSelector(selectUsersRefreshing);
  const isEntriesRefreshing = useSelector(selectEntriesRefreshing);
  const currentMonth = useSelector(selectCurrentMonth);
  const currentYear = useSelector(selectCurrentYear);
  const usersLastFetched = useSelector(selectUsersLastFetched);
  const entriesLastFetched = useSelector(selectEntriesLastFetched);

  const isRefreshing = isUsersRefreshing || isEntriesRefreshing;

  const formatLastFetched = timestamp => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const lastFetchedTime =
    usersLastFetched && entriesLastFetched
      ? Math.max(usersLastFetched, entriesLastFetched)
      : usersLastFetched || entriesLastFetched;

  const handleRefresh = async () => {
    try {
      dispatch(setUsersRefreshing(true));
      dispatch(setUsersError(null));
      const users = await getAllVendorsService();
      dispatch(setAllUsers(users));

      dispatch(setEntriesRefreshing(true));
      dispatch(setEntriesError(null));
      const entries = await getAllMilkEntriesService(currentMonth, currentYear);
      dispatch(setAllEntries({ entries, month: currentMonth, year: currentYear }));

      onSuccess?.("Data refreshed successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to refresh data";
      dispatch(setUsersRefreshing(false));
      dispatch(setEntriesRefreshing(false));
      onError?.(errorMessage);
    }
  };

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
          <Milk size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-gray-800">
            Milk Management
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Collection Center Dashboard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastFetchedTime && (
          <div className="hidden sm:flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
            <Clock size={14} />
            <span className="text-[10px] font-bold uppercase">
              Last Updated: {formatLastFetched(lastFetchedTime)}
            </span>
          </div>
        )}

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`
            flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider
            transition-all duration-300 shadow-lg
            ${
              isRefreshing
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-200 active:scale-95"
            }
          `}
        >
          <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
