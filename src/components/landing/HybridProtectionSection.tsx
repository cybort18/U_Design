import { motion } from 'motion/react';
import { Database, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function HybridProtectionSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24 px-4 relative z-10 bg-transparent">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 md:mb-32 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white tracking-tight">
            The <span className="text-neon-green">Hybrid Protection</span> Framework
          </h2>
          <p className="text-slate-400 text-lg md:text-xl">
            A decentralized architecture combining immutable IPFS storage and Google Gemini AI analysis to protect your digital identity against next-gen plagiarism.
          </p>
        </motion.div>

        {/* 3-Column Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-6 lg:gap-16 relative w-full">
          
          {/* Background connecting line (visible on md+) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10"></div>

          {/* Left Column: IPFS */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[350px] lg:w-[420px] text-center md:text-left flex flex-col items-center md:items-start glass p-8 rounded-3xl border border-white/5 hover:border-neon-green/30 transition-colors bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/5 transition-colors duration-500 rounded-3xl"></div>
            <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="text-neon-green font-mono text-xs uppercase tracking-widest mb-3">
              Decentralized Storage Network
            </h4>
            <h3 className="text-3xl font-bold text-white mb-4">
              IPFS Protocol
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Powered by global nodes to pin your artwork's metadata permanently. Ensuring your proof of ownership is censorship-resistant and immune to single points of failure.
            </p>
          </motion.div>

          {/* Center Column: Animated Node */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
          >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-neon-green/10 blur-[60px] rounded-full"></div>
            
            {/* Outer dotted rotating ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 rounded-full border border-dashed border-white/20"
            ></motion.div>
            
            {/* Middle solid rotating ring (reverse) */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-10 rounded-full border-2 border-transparent border-t-neon-green/50 border-b-neon-green/50"
            ></motion.div>

            {/* Inner pulsing ring */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-16 rounded-full bg-gradient-to-tr from-neon-green/10 to-neon-blue/10 border border-neon-green/30 blur-[2px]"
            ></motion.div>

            {/* Center Logo Core */}
            <div className="relative z-10 w-24 h-24 bg-[#0a0b10] border border-neon-green/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,255,163,0.3)]">
              <img src="/logo-company.svg" alt="U_Design Core" className="w-12 h-12 object-contain" />
            </div>

            {/* Connecting dots to the line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-2 h-2 rounded-full bg-neon-green -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(0,255,163,1)]"></div>
            <div className="hidden md:block absolute top-1/2 right-0 w-2 h-2 rounded-full bg-neon-green translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(0,255,163,1)]"></div>
          </motion.div>

          {/* Right Column: Gemini AI */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-[350px] lg:w-[420px] text-center md:text-left flex flex-col items-center md:items-start glass p-8 rounded-3xl border border-white/5 hover:border-neon-green/30 transition-colors bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/5 transition-colors duration-500 rounded-3xl"></div>
            <div className="w-14 h-14 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="text-neon-green font-mono text-xs uppercase tracking-widest mb-3">
              Artificial Intelligence Scanning
            </h4>
            <h3 className="text-3xl font-bold text-white mb-4">
              Gemini AI Engine
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Leveraging advanced vision models to extract the unique DNA of your art. Defending your style against pixel manipulation, AI scrapers, and generative theft.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
