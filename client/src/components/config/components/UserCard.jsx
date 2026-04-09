import React from "react";
import { MapPin, Hash, UserMinus } from "lucide-react";

const UserCard = ({ user, onDelete }) => (
  <div
    className="p-6 border border-gray-100 rounded-3xl bg-white hover:shadow-xl hover:shadow-gray-100/50 
    hover:-translate-y-1 transition-all duration-300 group"
  >
    <div className="flex justify-between items-start mb-4">
      <div
        className="bg-linear-to-br from-blue-500 to-indigo-600 text-white w-14 h-14 rounded-2xl 
        flex items-center justify-center font-medium text-xl shadow-lg shadow-blue-200 
        group-hover:scale-110 transition-transform duration-300"
      >
        {user.name?.[0]?.toUpperCase() || "?"}
      </div>
      <span
        className="flex items-center gap-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider 
        bg-gray-100 px-3 py-1.5 rounded-lg"
      >
        <Hash size={10} /> {user.slNo || "N/A"}
      </span>
    </div>

    <h3 className="font-medium text-gray-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
      {user.name}
    </h3>

    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
      <MapPin size={14} className="shrink-0" />
      <span className="truncate">{user.address || "No address provided"}</span>
    </div>

    <button
      onClick={() => onDelete(user)}
      className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-medium flex items-center 
        justify-center gap-2 hover:bg-red-500 hover:text-white transition-all duration-300 
        active:scale-[0.98]"
    >
      <UserMinus size={18} /> Remove User
    </button>
  </div>
);

export default UserCard;
