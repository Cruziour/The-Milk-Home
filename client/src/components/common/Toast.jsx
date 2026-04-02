import React, { useEffect } from "react";
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: "bg-emerald-500",
      Icon: CheckCircle,
    },
    error: {
      bg: "bg-red-500",
      Icon: XCircle,
    },
    warning: {
      bg: "bg-amber-500",
      Icon: AlertCircle,
    },
  };

  const { bg, Icon } = config[type] || config.success;

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in`}
    >
      <Icon size={20} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
