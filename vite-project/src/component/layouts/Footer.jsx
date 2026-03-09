import { Mail, MapPin, Phone, Heart } from "lucide-react";

const Footer = ({ isSidebarOpen }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`bg-[#0f2e2e] text-white py-10 px-6 sm:px-12 transition-all duration-300 relative overflow-hidden
        ${isSidebarOpen ? "md:ml-[260px]" : "ml-0"}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full -ml-10 -mb-10 blur-2xl" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-black text-lg">B</span>
              </div>
              <h2 className="text-xl font-black tracking-tight">Bizzfly</h2>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Streamline your workforce with smarter tools. Manage your team, track performance, and grow your business — effortlessly.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[3px] text-white/40">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors cursor-pointer">
                <Mail size={15} className="text-emerald-400 shrink-0" />
                <span>support@bizzfly.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>404 Business Park, Andheri West,<br />Mumbai, India 400053</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors">
                <Phone size={15} className="text-emerald-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-white/40">
          <p>© {currentYear} Bizzfly. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart size={12} className="text-rose-400 fill-rose-400" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;