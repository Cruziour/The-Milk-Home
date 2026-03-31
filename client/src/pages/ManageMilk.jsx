import React, { useState, useEffect } from "react";
import {
  Users,
  Save,
  X,
  Edit2,
  Check,
  Calendar,
  Hash,
  History,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

// --- MOCK DATA ---
const MOCK_USERS = [
  { _id: "1", name: "Ramesh Kumar", slNo: "101", isActive: true },
  { _id: "2", name: "Suresh Singh", slNo: "102", isActive: true },
  { _id: "3", name: "Mahesh Yadav", slNo: null, isActive: false },
  { _id: "4", name: "Dinesh Pal", slNo: "104", isActive: true },
  { _id: "5", name: "Ganesh Lal", slNo: null, isActive: false },
];

const MOCK_LOGS = [
  {
    _id: "l1",
    date: "2026-03-28",
    morningMilk: "5",
    morningAmount: "250",
    eveningMilk: "4",
    eveningAmount: "200",
  },
  {
    _id: "l2",
    date: "2026-03-29",
    morningMilk: "6",
    morningAmount: "300",
    eveningMilk: "5.5",
    eveningAmount: "275",
  },
];

// --- Toast Notification Component ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
  };

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const ToastIcon = Icon[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 ${bgColor[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in`}
    >
      <ToastIcon size={20} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

// --- Number Input Component (Only Numbers Allowed) ---
const NumberInput = ({ value, onChange, placeholder, className, disabled }) => {
  const handleChange = e => {
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  const handleKeyDown = e => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey) ||
      (e.keyCode === 67 && e.ctrlKey) ||
      (e.keyCode === 86 && e.ctrlKey) ||
      (e.keyCode === 88 && e.ctrlKey) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Block if not a number
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    />
  );
};

const ManageMilk = () => {
  // --- States ---
  const [userFilter, setUserFilter] = useState("active");
  const [selectedUser, setSelectedUser] = useState(null);
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);

  // Loading States
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Inline Editing States
  const [editingId, setEditingId] = useState(null);
  const [tempEditData, setTempEditData] = useState({
    morningMilk: "",
    morningAmount: "",
    eveningMilk: "",
    eveningAmount: "",
  });

  // Users and Logs state
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  // Entry Form State
  const [entryData, setEntryData] = useState({
    morningMilk: "",
    morningAmount: "",
    eveningMilk: "",
    eveningAmount: "",
  });

  // Show Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // --- API PLACEHOLDER: Fetch Users ---
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
      // setUsers(data.users);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(MOCK_USERS);
    } catch (error) {
      showToast(error.message || "Failed to fetch users", "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // --- API PLACEHOLDER: Fetch Logs for Selected User ---
  const fetchUserLogs = async userId => {
    if (!userId) return;
    setIsLoadingLogs(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${userId}/logs`);
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to fetch logs');
      // setLogs(data.logs);

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setLogs(MOCK_LOGS);
    } catch (error) {
      showToast(error.message || "Failed to fetch logs", "error");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // --- API PLACEHOLDER: Save New Entry ---
  const saveEntry = async entryPayload => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/milk-entries', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entryPayload),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to save entry');
      // return data;

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, _id: Date.now().toString() };
    } catch (error) {
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // --- API PLACEHOLDER: Update Log ---
  const updateLog = async (logId, updatePayload) => {
    setIsUpdating(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/milk-entries/${logId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatePayload),
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to update entry');
      // return data;

      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 600));
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // --- API PLACEHOLDER: Delete Log ---
  const deleteLog = async logId => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/milk-entries/${logId}`, {
      //   method: 'DELETE',
      // });
      // const data = await response.json();
      // if (!response.ok) throw new Error(data.message || 'Failed to delete entry');
      // return data;

      await new Promise(resolve => setTimeout(resolve, 400));
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch logs when user selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserLogs(selectedUser._id);
    } else {
      setLogs([]);
    }
  }, [selectedUser]);

  // Filtered User List Logic
  const filteredUsers = users.filter(user => {
    if (userFilter === "active") return user.isActive;
    if (userFilter === "deactive") return !user.isActive;
    return true;
  });

  // --- Handlers ---
  const handleUserSelect = user => {
    setSelectedUser(user);
    setEditingId(null);
    setEntryData({ morningMilk: "", morningAmount: "", eveningMilk: "", eveningAmount: "" });
  };

  const handleSaveEntry = async () => {
    // Check if user is selected
    if (!selectedUser) {
      showToast("Please select a user from the list first!", "warning");
      return;
    }

    // Check if user is active
    if (!selectedUser.isActive) {
      showToast("Cannot add entry for deactivated user!", "error");
      return;
    }

    // Validation: At least one entry should be there
    if (!entryData.morningMilk && !entryData.eveningMilk) {
      showToast("Please enter at least one milk record (Morning or Evening).", "warning");
      return;
    }

    try {
      const entryPayload = {
        userId: selectedUser._id,
        date: entryDate,
        ...entryData,
      };

      const result = await saveEntry(entryPayload);

      const newLog = {
        _id: result._id || Date.now().toString(),
        date: entryDate,
        ...entryData,
      };
      setLogs([newLog, ...logs]);
      setEntryData({ morningMilk: "", morningAmount: "", eveningMilk: "", eveningAmount: "" });
      showToast("Record saved successfully!", "success");
    } catch (error) {
      showToast(error.message || "Failed to save record", "error");
    }
  };

  // --- Inline Edit Handlers ---
  const startEditing = log => {
    setEditingId(log._id);
    setTempEditData({ ...log });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempEditData({ morningMilk: "", morningAmount: "", eveningMilk: "", eveningAmount: "" });
  };

  const saveEditedLog = async id => {
    try {
      await updateLog(id, tempEditData);
      const updatedLogs = logs.map(log => (log._id === id ? { ...tempEditData } : log));
      setLogs(updatedLogs);
      setEditingId(null);
      showToast("Record updated successfully!", "success");
    } catch (error) {
      showToast(error.message || "Failed to update record", "error");
    }
  };

  // Check if entry is disabled
  const isEntryDisabled = !selectedUser || !selectedUser.isActive;

  return (
    <>
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Custom Styles for hidden scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row h-screen bg-[#F8FAFC] overflow-hidden font-sans">
        {/* SECTION 1: USER LIST (LEFT) */}
        <div className="w-full lg:w-1/4 bg-white border-r border-gray-100 flex flex-col shadow-sm">
          <div className="p-5 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white">
                <Users size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Vendor List</h2>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl">
              {["active", "all", "deactive"].map(f => (
                <button
                  key={f}
                  onClick={() => setUserFilter(f)}
                  className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-xl transition-all ${userFilter === f ? "bg-white shadow-lg text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
            {isLoadingUsers ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-indigo-600" />
              </div>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all group ${
                    selectedUser?._id === user._id
                      ? "border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-50"
                      : "border-gray-50 bg-gray-50/50 hover:border-gray-100"
                  } ${!user.isActive ? "opacity-60" : ""}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-[10px] font-black ${user.slNo ? "text-indigo-500" : "text-red-400 italic"}`}
                    >
                      {user.slNo ? `#${user.slNo}` : "No SlNo"}
                    </span>
                    <div className="flex items-center gap-2">
                      {!user.isActive && (
                        <span className="text-[8px] font-bold text-red-400 uppercase">
                          Deactivated
                        </span>
                      )}
                      <div
                        className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                      />
                    </div>
                  </div>
                  <p className="text-xs font-black uppercase text-gray-800 truncate group-hover:text-indigo-600">
                    {user.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-40">
                <Users size={30} className="mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase">No Users Found</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: ENTRY FORM (MIDDLE) */}
        <div className="flex-1 p-8 overflow-y-auto bg-white border-r border-gray-100 hide-scrollbar">
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

            {/* Warning for Deactivated User */}
            {selectedUser && !selectedUser.isActive && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <p className="text-xs font-bold text-red-600">
                  This user is deactivated. Entry is not allowed.
                </p>
              </div>
            )}

            <div
              className={`bg-white p-8 rounded-[3rem] shadow-2xl shadow-gray-200/40 border border-gray-100 space-y-6 transition-opacity ${isEntryDisabled ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="bg-gray-50 p-5 rounded-2xl border border-dashed border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Selected Vendor
                  </p>
                  <p className="text-sm font-black text-gray-800 uppercase leading-none mt-1">
                    {selectedUser ? selectedUser.name : "Select User"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Sl No
                  </p>
                  <p className="text-sm font-black text-indigo-600 leading-none mt-1">
                    {selectedUser?.slNo || "--"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-orange-50 py-3 px-4 rounded-2xl border border-orange-200">
                    <p className="text-base font-black uppercase text-orange-600 text-center tracking-wide">
                      ☀️ Morning
                    </p>
                  </div>
                  <NumberInput
                    placeholder="Milk (L)"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-orange-400 outline-none transition-all disabled:opacity-50"
                    value={entryData.morningMilk}
                    onChange={val => setEntryData({ ...entryData, morningMilk: val })}
                    disabled={isEntryDisabled}
                  />
                  <NumberInput
                    placeholder="Amount ₹"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-orange-400 outline-none transition-all disabled:opacity-50"
                    value={entryData.morningAmount}
                    onChange={val => setEntryData({ ...entryData, morningAmount: val })}
                    disabled={isEntryDisabled}
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 py-3 px-4 rounded-2xl border border-blue-200">
                    <p className="text-base font-black uppercase text-blue-600 text-center tracking-wide">
                      🌙 Evening
                    </p>
                  </div>
                  <NumberInput
                    placeholder="Milk (L)"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-blue-400 outline-none transition-all disabled:opacity-50"
                    value={entryData.eveningMilk}
                    onChange={val => setEntryData({ ...entryData, eveningMilk: val })}
                    disabled={isEntryDisabled}
                  />
                  <NumberInput
                    placeholder="Amount ₹"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:border-blue-400 outline-none transition-all disabled:opacity-50"
                    value={entryData.eveningAmount}
                    onChange={val => setEntryData({ ...entryData, eveningAmount: val })}
                    disabled={isEntryDisabled}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveEntry}
                disabled={isSaving || isEntryDisabled}
                className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-[2rem] uppercase text-xs tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
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

        {/* SECTION 3: LOGS & UPDATE (RIGHT) */}
        <div className="w-full lg:w-1/3 bg-gray-50 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <History size={16} /> Logs Activity
            </h2>
            {selectedUser && (
              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {selectedUser.name}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-5 pr-2 hide-scrollbar">
            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-indigo-600" />
              </div>
            ) : logs.length > 0 ? (
              logs.map(log => (
                <div
                  key={log._id}
                  className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 transition-all"
                >
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-indigo-400" />
                      <span className="text-[11px] font-black text-gray-800 italic uppercase">
                        {log.date}
                      </span>
                    </div>

                    {editingId === log._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEditing}
                          disabled={isUpdating}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                        <button
                          onClick={() => saveEditedLog(log._id)}
                          disabled={isUpdating}
                          className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(log)}
                        className="p-2.5 bg-gray-50 rounded-xl text-gray-400 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Edit2 size={12} />
                      </button>
                    )}
                  </div>

                  {editingId === log._id ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-orange-500 ml-1">
                            ☀️ Morning Milk
                          </label>
                          <NumberInput
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-400 outline-none"
                            value={tempEditData.morningMilk}
                            onChange={val => setTempEditData({ ...tempEditData, morningMilk: val })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-orange-500 ml-1">
                            ☀️ Morning Amt
                          </label>
                          <NumberInput
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-orange-400 outline-none"
                            value={tempEditData.morningAmount}
                            onChange={val =>
                              setTempEditData({ ...tempEditData, morningAmount: val })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pb-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-blue-500 ml-1">
                            🌙 Evening Milk
                          </label>
                          <NumberInput
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-400 outline-none"
                            value={tempEditData.eveningMilk}
                            onChange={val => setTempEditData({ ...tempEditData, eveningMilk: val })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-blue-500 ml-1">
                            🌙 Evening Amt
                          </label>
                          <NumberInput
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 text-xs font-bold focus:border-blue-400 outline-none"
                            value={tempEditData.eveningAmount}
                            onChange={val =>
                              setTempEditData({ ...tempEditData, eveningAmount: val })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 mb-5 animate-in fade-in">
                      <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                        <p className="text-xs font-black uppercase text-orange-500 mb-2 flex items-center gap-1">
                          ☀️ Morning
                        </p>
                        <p className="text-sm font-black">
                          {log.morningMilk || 0}L <span className="text-orange-200 mx-1">|</span> ₹
                          {log.morningAmount || 0}
                        </p>
                      </div>
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-xs font-black uppercase text-blue-500 mb-2 flex items-center gap-1">
                          🌙 Evening
                        </p>
                        <p className="text-sm font-black">
                          {log.eveningMilk || 0}L <span className="text-blue-200 mx-1">|</span> ₹
                          {log.eveningAmount || 0}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-gray-900 p-4 rounded-2xl text-white">
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      Total
                    </div>
                    <div className="text-xs font-black tracking-tighter">
                      {Number(
                        editingId === log._id ? tempEditData.morningMilk : log.morningMilk || 0
                      ) +
                        Number(
                          editingId === log._id ? tempEditData.eveningMilk : log.eveningMilk || 0
                        )}{" "}
                      L <span className="mx-2 opacity-30">•</span> ₹
                      {Number(
                        editingId === log._id ? tempEditData.morningAmount : log.morningAmount || 0
                      ) +
                        Number(
                          editingId === log._id
                            ? tempEditData.eveningAmount
                            : log.eveningAmount || 0
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 opacity-20">
                <Hash size={40} className="mx-auto mb-2" />
                <p className="text-[10px] font-black uppercase">
                  {selectedUser ? "No Logs Found" : "Select a user to view logs"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageMilk;
