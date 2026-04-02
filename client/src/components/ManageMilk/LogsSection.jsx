import React, { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { History, Hash, RefreshCw } from "lucide-react";
import { getAllMilkEntriesService } from "../../service/index.js";
import { selectSelectedUser } from "../../app/features/userSlice.js";
import {
  setLoading,
  setRefreshing,
  setError,
  setAllEntries,
  selectAllEntries,
  selectCurrentMonth,
  selectCurrentYear,
  selectEntriesLoading,
  selectEntriesRefreshing,
  selectFetchedMonthKey,
  makeSelectUserEntriesWithSummary,
} from "../../app/features/milkEntrySlice.js";
import { SectionLoader } from "../common/Loader.jsx";
import MonthNavigator from "./MonthNavigator.jsx";
import MonthlySummary from "./MonthlySummary.jsx";
import LogCard from "./LogCard";

const LogsSection = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();

  // Direct useSelector - No custom hooks
  const selectedUser = useSelector(selectSelectedUser);
  const allEntries = useSelector(selectAllEntries);
  const currentMonth = useSelector(selectCurrentMonth);
  const currentYear = useSelector(selectCurrentYear);
  const isLoading = useSelector(selectEntriesLoading);
  const isRefreshing = useSelector(selectEntriesRefreshing);
  const fetchedMonthKey = useSelector(selectFetchedMonthKey);

  // Create memoized selector for user entries
  const selectUserEntriesWithSummary = useMemo(() => makeSelectUserEntriesWithSummary(), []);

  const { entries: userEntries, totalSummary } = useSelector(state =>
    selectUserEntriesWithSummary(state, selectedUser?._id)
  );

  // Fetch entries function - Updated
  const fetchEntries = useCallback(
    async (month, year, forceRefresh = false) => {
      const monthKey = `${month}-${year}`;

      // Agar data pehle se hai aur refresh nahi manga, toh return kar do
      if (!forceRefresh && fetchedMonthKey === monthKey && allEntries.length > 0) {
        return;
      }

      try {
        // UI state updates
        if (forceRefresh) {
          dispatch(setRefreshing(true));
        } else {
          dispatch(setLoading(true));
        }
        dispatch(setError(null));

        const response = await getAllMilkEntriesService(month, year);

        // API response.data mein array hai
        dispatch(
          setAllEntries({
            entries: response.data || [],
            month,
            year,
          })
        );
      } catch (err) {
        dispatch(setError(err.message || "Failed to fetch entries"));
      } finally {
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      }
      // Remove allEntries from dependency to prevent loops
    },
    [allEntries.length, dispatch, fetchedMonthKey]
  );

  useEffect(() => {
    const monthKey = `${currentMonth}-${currentYear}`;
    if (fetchedMonthKey !== monthKey) {
      fetchEntries(currentMonth, currentYear);
    }
  }, [currentMonth, currentYear, fetchEntries, fetchedMonthKey]);

  return (
    <div className="w-full lg:w-1/3 bg-gray-50 p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <History size={16} /> Logs Activity
        </h2>
        <div className="flex items-center gap-2">
          {selectedUser && (
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full truncate max-w-25">
              {selectedUser.name}
            </span>
          )}
          <button
            onClick={() => fetchEntries(currentMonth, currentYear, true)}
            disabled={isRefreshing}
            className={`p-2 rounded-xl transition-all ${
              isRefreshing
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 shadow-sm"
            }`}
            title="Refresh logs"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <MonthNavigator />

      {isRefreshing && (
        <div className="bg-indigo-50 text-center py-2 rounded-xl mb-4">
          <span className="text-[10px] font-bold text-indigo-600 uppercase flex items-center justify-center gap-2">
            <RefreshCw size={12} className="animate-spin" />
            Refreshing entries...
          </span>
        </div>
      )}

      {totalSummary && <MonthlySummary summary={totalSummary} />}

      <div className="flex-1 overflow-y-auto space-y-5 pr-2 hide-scrollbar">
        {isLoading ? (
          <SectionLoader />
        ) : userEntries.length > 0 ? (
          userEntries.map(log => (
            <LogCard key={log._id} log={log} onUpdateSuccess={onSuccess} onUpdateError={onError} />
          ))
        ) : (
          <EmptyState hasUser={!!selectedUser} />
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ hasUser }) => (
  <div className="text-center py-20 opacity-20">
    <Hash size={40} className="mx-auto mb-2" />
    <p className="text-[10px] font-black uppercase">
      {hasUser ? "No Logs Found for this month" : "Select a user to view logs"}
    </p>
  </div>
);

export default LogsSection;
