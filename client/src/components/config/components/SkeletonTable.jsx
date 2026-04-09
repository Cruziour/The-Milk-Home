import React from "react";

const SkeletonTable = () => (
  <div className="animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
        <div className="bg-gray-200 h-5 w-32 rounded" />
        <div className="bg-gray-200 h-5 w-24 rounded" />
        <div className="bg-gray-200 h-5 w-28 rounded" />
        <div className="bg-gray-200 h-5 w-10 rounded ml-auto" />
      </div>
    ))}
  </div>
);

export default SkeletonTable;
