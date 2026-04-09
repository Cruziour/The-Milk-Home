import React from "react";
import { Search, FilePlus, Loader2, Database } from "lucide-react";
import MonthYearSelect from "./components/MonthYearSelect";
import SkeletonTable from "./components/SkeletonTable";
import EmptyState from "./components/EmptyState";
import ArchiveRow from "./components/ArchiveRow";

const ArchiveTab = ({
  formData,
  setFormData,
  searchTerm,
  setSearchTerm,
  loading,
  actionLoading,
  filteredArchives,
  onGenerate,
  onDelete,
  onUpdate,
}) => {
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <MonthYearSelect formData={formData} setFormData={setFormData} />
          <button
            onClick={onGenerate}
            disabled={actionLoading}
            className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
              text-white px-6 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 
              transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-50"
          >
            {actionLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <FilePlus size={20} /> Generate Archive
              </>
            )}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by year..."
            className="w-full lg:w-64 pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
              outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        {loading ? (
          <SkeletonTable />
        ) : filteredArchives.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No Archives Found"
            description="Generate your first archive by selecting a month and year above."
          />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">
                  Period
                </th>
                <th className="p-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">
                  Total Milk
                </th>
                <th className="p-4 text-left text-gray-500 font-medium uppercase text-xs tracking-wider">
                  Total Amount
                </th>
                <th className="p-4 text-center text-gray-500 font-medium uppercase text-xs tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredArchives.map(item => (
                <ArchiveRow key={item._id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ArchiveTab;
