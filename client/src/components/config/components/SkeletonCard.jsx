import React from "react";

const SkeletonCard = () => (
  <div className="p-6 border border-gray-100 rounded-3xl bg-gray-50 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-gray-200 w-14 h-14 rounded-2xl" />
      <div className="bg-gray-200 w-16 h-6 rounded-md" />
    </div>
    <div className="bg-gray-200 h-5 w-3/4 rounded mb-2" />
    <div className="bg-gray-200 h-4 w-1/2 rounded mb-6" />
    <div className="bg-gray-200 h-12 w-full rounded-xl" />
  </div>
);

export default SkeletonCard;
