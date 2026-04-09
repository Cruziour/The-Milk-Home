import React from "react";
import { Calendar, Trash2, TrendingUp, RefreshCw } from "lucide-react";
import { MONTHS } from "./MonthYearSelect";

const ArchiveRow = ({ item, onDelete, onUpdate }) => (
  <tr className="hover:bg-blue-50/50 transition-colors group">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
          <Calendar size={18} />
        </div>
        <span className="font-medium text-gray-700">
          {MONTHS.find(m => m.value === item.month)?.label} {item.year}
        </span>
      </div>
    </td>
    <td className="p-4">
      <span className="text-blue-600 font-medium">
        {item.totalMilkPurchased?.toLocaleString()} L
      </span>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-emerald-400" />
        <span className="text-emerald-600 font-medium">
          ₹{item.totalBillAmount?.toLocaleString()}
        </span>
      </div>
    </td>
    <td className="p-4 text-center">
      <button
        onClick={() => onUpdate(item?._id)}
        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl 
          "
      >
        <RefreshCw size={18} />
      </button>
      <button
        onClick={() => onDelete(item?._id)}
        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl 
          "
      >
        <Trash2 size={18} />
      </button>
    </td>
  </tr>
);

export default ArchiveRow;
