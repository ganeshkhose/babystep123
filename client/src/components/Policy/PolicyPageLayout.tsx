import React from 'react';
import { Link } from 'react-router-dom';
import { PolicyPageData, PolicySection } from '../../types/policy';

interface PolicyPageLayoutProps {
  data: PolicyPageData;
  renderCustomSection?: (section: PolicySection) => React.ReactNode;
}

export const PolicyPageLayout: React.FC<PolicyPageLayoutProps> = ({
  data,
  renderCustomSection,
}) => {
  return (
    <div className="min-h-screen bg-transparent">
      {/* 1. Header Bar with Brand Logo */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE1EA] shadow-soft-sm">
        <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center">
          <Link to="/" title="The Baby Step - Home" className="flex items-center">
            <img
              src="/logo.png"
              alt="The Baby Step"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-200 hover:scale-105 filter drop-shadow-xs"
            />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-6 sm:pb-8 bg-gradient-to-b from-brand-pink/10 via-transparent to-brand-baby-blue/10 border-b border-[#EDE1EA]">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          {/* Upper Brand Text */}
          <div className="inline-block px-3 py-1 rounded-full bg-brand-blue-light text-brand-blue text-[11px] sm:text-xs font-bold uppercase tracking-widest border border-brand-baby-blue/35">
            {data.brand}
          </div>

          {/* Page Heading */}
          <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy font-display tracking-tight">
            {data.title}
          </h1>

          {/* Introduction Statements */}
          <div className="max-w-2xl mx-auto space-y-2 text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
            {data.intro.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="space-y-6">
          {data.sections.map((sec) => (
            <article
              key={sec.id}
              id={`section-${sec.id}`}
              className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#EDE1EA] shadow-soft-sm p-5 sm:p-7 transition-all duration-200"
            >
              {/* Section Header with Number Badge */}
              <div className="flex items-start gap-3 sm:gap-4 mb-3.5">
                <div className="w-8 h-8 rounded-2xl bg-brand-blue-light text-brand-blue border border-brand-baby-blue/35 font-bold font-display text-sm flex items-center justify-center shrink-0">
                  {sec.id}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-brand-navy font-display">
                    {sec.title}
                  </h2>
                </div>
              </div>

              {/* Section Body */}
              <div className="space-y-3 pl-11 sm:pl-12 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {/* Lead sentence */}
                {sec.lead && (
                  <p className="font-semibold text-slate-700">
                    {sec.lead}
                  </p>
                )}

                {/* Bullets List if any */}
                {sec.items && sec.items.length > 0 && (
                  <ul className="space-y-2 pt-1 pb-1">
                    {sec.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 mt-2" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Additional Note if any */}
                {sec.note && (
                  <div className="mt-3 p-3 rounded-2xl bg-brand-blue-light/50 border border-brand-baby-blue/30 text-slate-700 text-xs sm:text-[13px] leading-relaxed">
                    <p className="font-medium">{sec.note}</p>
                  </div>
                )}

                {/* Paragraphs if any */}
                {sec.paragraphs && sec.paragraphs.length > 0 && (
                  <div className="space-y-2.5">
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-slate-600">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {/* Custom Section Details if any */}
                {renderCustomSection && renderCustomSection(sec)}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PolicyPageLayout;
