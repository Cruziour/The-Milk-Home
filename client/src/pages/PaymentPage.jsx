import React, { useState, useCallback } from "react";
import {
  IndianRupee,
  Search,
  Loader2,
  ChevronLeft,
  Wallet,
  ArrowUpRight,
  Milk,
  ReceiptIndianRupee,
  Calendar,
  Calculator,
  Printer,
  Download,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getVendorLedgerService,
  addPaymentService,
  downloadVendorLedgerService,
} from "../service/index.js";
import useToast from "../hooks/useToast";
import Toast from "../components/common/Toast.jsx";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [slNo, setSlNo] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("Monthly Settlement");

  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [ledger, setLedger] = useState({
    user: null,
    summary: { openingBalance: 0, totalCredit: 0, totalDebit: 0, netPayable: 0 },
    vouchers: [],
    isSettled: false,
  });

  const fetchBackendLedger = useCallback(async () => {
    if (!slNo) {
      setLedger({
        user: null,
        summary: { openingBalance: 0, totalCredit: 0, totalDebit: 0, netPayable: 0 },
        vouchers: [],
      });
      return;
    }

    setSearching(true);
    try {
      const [year, month] = selectedMonth.split("-");
      const response = await getVendorLedgerService(slNo, month, year);

      if (response.success) {
        setLedger(response.data);
      }
    } catch (err) {
      alert(err);
      setLedger(prev => ({ ...prev, user: null, vouchers: [] }));
    } finally {
      setSearching(false);
    }
  }, [selectedMonth, slNo]);

  const handleSaveVoucher = async e => {
    e.preventDefault();
    if (!ledger.user) return showError("Please select a valid vendor first");
    if (Number(amount) <= 0) return showError("Invalid Amount");

    setSubmitting(true);
    try {
      const dateObj = new Date(paymentDate);
      const payload = {
        slNo: parseInt(slNo),
        amount: parseFloat(amount),
        remark,
        month: dateObj.getMonth() + 1,
        year: dateObj.getFullYear(),
        paymentDate,
      };

      const response = await addPaymentService(payload);

      if (response.success) {
        showSuccess("Voucher Posted Successfully");
        setAmount("");
        fetchBackendLedger();
      }
    } catch (err) {
      showError(err.response?.data?.message || "Transaction Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!ledger.user) return showError("Please search a vendor first");

    try {
      const [year, month] = selectedMonth.split("-");
      const blob = await downloadVendorLedgerService(slNo, month, year);

      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;

      const fileName = `Ledger_${slNo}_${selectedMonth}.pdf`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess("PDF Downloaded Successfully");
    } catch (err) {
      showError(err.message || "Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-slate-900 pb-12 font-sans">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <nav className="bg-[#0F172A] text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="h-6 w-px bg-slate-700"></div>
          <h2 className="text-sm font-black tracking-widest uppercase italic text-indigo-400">
            Payment Ledger
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-700">
            <Calendar size={16} className="text-indigo-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-black outline-none border-none text-white cursor-pointer"
            />
          </div>
        </div>
      </nav>

      <div className="max-w-400 mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 italic">
                New Debit Entry
              </h3>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Calculator size={18} />
              </div>
            </div>

            <form onSubmit={handleSaveVoucher} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                  Vendor Serial Number
                </label>
                <div className="relative mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-5 top-1/2 -translate-y-1/2 ${searching ? "text-indigo-500 animate-pulse" : "text-slate-300"}`}
                      size={20}
                    />
                    <input
                      type="number"
                      value={slNo}
                      onChange={e => setSlNo(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl font-black text-lg focus:ring-4 ring-indigo-50 transition-all outline-none"
                      placeholder="e.g. 101"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchBackendLedger}
                    className="bg-slate-900 text-white px-6 rounded-3xl hover:bg-black transition-all"
                  >
                    <Search size={20} />
                  </button>
                </div>
              </div>

              {ledger.user && (
                <div className="p-6 bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl text-white shadow-xl animate-in zoom-in-95">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[9px] font-bold uppercase opacity-60">Verified Account</p>
                      <h4 className="text-xl font-black mt-1 italic">{ledger.user.name}</h4>
                    </div>
                    <ShieldCheck size={24} className="opacity-40" />
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                      {ledger.user.phone}
                    </span>
                  </div>
                </div>
              )}

              <div
                className={
                  !ledger.user
                    ? "opacity-20 pointer-events-none transition-opacity"
                    : "space-y-6 transition-opacity"
                }
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Transaction Date
                  </label>
                  <div className="relative">
                    <CalendarDays
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"
                      size={20}
                    />
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={e => setPaymentDate(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 ring-indigo-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Amount to Debit (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600"
                      size={24}
                    />
                    <input
                      type="text"
                      value={amount}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === "" || /^[0-9]*$/.test(val)) {
                          setAmount(val);
                        }
                      }}
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border-none rounded-4xl text-4xl font-black text-slate-800 outline-none focus:ring-4 ring-indigo-50"
                      placeholder="0"
                      inputMode="numeric" // Mobile par number keyboard open karne ke liye
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">
                    Internal Narration
                  </label>
                  <input
                    type="text"
                    value={remark}
                    onChange={e => setRemark(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !ledger.user}
                  className="w-full py-6 bg-slate-900 text-white rounded-4xl font-black text-xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-200"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      POST VOUCHER <ArrowUpRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-600">
                <Milk size={60} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Opening Bal
              </p>
              <h3 className="text-2xl font-black text-slate-800 mt-2">
                ₹{ledger.summary.openingBalance.toLocaleString()}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">
                Brought Forward
              </p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-600">
                <ReceiptIndianRupee size={60} />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                Total Credit
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-2">
                ₹{ledger.summary.totalCredit.toLocaleString()}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">
                Monthly Milk Value
              </p>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-rose-600">
                <Wallet size={60} />
              </div>
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                Total Debit
              </p>
              <h3 className="text-2xl font-black text-rose-600 mt-2">
                ₹{ledger.summary.totalDebit.toLocaleString()}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">
                Payments Disbursed
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-white flex flex-col h-162.5 overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">
                  Statement of Accounts
                </h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Period: {selectedMonth}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-600"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white shadow-xs z-10">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                    <th className="px-10 py-5">Date</th>
                    <th className="px-6 py-5">Voucher Detail</th>
                    <th className="px-6 py-5 text-right">Debit (Dr)</th>
                    <th className="px-10 py-5 text-right">Credit (Cr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {searching ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
                      </td>
                    </tr>
                  ) : ledger.user && ledger.vouchers.length > 0 ? (
                    ledger.vouchers.map((v, i) => (
                      <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-10 py-6 text-xs font-black text-slate-400">{v.date}</td>
                        <td className="px-6 py-6">
                          <p className="text-sm font-black text-slate-800">{v.title}</p>
                          <p className="text-[9px] font-bold text-indigo-400 uppercase mt-1 tracking-widest italic">
                            {v.id} • Verified
                          </p>
                        </td>
                        <td
                          className={`px-6 py-6 text-right font-black text-sm ${v.dr > 0 ? "text-rose-500" : "text-slate-300"}`}
                        >
                          {v.dr > 0 ? `₹${v.dr.toLocaleString()}` : "0.00"}
                        </td>
                        <td
                          className={`px-10 py-6 text-right font-black text-sm ${v.cr > 0 ? "text-emerald-500" : "text-slate-300"}`}
                        >
                          {v.cr > 0 ? `₹${v.cr.toLocaleString()}` : "0.00"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
              <div className="flex gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">
                    Total Milk (Cr)
                  </p>
                  <p className="text-xl font-black text-emerald-400 italic">
                    ₹{ledger.summary.totalCredit.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-800"></div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 mb-1">
                    Total Paid (Dr)
                  </p>
                  <p className="text-xl font-black text-rose-400 italic">
                    ₹{ledger.summary.totalDebit.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">
                  Net Closing Balance
                </p>
                <h2 className="text-4xl font-black text-white italic tracking-tighter">
                  ₹{ledger.summary.netPayable.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
