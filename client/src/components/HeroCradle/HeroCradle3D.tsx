import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export const HeroCradle3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Smooth tilt angles
    setTilt({
      x: -y * 16, // rotateX
      y: x * 16,  // rotateY
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = (touch.clientX - rect.left) / rect.width - 0.5;
    const y = (touch.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: -Math.max(-0.5, Math.min(0.5, y)) * 14,
      y: Math.max(-0.5, Math.min(0.5, x)) * 14,
    });
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="relative mt-1 sm:mt-2 mb-0 flex flex-col items-center justify-center select-none max-w-full px-2">
      {/* Ambient background glow layers matching brand colors */}
      <div className="absolute w-80 h-80 sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] lg:w-[620px] lg:h-[620px] max-w-[98vw] rounded-full bg-gradient-to-tr from-brand-baby-blue/35 via-brand-pink/25 to-brand-peach/30 blur-3xl -z-10 pointer-events-none transform -translate-y-4" />
      <div className="absolute w-60 h-60 sm:w-[360px] sm:h-[360px] md:w-[420px] md:h-[420px] max-w-[90vw] rounded-full bg-brand-pink/20 blur-2xl -z-10 pointer-events-none animate-pulse duration-1000" />

      {/* 3D Interactive Showcase Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: '1200px' }}
        className="relative cursor-pointer px-1 pt-1 pb-0 min-[380px]:px-2 min-[380px]:pt-2 min-[380px]:pb-0 sm:px-3 sm:pt-2 sm:pb-0"
      >
        {/* 3D Cradle Container with Motion */}
        <div
          style={{
            transform: isHovered
              ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03) translateZ(15px)`
              : undefined,
            transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            transformStyle: 'preserve-3d',
          }}
          className={`relative w-[280px] h-[280px] min-[360px]:w-[320px] min-[360px]:h-[320px] sm:w-[420px] sm:h-[420px] md:w-[470px] md:h-[470px] lg:w-[510px] lg:h-[510px] max-w-[94vw] ${
            !isHovered ? 'animate-float-cradle' : ''
          }`}
        >
          {/* Ambient soft glowing halo behind hanging cradle */}
          <div className="absolute inset-2 sm:inset-6 rounded-full bg-gradient-to-tr from-brand-blue/20 via-brand-pink/20 to-brand-baby-blue/25 blur-2xl -z-10 pointer-events-none" />

          {/* 3 Loitering Products Suspended by Strings (Hanging Mobile Effect) */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Product 1: Baby Body Lotion (Hanging on String, Left) */}
            <div className="absolute left-[13%] sm:left-[17%] top-[10%] sm:top-[12%] animate-string-swing-1 pointer-events-auto flex flex-col items-center">
              {/* Hanging String */}
              <div className="w-[1.5px] h-12 sm:h-16 md:h-20 bg-gradient-to-b from-amber-700/50 via-amber-600/35 to-brand-baby-blue/50" />
              {/* Attachment Bead */}
              <div className="w-1.5 h-1.5 rounded-full bg-brand-baby-blue border border-white shadow-xs -mt-0.5" />

              {/* Product Token */}
              <div className="group relative flex flex-col items-center cursor-pointer mt-1">
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-2xl bg-white/95 p-1 shadow-soft-lg border-2 border-white ring-2 ring-brand-baby-blue/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:ring-brand-blue">
                  <img
                    src="/products/baby-body-lotion.jpg"
                    alt="Baby Body Lotion"
                    className="w-full h-full object-cover rounded-xl pointer-events-none"
                    draggable={false}
                  />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-full bg-white/95 border border-brand-baby-blue/35 shadow-xs text-[9px] sm:text-[10px] font-bold text-brand-navy whitespace-nowrap opacity-90 group-hover:opacity-100">
                  Lotion
                </span>
                <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-400 animate-soft-twinkle pointer-events-none" />
              </div>
            </div>

            {/* Product 2: Baby Wash & Shampoo (Hanging on String, Center) */}
            <div className="absolute left-[44%] sm:left-[45%] top-[7%] sm:top-[8%] animate-string-swing-2 pointer-events-auto flex flex-col items-center">
              {/* Hanging String */}
              <div className="w-[1.5px] h-8 sm:h-11 md:h-14 bg-gradient-to-b from-amber-700/50 via-amber-600/35 to-brand-pink/50" />
              {/* Attachment Bead */}
              <div className="w-1.5 h-1.5 rounded-full bg-brand-pink border border-white shadow-xs -mt-0.5" />

              {/* Product Token */}
              <div className="group relative flex flex-col items-center cursor-pointer mt-1">
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-2xl bg-white/95 p-1 shadow-soft-lg border-2 border-white ring-2 ring-brand-pink/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:ring-brand-pink">
                  <img
                    src="/products/baby-wash-shampoo.jpg"
                    alt="Baby Wash & Shampoo"
                    className="w-full h-full object-cover rounded-xl pointer-events-none"
                    draggable={false}
                  />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-full bg-white/95 border border-brand-pink/35 shadow-xs text-[9px] sm:text-[10px] font-bold text-brand-navy whitespace-nowrap opacity-90 group-hover:opacity-100">
                  Shampoo
                </span>
                <Sparkles className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 text-brand-pink animate-soft-twinkle pointer-events-none" />
              </div>
            </div>

            {/* Product 3: Baby Balm (Hanging on String, Right) */}
            <div className="absolute right-[13%] sm:right-[17%] top-[10%] sm:top-[12%] animate-string-swing-3 pointer-events-auto flex flex-col items-center">
              {/* Hanging String */}
              <div className="w-[1.5px] h-12 sm:h-16 md:h-20 bg-gradient-to-b from-amber-700/50 via-amber-600/35 to-brand-peach/50" />
              {/* Attachment Bead */}
              <div className="w-1.5 h-1.5 rounded-full bg-brand-peach border border-white shadow-xs -mt-0.5" />

              {/* Product Token */}
              <div className="group relative flex flex-col items-center cursor-pointer mt-1">
                <div className="w-10 h-10 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-2xl bg-white/95 p-1 shadow-soft-lg border-2 border-white ring-2 ring-brand-peach/50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:ring-brand-peach">
                  <img
                    src="/products/baby-balm.jpg"
                    alt="Baby Balm"
                    className="w-full h-full object-cover rounded-xl pointer-events-none"
                    draggable={false}
                  />
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-full bg-white/95 border border-brand-peach/40 shadow-xs text-[9px] sm:text-[10px] font-bold text-brand-navy whitespace-nowrap opacity-90 group-hover:opacity-100">
                  Balm
                </span>
                <Sparkles className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-amber-400 animate-soft-twinkle pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Hanging Cradle with Playing Baby in Brand UI Pastel Colors */}
          <div className="w-full h-full flex items-center justify-center relative">
            <img
              src="/cradle-baby.png?v=3"
              alt="Happy smiling baby playing in brand pastel hanging cradle"
              className="w-full h-full object-contain pointer-events-none select-none transform hover:scale-[1.01] transition-transform"
              draggable={false}
            />
          </div>
        </div>

        {/* Dynamic 3D Ground Shadow that breathes with float */}
        <div className="mx-auto -mt-3 sm:-mt-4 w-48 min-[360px]:w-56 sm:w-[340px] md:w-[390px] lg:w-[430px] h-3.5 sm:h-4 rounded-full bg-gradient-to-r from-brand-blue/20 via-brand-pink/25 to-brand-baby-blue/20 blur-md animate-pulse-shadow" />
      </div>
    </div>
  );
};

export default HeroCradle3D;
