import { createSlice, createSelector } from "@reduxjs/toolkit";

const currentDate = new Date();

const initialState = {
  allEntries: [],
  currentMonth: currentDate.getMonth() + 1,
  currentYear: currentDate.getFullYear(),
  isLoading: false,
  isRefreshing: false,
  isSaving: false,
  isUpdating: false,
  error: null,
  lastFetched: null,
  fetchedMonthKey: null,
};

const milkEntrySlice = createSlice({
  name: "milkEntries",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setUpdating: (state, action) => {
      state.isUpdating = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAllEntries: (state, action) => {
      const { entries, month, year } = action.payload;
      const entriesData = Array.isArray(entries) ? entries : entries?.data || [];
      state.allEntries = entriesData;
      state.fetchedMonthKey = `${month}-${year}`;
      state.lastFetched = Date.now();
      state.isLoading = false;
      state.isRefreshing = false;
      state.error = null;
    },
    addEntryToList: (state, action) => {
      const entry = action.payload;
      const entryDate = new Date(entry.date);
      const entryMonth = entryDate.getMonth() + 1;
      const entryYear = entryDate.getFullYear();

      if (entryMonth === state.currentMonth && entryYear === state.currentYear) {
        state.allEntries.push(entry);
        state.allEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      state.isSaving = false;
    },
    updateEntryInList: (state, action) => {
      const updatedEntry = action.payload;
      const index = state.allEntries.findIndex(e => e._id === updatedEntry._id);
      if (index !== -1) {
        state.allEntries[index] = { ...state.allEntries[index], ...updatedEntry };
      }
      state.isUpdating = false;
    },
    removeEntryFromList: (state, action) => {
      state.allEntries = state.allEntries.filter(e => e._id !== action.payload);
    },
    navigateToPrevMonth: state => {
      if (state.currentMonth === 1) {
        state.currentMonth = 12;
        state.currentYear -= 1;
      } else {
        state.currentMonth -= 1;
      }
    },
    navigateToNextMonth: state => {
      if (state.currentMonth === 12) {
        state.currentMonth = 1;
        state.currentYear += 1;
      } else {
        state.currentMonth += 1;
      }
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  setSaving,
  setUpdating,
  setError,
  setAllEntries,
  addEntryToList,
  updateEntryInList,
  removeEntryFromList,
  navigateToPrevMonth,
  navigateToNextMonth,
} = milkEntrySlice.actions;

// Selectors
export const selectAllEntries = state => state.milkEntries.allEntries;
export const selectCurrentMonth = state => state.milkEntries.currentMonth;
export const selectCurrentYear = state => state.milkEntries.currentYear;
export const selectEntriesLoading = state => state.milkEntries.isLoading;
export const selectEntriesRefreshing = state => state.milkEntries.isRefreshing;
export const selectIsSaving = state => state.milkEntries.isSaving;
export const selectIsUpdating = state => state.milkEntries.isUpdating;
export const selectFetchedMonthKey = state => state.milkEntries.fetchedMonthKey;
export const selectEntriesLastFetched = state => state.milkEntries.lastFetched;

export const makeSelectUserEntriesWithSummary = () =>
  createSelector([selectAllEntries, (_, userId) => userId], (allEntries, userId) => {
    if (!userId) return { entries: [], totalSummary: null };

    const entries = allEntries.filter(entry => {
      const vendorId = entry.vendor?._id || entry.vendor;
      return vendorId === userId;
    });

    if (entries.length === 0) {
      return { entries: [], totalSummary: null };
    }

    const totalSummary = entries.reduce(
      (acc, entry) => {
        acc.morningQty += entry.morning?.qty || 0;
        acc.morningAmount += entry.morning?.amount || 0;
        acc.eveningQty += entry.evening?.qty || 0;
        acc.eveningAmount += entry.evening?.amount || 0;
        return acc;
      },
      { morningQty: 0, morningAmount: 0, eveningQty: 0, eveningAmount: 0 }
    );

    return { entries, totalSummary };
  });

export default milkEntrySlice.reducer;
