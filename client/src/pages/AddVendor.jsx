import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const AddVendor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    slNo: "",
    name: "",
    mobile: "",
    password: "",
    address: "",
    milkType: "Cow",
  });

  const handleChange = e => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Yahan aapki actual API call hogi
      // const response = await axios.post('/api/vendors', formData);

      alert("Vendor registered successfully!");
      setFormData({ slNo: "", name: "", mobile: "", password: "", address: "", milkType: "Cow" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 min-h-[calc(100vh-80px)] bg-[#F5F5F5] px-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Register New Vendor</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Create farmer profile and security credentials
          </p>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3 animate-shake">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700 text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
                Serial Number (SL No)
              </label>
              <input
                type="number"
                name="slNo"
                value={formData.slNo}
                onChange={handleChange}
                className={`p-3 border rounded-lg outline-none focus:ring-2 transition-all font-semibold appearance-none ${error && error.includes("Serial") ? "border-red-500 ring-red-200" : "border-gray-300 ring-indigo-500"}`}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
                Milk Type
              </label>
              <select
                name="milkType"
                value={formData.milkType}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-indigo-500 transition-all font-bold bg-white"
              >
                <option value="Cow">Cow (Gai)</option>
                <option value="Buffalo">Buffalo (Bhains)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-indigo-500 font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
                Mobile Number
              </label>
              <input
                type="number"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-indigo-500 font-semibold appearance-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
                Account Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-3 w-full border border-gray-300 rounded-lg outline-none focus:ring-2 ring-indigo-500 font-semibold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-black text-gray-500 uppercase tracking-tighter">
              Village / Address
            </label>
            <textarea
              name="address"
              rows="2"
              value={formData.address}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-indigo-500 font-semibold resize-none"
            ></textarea>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 text-white font-black py-3 rounded-lg transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? "Registering..." : "Register Vendor"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setError("");
                setFormData({
                  slNo: "",
                  name: "",
                  mobile: "",
                  password: "",
                  address: "",
                  milkType: "Cow",
                });
              }}
              className="px-6 py-3 border border-gray-300 text-gray-500 font-bold rounded-lg hover:bg-gray-100 transition-all uppercase text-xs"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
