import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MilkLogo from "../components/shared/milkLogo";
import { loginUserService } from "../service/index.js";
import { setAuth } from "../app/features/authSlice.js";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [slNo, setslNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setLoading(false);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError("");

    if (!slNo.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const response = await loginUserService({ slNo, password });
      if (response.statusCode === 200) {
        dispatch(setAuth(response.data));
        navigate("/home");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Server timeout. Please try again."
          : "Login failed. Check your credentials.");
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/milk-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-blue-900/70 via-sky-800/60 to-teal-900/70 backdrop-blur-[2px]" />

      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div
        className={`relative z-10 w-full max-w-md mx-4 ${shake ? "animate-shake" : ""}`}
        style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/40 p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <MilkLogo />
            <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow">Milk Home</h1>
            <p className="text-sky-200/80 text-sm mt-1 tracking-widest uppercase font-medium">
              Farm Management Portal
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs font-medium">SIGN IN TO CONTINUE</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-5">
            <div className="group">
              <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">
                User ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sky-300 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={slNo}
                  onChange={e => {
                    setslNo(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your User ID"
                  autoComplete="username"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30
                             focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60
                             hover:border-white/30 transition-all duration-200 text-sm font-medium"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-white/70 text-xs font-semibold uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-sky-300 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"
                    />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your Password"
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30
                             focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400/60
                             hover:border-white/30 transition-all duration-200 text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3 text-red-200 text-sm">
                <svg
                  className="w-4 h-4 shrink-0 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
                         bg-linear-to-r from-sky-500 to-teal-500
                         hover:from-sky-400 hover:to-teal-400
                         active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white shadow-lg shadow-sky-500/30
                         transition-all duration-200
                         flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  <span>Login to Milk Home</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <svg
              className="w-4 h-4 text-white/30 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25z"
              />
            </svg>
            <p className="text-white/25 text-[10px] truncate leading-tight">
              {navigator.userAgent.split(")")[0].replace("(", "").trim()}
            </p>
          </div>

          <p className="text-center text-white/25 text-xs mt-5">
            © {new Date().getFullYear()} Milk Home. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Login;
