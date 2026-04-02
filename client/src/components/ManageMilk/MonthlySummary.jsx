import React from "react";

const MonthlySummary = ({ summary }) => {
  if (!summary) return null;

  const totalQty = summary.morningQty + summary.eveningQty;
  const totalAmount = summary.morningAmount + summary.eveningAmount;

  return (
    <div className="bg-indigo-600 text-white p-4 rounded-2xl mb-4">
      <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-70">
        Monthly Summary
      </p>
      <div className="grid grid-cols-2 gap-3 text-[10px]">
        <div>
          <span className="opacity-70">Morning:</span>{" "}
          <span className="font-black">{summary.morningQty.toFixed(2)} L</span>
          <span className="mx-1 opacity-50">|</span>
          <span className="font-black">₹{summary.morningAmount.toFixed(2)}</span>
        </div>
        <div>
          <span className="opacity-70">Evening:</span>{" "}
          <span className="font-black">{summary.eveningQty.toFixed(2)} L</span>
          <span className="mx-1 opacity-50">|</span>
          <span className="font-black">₹{summary.eveningAmount.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-white/20 text-xs font-black">
        Total: {totalQty.toFixed(2)} L | ₹{totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export default MonthlySummary;
