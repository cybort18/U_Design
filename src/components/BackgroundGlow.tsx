import { motion } from 'motion/react';

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_40%,transparent_100%)]" />
      
      {/* Top Left Neon Glow - Optimized without CSS blur */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[300px] -left-[300px] w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,255,163,0.15)_0%,transparent_60%)] rounded-full will-change-transform"
      />
      
      {/* Bottom Right Emerald Glow - Optimized without CSS blur */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-[400px] -right-[200px] w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_60%)] rounded-full will-change-transform"
      />

      {/* Center Subtle Aurora Ribbon - Optimized without CSS blur */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,163,0.08)_0%,transparent_70%)] rounded-full will-change-transform"
      />
    </div>
  );
}
