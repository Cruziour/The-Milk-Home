import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  allUsers: [],
  selectedUser: null,
  userFilter: "active",
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastFetched: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setAllUsers: (state, action) => {
      const userData = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      state.allUsers = userData;
      state.lastFetched = Date.now();
      state.isLoading = false;
      state.isRefreshing = false;
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: state => {
      state.selectedUser = null;
    },
    setUserFilter: (state, action) => {
      state.userFilter = action.payload;
    },
    updateUserInList: (state, action) => {
      const index = state.allUsers.findIndex(u => u._id === action.payload._id);
      if (index !== -1) {
        state.allUsers[index] = action.payload;
      }
      if (state.selectedUser?._id === action.payload._id) {
        state.selectedUser = action.payload;
      }
    },
    addUserToList: (state, action) => {
      state.allUsers.unshift(action.payload);
    },
    removeUserFromList: (state, action) => {
      state.allUsers = state.allUsers.filter(u => u._id !== action.payload);
      if (state.selectedUser?._id === action.payload) {
        state.selectedUser = null;
      }
    },
    clearUsersCache: state => {
      state.lastFetched = null;
    },
    resetUsersState: () => initialState,
  },
});

// ACTIONS EXPORT
export const {
  setLoading,
  setRefreshing,
  setError,
  setAllUsers,
  setSelectedUser,
  clearSelectedUser,
  setUserFilter,
  updateUserInList,
  addUserToList,
  removeUserFromList,
  clearUsersCache,
  resetUsersState,
} = userSlice.actions;


// BASE SELECTORS
export const selectAllUsers = state => state.users.allUsers || [];
export const selectSelectedUser = state => state.users.selectedUser;
export const selectUserFilter = state => state.users.userFilter;
export const selectUsersLoading = state => state.users.isLoading;
export const selectUsersRefreshing = state => state.users.isRefreshing;
export const selectUsersError = state => state.users.error;
export const selectUsersLastFetched = state => state.users.lastFetched;


// MEMOIZED SELECTORS
export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectUserFilter],
  (allUsers, userFilter) => {
    switch (userFilter) {
      case "active":
        return allUsers.filter(user => user.isActive);
      case "deactive":
        return allUsers.filter(user => !user.isActive);
      default:
        return allUsers;
    }
  }
);

export const selectActiveUsersCount = createSelector(
  [selectAllUsers],
  allUsers => allUsers.filter(user => user.isActive).length
);

export const selectDeactiveUsersCount = createSelector(
  [selectAllUsers],
  allUsers => allUsers.filter(user => !user.isActive).length
);

export const makeSelectUserById = () =>
  createSelector(
    [selectAllUsers, (_, userId) => userId],
    (allUsers, userId) => allUsers.find(user => user._id === userId) || null
  );

export const makeSelectUserBySlNo = () =>
  createSelector(
    [selectAllUsers, (_, slNo) => slNo],
    (allUsers, slNo) => allUsers.find(user => user.slNo === slNo) || null
  );

// DEFAULT EXPORT
export default userSlice.reducer;
