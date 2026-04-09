import React, { useState, useMemo } from "react";
import { Database, Trash2, Users, Shield, RefreshCcw } from "lucide-react";
import useToast from "../hooks/useToast.js";
import Toast from "../components/common/Toast.jsx";
import ArchiveTab from "../components/config/ArchiveTab.jsx";
import CleanupTab from "../components/config/CleanupTab.jsx";
import UsersTab from "../components/config/UsersTab.jsx";
import DeleteModal from "../components/config/DeleteModal.jsx";
import { MONTHS } from "../components/config/components/MonthYearSelect.jsx";
import {
  deleteArchiveService,
  fetchArchivesService,
  generateArchiveService,
  handleUpdateArchiveService,
  deleteMilkEntriesService,
  getUserBySlNoAndNameService,
  deleteVendorService,
} from "../service/index.js";

const TABS = [
  { id: "archives", label: "Archives", icon: Database },
  { id: "cleanup", label: "Cleanup", icon: Trash2 },
  { id: "users", label: "Users", icon: Users },
];

const CURRENT_YEAR = new Date().getFullYear();

const Config = () => {
  const [activeTab, setActiveTab] = useState("archives");
  const [archives, setArchives] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({ month: "", year: CURRENT_YEAR });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const res = await fetchArchivesService(searchTerm);
      setArchives(res?.data || []);
    } catch (err) {
      showError(err.message || "Failed to fetch archives");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const slNo = searchTerm;
      const res = await getUserBySlNoAndNameService({ slNo });
      setAllUsers(res?.data || []);
    } catch (err) {
      showError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!formData.month || !formData.year) {
      return showWarning("Please select month and year");
    }

    setActionLoading(true);
    try {
      const res = await generateArchiveService(formData);
      showSuccess(res?.message || "Archive generated successfully!");
      fetchArchives();
    } catch (err) {
      showError(err.response?.data?.message || "Generation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteArchive = async id => {
    if (!window.confirm("Delete this archive record?")) return;

    try {
      const res = await deleteArchiveService(id);
      setArchives(prev => prev.filter(a => a._id !== id));
      showSuccess(res.message || "Archive deleted successfully");
    } catch (err) {
      showError(err.message || "Failed to delete archive");
    }
  };

  const handleUpdateArchive = async id => {
    try {
      const res = await handleUpdateArchiveService(id);
      setArchives(prev => prev.map(archive => (archive._id === id ? res.data : archive)));
      showSuccess(res.message);
      if (!res.success) {
        showError(res.message);
      }
    } catch (error) {
      showError(error.message);
    }
  };

  const handleCleanupMilk = async () => {
    if (!formData.month || !formData.year) {
      return showWarning("Please select month and year");
    }

    const monthName = MONTHS.find(m => m.value === parseInt(formData.month))?.label;
    if (!window.confirm(`⚠️ DANGER: Delete all milk entries for ${monthName} ${formData.year}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await deleteMilkEntriesService(formData);
      showSuccess(res.message || "Monthly data purged successfully!");
    } catch (err) {
      showError(err.response?.data?.message || "Cleanup failed");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmUserDeletion = async () => {
    if (!userToDelete) return;

    setActionLoading(true);
    try {
      const res = await deleteVendorService(userToDelete?._id);
      setAllUsers(prev => prev.filter(u => u._id !== userToDelete._id));
      setIsModalOpen(false);
      setUserToDelete(null);
      showSuccess(res.message || "User deleted successfully");
    } catch (err) {
      showError(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredArchives = useMemo(() => {
    return archives.filter(a => a.year?.toString().includes(searchTerm));
  }, [archives, searchTerm]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allUsers.filter(
      user => user.name?.toLowerCase().includes(term) || user.slNo?.toString().includes(term)
    );
  }, [allUsers, searchTerm]);

  const openDeleteModal = user => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const handleManualRefresh = () => {
    if (activeTab === "archives") fetchArchives();
    if (activeTab === "users") fetchUsers();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-200">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Admin Control Panel</h1>
              <p className="text-gray-500">Manage data lifecycle, archives & user access</p>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 w-full md:w-max overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm("");
                  }}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-medium 
                    transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200"
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab !== "cleanup" && activeTab !== "users" && (
            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              <span className="hidden md:inline">Refresh Data</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-[28px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {activeTab === "archives" && (
            <ArchiveTab
              formData={formData}
              setFormData={setFormData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
              actionLoading={actionLoading}
              filteredArchives={filteredArchives}
              onGenerate={handleGenerate}
              onDelete={handleDeleteArchive}
              onUpdate={handleUpdateArchive}
            />
          )}

          {activeTab === "cleanup" && (
            <CleanupTab
              formData={formData}
              setFormData={setFormData}
              actionLoading={actionLoading}
              onCleanup={handleCleanupMilk}
            />
          )}

          {activeTab === "users" && (
            <UsersTab
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loading={loading}
              filteredUsers={filteredUsers}
              onDeleteUser={openDeleteModal}
              onSearch={fetchUsers}
            />
          )}
        </div>

        <footer className="mt-8 text-center text-sm text-gray-400">Admin Panel v1.0</footer>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmUserDeletion}
        userName={userToDelete?.fullName}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default Config;
