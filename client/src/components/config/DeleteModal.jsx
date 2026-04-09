import React from "react";
import { Trash2, Loader2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, userName, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4xl max-w-sm w-full p-8 shadow-2xl border border-gray-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-br 
            from-red-50 to-red-100 text-red-500 mb-6 shadow-lg shadow-red-100"
          >
            <Trash2 size={36} strokeWidth={1.5} />
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Delete User?</h3>

          <p className="text-gray-500 mb-8 leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-medium text-gray-700">{userName}</span> from the system?
            <br />
            <span className="text-red-500 text-sm">This action cannot be undone.</span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-4 bg-gray-100 text-gray-700 font-medium rounded-2xl 
                hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-4 bg-linear-to-r from-red-500 to-red-600 text-white font-medium 
                rounded-2xl hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-200 
                transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={18} /> Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
