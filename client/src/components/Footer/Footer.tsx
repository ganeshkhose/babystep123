import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Feather,
  Truck,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  Clock,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#FAF6F9] via-[#F8F2F7] to-[#F5ECF3] border-t border-[#EDE1EA] mt-2 sm:mt-4 pb-16 md:pb-0 transition-colors">
      {/* 1. Why Parents Choose Baby Step - 4 Key Benefits */}
      <div className="border-b border-[#EDE1EA] bg-white/50 backdrop-blur-xs">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-3 sm:pb-4">
          <div className="text-center mb-5 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue-light/70 px-3 py-1 rounded-full">
              Our Promise to Families
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-brand-navy font-display mt-2">
              Why parents choose Baby Step
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1.5 px-2">
              Every formula, fabric, and toy is carefully evaluated for tender infant safety and gentle comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE1EA] shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-3 sm:mb-4">
                <Feather className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Gentle Choices</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dermatologically tested formulas, plant botanicals, and hypoallergenic certified fibers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE1EA] shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-pink-light text-brand-pink flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Everyday Essentials</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                From morning bath bubbles to midnight soothing rompers, built for real parenting routines.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE1EA] shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue-powder/60 text-brand-navy flex items-center justify-center mb-3 sm:mb-4">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Thoughtfully Selected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tested by pediatric specialists with zero toxins, zero artificial dyes, and zero phthalates.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EDE1EA] shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-peach-light text-brand-navy flex items-center justify-center mb-3 sm:mb-4">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-peach" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Easy Shopping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant guest checkout, transparent pricing, fast dispatch, and simple 7-day exchanges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main E-Commerce Information & Support Hub */}
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-4 sm:pb-5">
        {/* Top Left Corner: Logo & Brand Description */}
        <div className="text-left pb-3 sm:pb-3.5 border-b border-[#EDE1EA]">
          <img
            src="/logo.png"
            alt="The Baby Step - Baby Care Products"
            className="h-9 sm:h-10 w-auto object-contain rounded-lg drop-shadow-xs"
          />
          <p className="text-xs text-slate-600 max-w-md leading-relaxed mt-1.5">
            Little essentials for every little step. Thoughtfully formulated, pediatrician-approved, and tested for tender comfort and peaceful nursery moments.
          </p>
        </div>

        {/* Details Grid Below Logo: Customer Care, Quick Links, Policies, Social Media */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 py-4 sm:py-5 border-b border-[#EDE1EA] text-left">
          {/* Col 1: Customer Care Hub (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy font-display uppercase tracking-wider">
              Customer Care
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-blue shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Contact:</span>{' '}
                  <span className="font-medium text-slate-700 select-none">
                    +91 98765 43210
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">WhatsApp:</span>{' '}
                  <span className="text-emerald-600 font-medium select-none">
                    Chat on WhatsApp
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Email:</span>{' '}
                  <span className="font-medium text-slate-700 select-none">
                    care@thebabystep.com
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700">Grievance:</span>{' '}
                  <span className="font-medium text-slate-700 select-none">
                    grievance@thebabystep.com
                  </span>
                </div>
              </li>
            </ul>

            <div className="pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-[#EDE1EA] text-[11px] font-medium text-brand-navy shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                <span>We are available from Monday to Saturday, between 10am - 6pm</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy font-display uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 select-none">
              <li>
                <span className="font-medium text-slate-600 hover:text-brand-navy cursor-default transition-colors">
                  Track Order
                </span>
              </li>
              <li>
                <span className="font-medium text-slate-600 hover:text-brand-navy cursor-default transition-colors">
                  Return Policy
                </span>
              </li>
              <li>
                <span className="font-medium text-slate-600 hover:text-brand-navy cursor-default transition-colors">
                  Shipping Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy font-display uppercase tracking-wider">
              Policies
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600 select-none">
              <li>
                <span className="font-medium text-slate-600 hover:text-brand-navy cursor-default transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="font-medium text-slate-600 hover:text-brand-navy cursor-default transition-colors">
                  Terms & Conditions
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Media (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy font-display uppercase tracking-wider">
              Social Media
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect with us for gentle parenting tips & exclusive updates.
            </p>
            <div className="flex items-center gap-2 pt-0.5 select-none">
              <span
                aria-label="Follow us on X"
                className="w-8 h-8 rounded-full bg-white/95 text-slate-700 border border-[#EDE1EA] transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-2xs cursor-default"
                title="X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>

              <span
                aria-label="Follow us on Facebook"
                className="w-8 h-8 rounded-full bg-white/95 text-slate-700 border border-[#EDE1EA] transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-2xs cursor-default"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </span>

              <span
                aria-label="Follow us on Instagram"
                className="w-8 h-8 rounded-full bg-white/95 text-slate-700 border border-[#EDE1EA] transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-2xs cursor-default"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </span>

              <span
                aria-label="Follow us on YouTube"
                className="w-8 h-8 rounded-full bg-white/95 text-slate-700 border border-[#EDE1EA] transition-all duration-200 flex items-center justify-center hover:scale-105 shadow-2xs cursor-default"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* 3. Bottom Copyright & Trust Badges */}
        <div className="pt-3.5 sm:pt-4 border-t border-[#EDE1EA] flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} The Baby Step. All rights reserved.</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Safe & Encrypted Checkout</span>
            <span className="text-slate-300">•</span>
            <span>UPI / Cards / NetBanking / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
