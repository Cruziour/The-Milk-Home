/* eslint-disable no-unused-vars */
import React from "react";

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="bg-gray-100 p-6 rounded-full mb-6">
      <Icon size={48} className="text-gray-300" />
    </div>
    <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
    <p className="text-gray-400 max-w-md">{description}</p>
  </div>
);

export default EmptyState;
