import React from "react";
import { Search, Users } from "lucide-react";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import UserCard from "./components/UserCard";

const UsersTab = ({
  searchTerm,
  setSearchTerm,
  loading,
  filteredUsers,
  onDeleteUser,
  onSearch,
}) => {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or serial number..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={onSearch}
            className="w-full sm:w-32 h-14.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <Search size={18} className="sm:hidden" />
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Users Found"
          description={
            searchTerm
              ? "Try adjusting your search criteria."
              : "No users have been registered yet."
          }
        />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span>{" "}
              users
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(user => (
              <UserCard key={user._id} user={user} onDelete={onDeleteUser} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTab;
