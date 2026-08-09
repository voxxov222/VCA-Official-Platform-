import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate, useSpring } from 'motion/react';

interface HoloCardImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  showSlabBorder?: boolean;
}

export const HoloCardImage: React.FC<HoloCardImageProps> = ({
  src,
  alt,
  className = "w-24 h-34 object-cover rounded-xl",
  containerClassName = "",
  badge,
  onClick,
  showSlabBorder = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position percentages (0 - 100)
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Smooth springs for 3D tilt rotation
  const rotateXSpring = useSpring(0, { stiffness: 300, damping: 25 });
  const rotateYSpring = useSpring(0, { stiffness: 300, damping: 25 });

  // Sheen opacity spring
  const sheenOpacitySpring = useSpring(0, { stiffness: 200, damping: 20 });

  // Motion templates derived from motion values
  const holoGlow = useMotionTemplate`radial-gradient(
    circle at ${mouseX}% ${mouseY}%,
    rgba(255, 255, 255, 0.75) 0%,
    rgba(34, 211, 238, 0.5) 22%,
    rgba(168, 85, 247, 0.45) 45%,
    rgba(251, 191, 36, 0.35) 65%,
    transparent 85%
  )`;

  const sheenAngle = useMotionTemplate`calc(${mouseX}deg * 3.6)`;
  const linearSheen = useMotionTemplate`linear-gradient(
    ${sheenAngle},
    transparent 20%,
    rgba(255, 255, 255, 0.25) 45%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.25) 55%,
    transparent 80%
  )`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

    mouseX.set(xPct);
    mouseY.set(yPct);

    // Calculate rotation (-12deg to +12deg)
    const rotX = -((yPct - 50) / 50) * 12;
    const rotY = ((xPct - 50) / 50) * 12;

    rotateXSpring.set(rotX);
    rotateYSpring.set(rotY);
    sheenOpacitySpring.set(0.9);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sheenOpacitySpring.set(0.9);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXSpring.set(0);
    rotateYSpring.set(0);
    mouseX.set(50);
    mouseY.set(50);
    sheenOpacitySpring.set(0);
  };

  const safeSrc = src && src.trim() !== '' ? src : 'https://images.pokemontcg.io/base1/4_hires.png';

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: 800,
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
      }}
      className={`relative group cursor-pointer select-none rounded-xl overflow-hidden transition-shadow duration-300 ${
        isHovered ? 'shadow-[0_0_25px_rgba(34,211,238,0.45)]' : 'shadow-md'
      } ${containerClassName}`}
    >
      {/* Base Card Image */}
      <img
        src={safeSrc}
        alt={alt}
        className={`${className} transition-transform duration-300 ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
        loading="lazy"
        referrerPolicy="no-referrer"
      />

      {/* Holographic Radial Rainbow Layer */}
      <motion.div
        style={{
          background: holoGlow,
          opacity: sheenOpacitySpring,
        }}
        className="absolute inset-0 pointer-events-none mix-blend-color-dodge z-10 transition-opacity duration-200"
      />

      {/* Holographic Linear Light Glare Layer */}
      <motion.div
        style={{
          background: linearSheen,
          opacity: sheenOpacitySpring,
        }}
        className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
      />

      {/* Acrylic Glass Reflection Foil Sheen overlay */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-amber-500/10 z-30 mix-blend-soft-light animate-pulse" />
      )}

      {/* Outer Holographic Border Sparkle */}
      {showSlabBorder && (
        <div
          className={`absolute inset-0 rounded-xl border pointer-events-none z-40 transition-colors duration-300 ${
            isHovered ? 'border-cyan-400/80' : 'border-slate-700/50'
          }`}
        />
      )}

      {/* Optional Badge (e.g. Gem Mint tag, grade pill) */}
      {badge && <div className="absolute top-1 right-1 z-50 pointer-events-none">{badge}</div>}
    </motion.div>
  );
};
