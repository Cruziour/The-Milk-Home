import React from "react";
import useToast from "../hooks/useToast.js";
import { Header, UserList, MilkEntryForm, LogsSection } from "../components/ManageMilk/index.js";
import Toast from "../components/common/Toast.jsx";

const GlobalStyles = () => (
  <style>{`
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
  `}</style>
);

const ManageMilk = () => {
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const handleSuccess = message => {
    showSuccess(message);
  };

  const handleError = message => {
    if (
      typeof message === "string" &&
      (message.includes("warning") || message.includes("Please"))
    ) {
      showWarning(message);
    } else {
      showError(message);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Global Styles */}
      <GlobalStyles />

      {/* Main Layout */}
      <div className="flex flex-col h-screen bg-[#F8FAFC] md:overflow-hidden overscroll-y-auto font-sans">
        <Header onRefreshSuccess={handleSuccess} onRefreshError={handleError} />

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row lg:gap-12 mt-2 flex-1 md:overflow-hidden overflow-y-auto min-h-screen mb-40">
          {/* Section 1: User List */}
          <UserList />

          {/* Section 2: Entry Form */}
          <div>
            <MilkEntryForm onSuccess={handleSuccess} onError={handleError} />
          </div>

          {/* Section 3: Logs */}
          <LogsSection onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </>
  );
};

export default ManageMilk;
