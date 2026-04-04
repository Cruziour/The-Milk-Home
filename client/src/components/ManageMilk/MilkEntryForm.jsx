import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Save, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { addMilkEntryService } from "../../service/index.js";
import { selectSelectedUser } from "../../app/features/userSlice.js";
import {
  setSaving,
  addEntryToList,
  selectIsSaving,
  updateEntryInList,
} from "../../app/features/milkEntrySlice.js";
import NumberInput from "../common/NumberInput.jsx";
import { getTodayDate } from "../../utils/dateUtils.js";

const MilkEntryForm = ({ onSuccess, onError }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectSelectedUser);
  const isSaving = useSelector(selectIsSaving);

  const [entryDate, setEntryDate] = useState(getTodayDate());
  const [entryData, setEntryData] = useState({
    morningQty: "",
    morningAmount: "",
    eveningQty: "",
    eveningAmount: "",
  });

  const isEntryDisabled = !selectedUser || !selectedUser.isActive || !selectedUser.slNo;

  const handleInputChange = (field, value) => {
    setEntryData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEntryData({
      morningQty: "",
      morningAmount: "",
      eveningQty: "",
      eveningAmount: "",
    });
  };

  const handleSaveEntry = async () => {
    if (!selectedUser) {
      onError?.("Please select a user from the list first!");
      return;
    }
    if (!selectedUser.isActive) {
      onError?.("Cannot add entry for deactivated user!");
      return;
    }
    if (!selectedUser.slNo) {
      onError?.("Selected user does not have a valid SL No!");
      return;
    }
    if (!entryData.morningQty && !entryData.eveningQty) {
      onError?.("Please enter at least one milk record (Morning or Evening).");
      return;
    }

    const payload = {
      slNo: selectedUser.slNo,
      date: entryDate,
      morningQty: parseFloat(entryData.morningQty) || 0,
      morningAmount: parseFloat(entryData.morningAmount) || 0,
      eveningQty: parseFloat(entryData.eveningQty) || 0,
      eveningAmount: parseFloat(entryData.eveningAmount) || 0,
    };

    try {
      dispatch(setSaving(true));
      const newEntry = await addMilkEntryService(payload);     
      dispatch(addEntryToList(newEntry));
      dispatch(updateEntryInList(newEntry?.data));
      resetForm();
      onSuccess?.("Record saved successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to save record";
      dispatch(setSaving(false));
      onError?.(errorMessage);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-white border-r border-gray-100 hide-scrollbar min-h-screen]">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
            Milk <span className="text-indigo-600">Entry</span>
          </h2>
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full mt-2 border border-indigo-100">
            <Calendar size={12} className="text-indigo-600" />
            <input
              type="date"
              value={entryDate}
              onChange={e => setEntryDate(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase text-indigo-600 outline-none cursor-pointer"
            />
          </div>
        </div>

        {selectedUser && !selectedUser.isActive && (
          <WarningBox type="error" message="This user is deactivated. Entry is not allowed." />
        )}
        {selectedUser && !selectedUser.slNo && selectedUser.isActive && (
          <WarningBox
            type="warning"
            message="This user has no SL No assigned. Entry is not allowed."
          />
        )}

        <div
          className={`bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100 space-y-6 transition-opacity ${
            isEntryDisabled ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <SelectedUserInfo user={selectedUser} />

          <div className="grid grid-cols-2 gap-6">
            <SessionInput
              session="morning"
              qtyValue={entryData.morningQty}
              amountValue={entryData.morningAmount}
              onQtyChange={val => handleInputChange("morningQty", val)}
              onAmountChange={val => handleInputChange("morningAmount", val)}
              disabled={isEntryDisabled}
            />
            <SessionInput
              session="evening"
              qtyValue={entryData.eveningQty}
              amountValue={entryData.eveningAmount}
              onQtyChange={val => handleInputChange("eveningQty", val)}
              onAmountChange={val => handleInputChange("eveningAmount", val)}
              disabled={isEntryDisabled}
            />
          </div>

          <button
            onClick={handleSaveEntry}
            disabled={isSaving || isEntryDisabled}
            className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-4xl uppercase text-xs tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Records
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const WarningBox = ({ type, message }) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-amber-50 border-amber-200 text-amber-600",
  };
  const iconColor = type === "error" ? "text-red-500" : "text-amber-500";

  return (
    <div className={`border rounded-2xl p-4 flex items-center gap-3 ${styles[type]}`}>
      <AlertCircle size={20} className={`shrink-0 ${iconColor}`} />
      <p className="text-xs font-bold">{message}</p>
    </div>
  );
};

const SelectedUserInfo = ({ user }) => (
  <div className="bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-200 flex justify-between items-center">
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
        Selected Vendor
      </p>
      <p className="text-sm font-black text-gray-800 uppercase leading-none mt-1">
        {user ? user.name : "Select User"}
      </p>
    </div>
    <div className="text-right">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sl No</p>
      <p className="text-sm font-black text-indigo-600 leading-none mt-1">{user?.slNo || "--"}</p>
    </div>
  </div>
);

const SessionInput = ({
  session,
  qtyValue,
  amountValue,
  onQtyChange,
  onAmountChange,
  disabled,
}) => {
  const config = {
    morning: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-orange-600",
      focusBorder: "focus:border-orange-400",
      emoji: "☀️",
      label: "Morning",
    },
    evening: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      focusBorder: "focus:border-blue-400",
      emoji: "🌙",
      label: "Evening",
    },
  };
  const { bg, border, text, focusBorder, emoji, label } = config[session];

  return (
    <div className="space-y-4">
      <div className={`${bg} py-3 px-4 rounded-2xl ${border} border`}>
        <p className={`text-base font-black uppercase ${text} text-center tracking-wide`}>
          {emoji} {label}
        </p>
      </div>
      <NumberInput
        placeholder="Milk (L)"
        className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold ${focusBorder} outline-none transition-all disabled:opacity-50`}
        value={qtyValue}
        onChange={onQtyChange}
        disabled={disabled}
      />
      <NumberInput
        placeholder="Amount ₹"
        className={`w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold ${focusBorder} outline-none transition-all disabled:opacity-50`}
        value={amountValue}
        onChange={onAmountChange}
        disabled={disabled}
      />
    </div>
  );
};

export default MilkEntryForm;
