import React from "react";
import { MoveRight, CheckCircle2 } from "lucide-react";

const Home = () => {
  const backgroundImage =
    "https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=1920";

  const farmFeatures = [
    "Real-time Milk Quality Tracking",
    "Digital Ledger for Farmers",
    "Automated Fat & SNF Calculation",
    "Transparent Payment Solutions",
  ];

  return (
    <div className="relative min-h-[calc(100vh-60px)] w-full flex items-center justify-center p-6 overflow-hidden bg-indigo-950">
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Dairy Farm Background"
          className="w-full h-full object-cover opacity-50 scale-105"
          onError={e => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950 via-transparent to-indigo-950/50" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">
              Next-Gen Dairy Tech
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
            Empowering <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-300 to-white">
              Local Farms
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-8">
            Kishan Milk Management is bridging the gap between traditional farming and modern
            technology. We provide a digital ecosystem to ensure every drop of milk is accounted for
            with 100% precision.
          </p>

          
        </div>

        <div className="w-full md:w-80 backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-6 pb-4 border-b border-white/10 text-center">
            Farm Solutions
          </h3>

          <ul className="space-y-6">
            {farmFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="text-indigo-400 shrink-0" size={20} />
                <span className="text-gray-200 text-sm font-semibold leading-snug">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">
              Digitalizing Since 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
