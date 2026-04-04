import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, RefreshCw } from "lucide-react";
import { getAllVendorsService } from "../../service/index.js";
import {
  setLoading,
  setRefreshing,
  setError,
  setAllUsers,
  setSelectedUser,
  setUserFilter,
  selectFilteredUsers,
  selectSelectedUser,
  selectUserFilter,
  selectUsersLoading,
  selectUsersRefreshing,
  selectUsersLastFetched,
} from "../../app/features/userSlice.js";
import { SectionLoader } from "../common/Loader.jsx";

const FILTER_OPTIONS = ["active", "all", "deactive"];

const UserList = () => {
  const dispatch = useDispatch();

  // Direct useSelector
  const filteredUsers = useSelector(selectFilteredUsers);
  const selectedUser = useSelector(selectSelectedUser);
  const userFilter = useSelector(selectUserFilter);
  const isLoading = useSelector(selectUsersLoading);
  const isRefreshing = useSelector(selectUsersRefreshing);
  const lastFetched = useSelector(selectUsersLastFetched);

  // Fetch users function
  const fetchUsers = useCallback(
    async (forceRefresh = false) => {
      try {
        if (forceRefresh || lastFetched) {
          dispatch(setRefreshing(true));
        } else {
          dispatch(setLoading(true));
        }
        dispatch(setError(null));

        const response = await getAllVendorsService();
        dispatch(setAllUsers(response.data));
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch users";
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        dispatch(setRefreshing(false));
      }
    },
    [dispatch, lastFetched]
  );

  useEffect(() => {
    if (!lastFetched) {
      fetchUsers();
    }
  }, [fetchUsers, lastFetched]);

  return (
    <div className="w-full lg:w-1/4 bg-white border-r border-gray-100 flex flex-col shadow-sm rounded-4xl">
      {/* Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-5">
          <div className="bg-indigo-600 p-2.5 rounded-2xl text-white">
            <Users size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tighter">Vendor List</h2>
          <span className="ml-auto text-xs font-bold text-gray-400">({filteredUsers.length})</span>

          <button
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            className={`p-2 rounded-xl transition-all ${
              isRefreshing
                ? "bg-gray-100 text-gray-400"
                : "bg-gray-100 text-gray-500 hover:bg-indigo-100 hover:text-indigo-600"
            }`}
            title="Refresh users"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {FILTER_OPTIONS.map(filter => (
            <button
              key={filter}
              onClick={() => dispatch(setUserFilter(filter))}
              className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-xl transition-all ${
                userFilter === filter
                  ? "bg-white shadow-lg text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
        {isLoading ? (
          <SectionLoader />
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <UserCard
              key={user._id}
              user={user}
              isSelected={selectedUser?._id === user._id}
              onSelect={() => dispatch(setSelectedUser(user))}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {isRefreshing && (
        <div className="px-4 py-2 bg-indigo-50 text-center">
          <span className="text-[10px] font-bold text-indigo-600 uppercase">
            Refreshing users...
          </span>
        </div>
      )}
    </div>
  );
};

const UserCard = ({ user, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-3xl border-2 cursor-pointer transition-all group ${
      isSelected
        ? "border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-50"
        : "border-gray-50 bg-gray-50/50 hover:border-gray-100"
    } ${!user.isActive ? "opacity-60" : ""}`}
  >
    <div className="flex justify-between items-center mb-1">
      <span
        className={`text-[12px] font-black ${user.slNo ? "text-indigo-900" : "text-red-400 italic"}`}
      >
        {user.slNo ? `#${user.slNo}` : "No SlNo"}
      </span>
      <div className="flex items-center gap-2">
        {!user.isActive && (
          <span className="text-[8px] font-bold text-red-400 uppercase">Deactivated</span>
        )}
        <div
          className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`}
        />
      </div>
    </div>
    <p className="text-sm font-black uppercase text-gray-800 truncate group-hover:text-indigo-600">
      {user?.name}
    </p>

    {user?.milkType && (
      <span className="text-[10px] font-bold text-gray-600 uppercase pr-5">{user.milkType}</span>
    )}
    {user?.address && (
      <span className="text-[10px] font-bold text-gray-600 uppercase truncate">
        {user?.address}
      </span>
    )}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 opacity-40">
    <Users size={30} className="mx-auto mb-2" />
    <p className="text-[10px] font-black uppercase">No Users Found</p>
  </div>
);

export default UserList;
