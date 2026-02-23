import React from "react";
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Heart } from "lucide-react";

const Footer = ({ isSidebarOpen }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-[#5b8db6] text-white py-10 px-6 sm:px-12 transition-all duration-300 relative overflow-hidden
        ${isSidebarOpen ? "md:ml-[260px]" : "ml-0"}`}
    >
      {/* Background Decorative Element (Inspired by your image style) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

          {/* Column 1: Brand Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                <span className="font-black text-xl italic">b.</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">bdtask.</h2>
            </div>
            <p className="text-blue-50/80 text-sm leading-relaxed max-w-xs">
              Bdtask UI Kit. Carefully crafted UI components for modern
              experience design. 100+ components and sample pages will help
              you to create any project efficiently.
            </p>
          </div>

          {/* Column 2: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-blue-100/60">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-blue-50 hover:text-white transition-colors cursor-pointer">
                <Mail size={16} className="text-blue-200" />
                <span>hello@bdtask.co</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-blue-50">
                <MapPin size={16} className="text-blue-200 mt-1" />
                <span>24 Atlantic Ave. Brooklyn,<br /> NY 11201 Bdtask Inc</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-blue-50">
                <Phone size={16} className="text-blue-200" />
                <span>+34 875 328 58 47</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-blue-100/60">Follow Us</h3>
            <p className="text-sm text-blue-50/80">Yes, we are social</p>
            <div className="flex gap-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-blue-100/70">
          <p>© {currentYear} Bdtask Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 hover:text-white transition-all cursor-pointer">
            <span>Made with</span>
            <Heart size={14} className="text-rose-400 fill-rose-400" />
            <span>for better web</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* Helper Social Icon Component */
const SocialIcon = ({ icon }) => (
  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#5b8db6] transition-all duration-300 backdrop-blur-sm border border-white/5">
    {icon}
  </button>
);

export default Footer;