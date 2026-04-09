import React from "react";
import { Calendar } from "lucide-react";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("en", { month: "long" }),
}));

const MonthYearSelect = ({ formData, setFormData, className = "" }) => (
  <div className={`flex gap-3 ${className}`}>
    <div className="relative flex-1">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <select
        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
        value={formData.month}
        onChange={e => setFormData(prev => ({ ...prev, month: e.target.value }))}
      >
        <option value="">Select Month</option>
        {MONTHS.map(m => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
    <input
      type="number"
      min="2000"
      max="2100"
      className="w-28 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none 
        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center"
      value={formData.year}
      onChange={e => setFormData(prev => ({ ...prev, year: e.target.value }))}
      placeholder="Year"
    />
  </div>
);

export { MONTHS };
export default MonthYearSelect;
