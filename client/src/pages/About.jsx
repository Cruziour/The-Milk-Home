import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaHeart } from "react-icons/fa";
import { HiOutlineCpuChip, HiSparkles } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import {
  Database,
  ShieldCheck,
  Smartphone,
  Clock,
  FileText,
  TrendingUp,
  CheckCircle2,
  Zap,
  Globe,
  Code2,
  Coffee,
  Star,
} from "lucide-react";

const About = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const softwareFeatures = [
    {
      icon: <Database size={28} />,
      title: "MERN Stack",
      desc: "Built with MongoDB, Express, React, and Node.js for high performance and scalability.",
      color: "indigo",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Secure Data",
      desc: "Integrated with JWT authentication and encrypted passwords to keep your records safe.",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: <HiOutlineCpuChip size={28} />,
      title: "Auto-Calculation",
      desc: "Automatic calculation of milk quantity, fat, and rate to ensure 100% accuracy.",
      color: "orange",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Smartphone size={28} />,
      title: "Responsive Design",
      desc: "Works seamlessly on desktop, tablet, and mobile devices for on-the-go access.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Clock size={28} />,
      title: "Real-time Updates",
      desc: "Instant data synchronization ensures you always have the latest information.",
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Analytics & Reports",
      desc: "Comprehensive reports and analytics to track your business growth.",
      color: "violet",
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  const stats = [
    {
      number: "100%",
      label: "Data Accuracy",
      icon: <Zap size={20} className="text-yellow-500" />,
    },
    {
      number: "Cloud",
      label: "Remote Access",
      icon: <Globe size={20} className="text-yellow-300" />,
    },
    {
      number: "1M+",
      label: "Entries Managed",
      icon: <Database size={20} className="text-emerald-500" />,
    },
    {
      number: "PDF/Excel",
      label: "Auto Reports",
      icon: <FileText size={20} className="text-orange-500" />,
    },
  ];

  const techStack = [
    { name: "React.js", color: "bg-cyan-500" },
    { name: "Node.js", color: "bg-green-600" },
    { name: "Express.js", color: "bg-gray-700" },
    { name: "MongoDB", color: "bg-emerald-600" },
    { name: "Tailwind CSS", color: "bg-sky-500" },
    { name: "JWT Auth", color: "bg-purple-600" },
    { name: "REST API", color: "bg-orange-500" },
    { name: "Lucide Icons", color: "bg-rose-500" },
  ];

  const highlights = [
    "Easy vendor management",
    "Morning & Evening milk tracking",
    "Automated amount calculation",
    "Secure login system",
    "Export reports to PDF",
    "Multi-device support",
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <HiSparkles className="text-yellow-300" size={16} />
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
                Version 2.0 Released
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
              Kishan <span className="text-yellow-300">Milk</span> Management
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 font-medium max-w-2xl mx-auto">
              The Ultimate Digital Solution for Modern Dairy Collection Centers
            </p>

            {/* Stats Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-2 text-yellow-300 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-white">{stat.number}</p>
                  <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="#f8fafc"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Features Grid */}
        <section>
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Why Choose <span className="text-indigo-600">Us?</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Powerful features designed to make dairy management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwareFeatures.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`relative p-8 bg-white rounded-3xl border-2 transition-all duration-500 cursor-pointer group overflow-hidden ${
                  hoveredFeature === index
                    ? "border-indigo-200 shadow-2xl shadow-indigo-100 -translate-y-2"
                    : "border-gray-100 shadow-lg shadow-gray-100/50"
                }`}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                <div
                  className={`relative w-14 h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <h3 className="relative text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                <p className="relative text-sm text-gray-500 leading-relaxed">{feature.desc}</p>

                {/* Arrow Icon */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <div
                    className={`w-10 h-10 rounded-full bg-linear-to-br ${feature.gradient} flex items-center justify-center text-white`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
                All-in-One Solution
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                Everything You Need to{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                  Manage Your Dairy
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                From vendor registration to payment calculation, our software handles every aspect
                of your dairy collection center with precision and ease.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="relative">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
              Meet The Creator
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Developed With <span className="text-red-500">❤️</span>
            </h2>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Image/Avatar Section */}
              <div className="lg:w-2/5 bg-linear-to-br from-indigo-600 via-purple-600 to-indigo-700 p-10 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/50 shadow-2xl">
                    <div className="w-36 h-36 rounded-full bg-linear-to-br from-white to-gray-100 flex items-center justify-center">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-purple-600">
                        RK
                      </span>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-2 rounded-full shadow-lg">
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-black text-white">Rupesh Kumar</h3>
                  <p className="text-indigo-200 font-bold mt-1">Full Stack Developer</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 mt-6">
                  <NavLink
                    to="https://github.com/Cruziour"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <FaGithub size={18} />
                  </NavLink>
                  <NavLink
                    to="https://www.linkedin.com/in/rupesh-kumar-raushan-87a5b7185/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <FaLinkedin size={18} />
                  </NavLink>
                  <NavLink
                    to="mailto:www.rupeshkumarraushan0@gmail.com"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <FaEnvelope size={18} />
                  </NavLink>
                  <NavLink
                    to="https://wa.me/6204563476"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    <FaWhatsapp size={18} />
                  </NavLink>
                </div>
              </div>

              {/* Right: Content Section */}
              <div className="lg:w-3/5 p-10 lg:p-12">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4">
                  <Globe size={12} /> Open for Opportunities
                </div>

                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                  Rupesh Kumar Raushan
                </h2>
                <p className="text-indigo-600 font-bold mb-6">
                  MERN Stack Developer | BCA Graduate
                </p>

                <p className="text-gray-600 leading-relaxed mb-6">
                  I am a passionate Full Stack Developer on a mission to digitalize the dairy
                  industry. By combining the academic precision of my BCA background with modern
                  MERN stack technologies, I have built this software to provide a seamless, secure,
                  and automated solution for milk collection centers everywhere.
                </p>

                <p className="text-gray-600 leading-relaxed mb-8">
                  With a strong foundation in{" "}
                  <span className="font-bold text-gray-800">React.js, Node.js, MongoDB,</span> and{" "}
                  <span className="font-bold text-gray-800">Express.js</span>, I specialize in
                  building full-stack applications that solve real-world problems.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <NavLink
                    to="mailto:www.rupeshkumarraushan0@gmail.com"
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-xl active:scale-95"
                  >
                    <FaEnvelope size={16} /> Get in Touch
                  </NavLink>
                  <NavLink
                    to="https://github.com/Cruziour"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Code2 size={16} /> View Projects
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="text-center">
          <span className="inline-block bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">
            Technologies
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
            Built With Modern Tech Stack
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group relative px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div
                  className={`absolute inset-0 ${tech.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
                />
                <span className="relative text-sm font-bold text-gray-700 group-hover:text-gray-900">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-white tracking-tight">
                Kishan <span className="text-indigo-400">Milk</span>
              </h3>
              <p className="text-gray-500 text-sm mt-1">Dairy Management Made Simple</p>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <FaHeart className="text-red-500 animate-pulse" size={14} />
              <span>in India</span>
              <Coffee className="text-amber-500 ml-2" size={16} />
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">© 2024 All Rights Reserved</p>
              <p className="text-gray-600 text-xs mt-1">v2.0.0 | Rupesh Kumar Raushan</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
