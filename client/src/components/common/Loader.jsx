import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-indigo-600" />
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader size={40} />
  </div>
);

export const SectionLoader = ({ height = "py-20" }) => (
  <div className={`flex items-center justify-center ${height}`}>
    <Loader size={24} />
  </div>
);

export default Loader;
