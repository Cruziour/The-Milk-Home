import React from "react";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";

const Contact = () => {
  const contactDetails = [
    {
      icon: <Phone size={20} className="text-indigo-600" />,
      label: "Phone Number",
      value: "+91 98765 43210",
    },
    {
      icon: <Mail size={20} className="text-indigo-600" />,
      label: "Email Address",
      value: "support@kishanmilk.com",
    },
    {
      icon: <MapPin size={20} className="text-indigo-600" />,
      label: "Our Center",
      value: "Near Mahakal Chowk, Jandaha, Bihar",
    },
    {
      icon: <Clock size={20} className="text-indigo-600" />,
      label: "Working Hours",
      value: "Mon - Sun (5:00 AM - 9:00 PM)",
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-[#F5F5F5] px-4 py-10">
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 flex flex-col md:flex-row">
        {/* LEFT SIDE: Image Section */}
        <div className="md:w-1/2 bg-indigo-50 flex items-center justify-center p-8">
          <div className="text-center">
            {/* Aap yahan apni koi bhi local image path dal sakte hain */}
            <img
              src="https://img.freepik.com/free-vector/customer-support-flat-design-illustration_23-2148889374.jpg"
              alt="Contact Us"
              className="max-w-full h-auto rounded-lg mix-blend-multiply"
            />
            <h3 className="mt-6 text-2xl font-black text-indigo-900 uppercase tracking-tight">
              Kishan Milk Center
            </h3>
            <p className="text-indigo-600 font-bold text-sm mt-1">Trusted by 5000+ Farmers</p>
          </div>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
              Get In Touch
            </h2>
            <div className="h-1.5 w-16 bg-indigo-600 mt-2 rounded-full"></div>
            <p className="text-gray-500 mt-4 font-medium">
              Aapko kisi bhi tarah ki sahayata ya jankari chahiye toh humein sampark karein. Hum
              aapki madad ke liye hamesha taiyar hain.
            </p>
          </div>

          <div className="space-y-6">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                    {item.label}
                  </p>
                  <p className="text-gray-800 font-bold text-base tracking-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest cursor-pointer hover:underline">
              <Globe size={16} />
              www.kishanmilk.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
