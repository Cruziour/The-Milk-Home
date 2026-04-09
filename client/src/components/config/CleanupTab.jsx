import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import MonthYearSelect from "./components/MonthYearSelect";

const CleanupTab = ({ formData, setFormData, actionLoading, onCleanup }) => {
  return (
    <div className="p-8 md:p-12">
      <div className="max-w-md mx-auto text-center">
        <div
          className="bg-linear-to-br from-red-100 to-orange-100 text-red-500 w-24 h-24 rounded-full 
          flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-100"
        >
          <AlertTriangle size={48} strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Purge Monthly Data</h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          This will permanently delete all raw milk entries for the selected period.
          <br />
          <span className="text-red-500 font-medium">
            Make sure you've archived the data first!
          </span>
        </p>

        <div className="space-y-4">
          <MonthYearSelect
            formData={formData}
            setFormData={setFormData}
            className="flex-col sm:flex-row"
          />

          <button
            onClick={onCleanup}
            disabled={actionLoading}
            className="w-full bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
              text-white p-4 rounded-2xl font-medium shadow-lg shadow-red-200 transition-all 
              active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {actionLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Trash2 size={20} /> Confirm & Delete Data
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          ⚠️ This action is irreversible. Proceed with caution.
        </p>
      </div>
    </div>
  );
};

export default CleanupTab;
