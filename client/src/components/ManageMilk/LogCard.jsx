import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Edit2, X, Check, Loader2 } from "lucide-react";
import { selectIsUpdating, updateEntryInList } from "../../app/features/milkEntrySlice";
import NumberInput from "../common/NumberInput";
import { formatDate } from "../../utils/dateUtils";
import { updateMilkEntryService } from "../../service/index.js";

const LogCard = ({ log, onUpdateSuccess, onUpdateError }) => {
  const dispatch = useDispatch();
  const isUpdating = useSelector(selectIsUpdating);

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    morningQty: "",
    morningAmount: "",
    eveningQty: "",
    eveningAmount: "",
  });

  const startEditing = () => {
    setIsEditing(true);
    setTempData({
      morningQty: log.morning.qty.toString(),
      morningAmount: log.morning.amount.toString(),
      eveningQty: log.evening.qty.toString(),
      eveningAmount: log.evening.amount.toString(),
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempData({
      morningQty: "",
      morningAmount: "",
      eveningQty: "",
      eveningAmount: "",
    });
  };

  const saveEdit = async () => {
    if (!log._id) {
      onUpdateError?.("Entry ID is missing!");
      return;
    }
    try {
      const updateData = {
        morningQty: parseFloat(tempData.morningQty) || 0,
        morningAmount: parseFloat(tempData.morningAmount) || 0,
        eveningQty: parseFloat(tempData.eveningQty) || 0,
        eveningAmount: parseFloat(tempData.eveningAmount) || 0,
      };

      const response = await updateMilkEntryService(log._id, updateData);      
      dispatch(updateEntryInList(response?.data));
      setIsEditing(false);
      onUpdateSuccess?.("Record updated successfully!");
    } catch (error) {
      onUpdateError?.(error.message || "Failed to update record");
    }
  };

  const handleTempChange = (field, value) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const displayData = isEditing
    ? tempData
    : {
        morningQty: log.morning.qty,
        morningAmount: log.morning.amount,
        eveningQty: log.evening.qty,
        eveningAmount: log.evening.amount,
      };

  const totalQty = Number(displayData.morningQty || 0) + Number(displayData.eveningQty || 0);
  const totalAmount =
    Number(displayData.morningAmount || 0) + Number(displayData.eveningAmount || 0);

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 transition-all">
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-indigo-400" />
          <span className="text-[11px] font-black text-gray-800 italic uppercase">
            {formatDate(log.date)}
          </span>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={cancelEditing}
              disabled={isUpdating}
              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              <X size={14} />
            </button>
            <button
              onClick={saveEdit}
              disabled={isUpdating}
              className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
            >
              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            </button>
          </div>
        ) : (
          <button
            onClick={startEditing}
            className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Edit2 size={12} />
          </button>
        )}
      </div>

      {isEditing ? (
        <EditForm data={tempData} onChange={handleTempChange} />
      ) : (
        <DisplayData log={log} />
      )}

      {/* Total Footer */}
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl text-white mt-5">
        <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">
          Day Total
        </div>
        <div className="text-xs font-black tracking-tighter">
          {totalQty.toFixed(2)} L<span className="mx-2 opacity-30">•</span>₹{totalAmount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

const EditForm = ({ data, onChange }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-orange-500 ml-1">
          ☀️ Morning Qty
        </label>
        <NumberInput
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-400 outline-none"
          value={data.morningQty}
          onChange={val => onChange("morningQty", val)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-orange-500 ml-1">
          ☀️ Morning Amt
        </label>
        <NumberInput
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-400 outline-none"
          value={data.morningAmount}
          onChange={val => onChange("morningAmount", val)}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 pb-3">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-blue-500 ml-1">
          🌙 Evening Qty
        </label>
        <NumberInput
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-400 outline-none"
          value={data.eveningQty}
          onChange={val => onChange("eveningQty", val)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase text-blue-500 ml-1">
          🌙 Evening Amt
        </label>
        <NumberInput
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-400 outline-none"
          value={data.eveningAmount}
          onChange={val => onChange("eveningAmount", val)}
        />
      </div>
    </div>
  </div>
);

const DisplayData = ({ log }) => (
  <div className="grid grid-cols-2 gap-4 animate-in fade-in">
    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
      <p className="text-xs font-black uppercase text-orange-500 mb-2 flex items-center gap-1">
        ☀️ Morning
      </p>
      <p className="text-sm font-black">
        {log.morning.qty || 0}L <span className="text-orange-200 mx-1">|</span> ₹
        {log.morning.amount || 0}
      </p>
    </div>
    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
      <p className="text-xs font-black uppercase text-blue-500 mb-2 flex items-center gap-1">
        🌙 Evening
      </p>
      <p className="text-sm font-black">
        {log.evening.qty || 0}L <span className="text-blue-200 mx-1">|</span> ₹
        {log.evening.amount || 0}
      </p>
    </div>
  </div>
);

export default LogCard;
