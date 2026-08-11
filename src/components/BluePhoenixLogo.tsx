import React from 'react';

interface BluePhoenixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showGlow?: boolean;
}

export const BluePhoenixLogo: React.FC<BluePhoenixLogoProps> = ({
  className = '',
  size = 'md',
  showGlow = true,
}) => {
  const dimensions = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    hero: 'w-36 h-36 sm:w-48 sm:h-48',
  }[size];

  return (
    <div className={`relative flex items-center justify-center inline-block ${dimensions} ${className}`}>
      {/* Outer Blue Sapphire Flame Aura Glow */}
      {showGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 blur-xl opacity-60 animate-pulse pointer-events-none" />
      )}

      {/* Blue Phoenix Vector Graphic */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(34,211,238,0.85)] transition-transform duration-500 hover:scale-105"
      >
        <defs>
          {/* Blue Sapphire Flame Gradients */}
          <linearGradient id="phoenixBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="phoenixWingGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="phoenixWingGradRight" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="phoenixFlameFeather" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="60%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="crestGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <filter id="sapphireGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Hexagon Ring */}
        <path
          d="M100 10 L175 50 L175 150 L100 190 L25 150 L25 50 Z"
          stroke="url(#phoenixWingGradLeft)"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="opacity-40 animate-spin-slow"
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Phoenix Tail Sapphire Feathers */}
        <g opacity="0.9">
          <path d="M100 120 Q80 160 60 185 Q90 170 100 135 Z" fill="url(#phoenixFlameFeather)" />
          <path d="M100 120 Q100 175 100 195 Q100 175 100 135 Z" fill="url(#phoenixWingGradLeft)" />
          <path d="M100 120 Q120 160 140 185 Q110 170 100 135 Z" fill="url(#phoenixFlameFeather)" />
        </g>

        {/* Left Wing (Rising Flames) */}
        <path
          d="M100 100 C70 90 40 60 20 25 C30 50 45 75 60 85 C40 80 25 65 15 50 C25 75 45 95 65 105 C45 105 30 100 20 90 C35 110 55 118 75 120 C85 121 95 115 100 100 Z"
          fill="url(#phoenixWingGradLeft)"
          filter="url(#sapphireGlow)"
        />

        {/* Right Wing (Rising Flames) */}
        <path
          d="M100 100 C130 90 160 60 180 25 C170 50 155 75 140 85 C160 80 175 65 185 50 C175 75 155 95 135 105 C155 105 170 100 180 90 C165 110 145 118 125 120 C115 121 105 115 100 100 Z"
          fill="url(#phoenixWingGradRight)"
          filter="url(#sapphireGlow)"
        />

        {/* Phoenix Chest Body & Sapphire Diamond Core */}
        <path
          d="M100 50 C85 70 80 95 90 125 L100 140 L110 125 C120 95 115 70 100 50 Z"
          fill="url(#phoenixBodyGrad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />

        {/* Phoenix Head & Beak Facing Forward Upward */}
        <path d="M100 45 C92 40 90 30 94 22 C97 16 100 12 100 12 C100 12 103 16 106 22 C110 30 108 40 100 45 Z" fill="#67e8f9" />
        <polygon points="100,10 96,20 104,20" fill="url(#crestGlow)" />

        {/* Head Crest Sapphire Flame Feathers */}
        <path d="M96 20 C90 10 80 5 70 8 C80 14 88 18 94 22 Z" fill="#38bdf8" />
        <path d="M104 20 C110 10 120 5 130 8 C120 14 112 18 106 22 Z" fill="#38bdf8" />

        {/* Eye Core (Glowing Cyan) */}
        <circle cx="100" cy="28" r="2.5" fill="#ffffff" className="animate-pulse" />

        {/* Inner Holographic VCA Symbol */}
        <path
          d="M100 70 L112 90 L100 110 L88 90 Z"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="2"
          className="animate-pulse"
        />
        <circle cx="100" cy="90" r="3" fill="#38bdf8" />
      </svg>
    </div>
  );
};
