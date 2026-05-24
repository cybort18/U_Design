import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck, PenTool, Camera, Palette, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function WorkflowDemo() {
  const steps = [
    { title: "Data Initiation", desc: "Drop & Read", icon: <Upload className="w-5 h-5" /> },
    { title: "Immutable Storage", desc: "IPFS & Pinata", icon: <Globe className="w-5 h-5" /> },
    { title: "AI Fingerprint", desc: "Google Gemini", icon: <Cpu className="w-5 h-5" /> },
    { title: "Copyright Seal", desc: "Firestore Ledger", icon: <Database className="w-5 h-5" /> },
    { title: "Certificate Render", desc: "Verification", icon: <FileCheck className="w-5 h-5" /> },
  ];

  // Helper for synchronized looping keyframes (5s total duration)
  const DURATION = 5.0;
  const getTimes = (i: number) => {
    const onStart = (i * 0.6) / DURATION;
    const onPeak = onStart + 0.08;
    const offStart = onPeak + 0.28;
    const offEnd = offStart + 0.08;
    return [0, onStart, onPeak, offStart, offEnd, 1];
  };

  return (
    <motion.div 
      initial="rest" 
      whileHover="hover" 
      className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col group border border-transparent hover:border-neon-green/30 transition-all duration-500 cursor-pointer bg-black/40 hover:bg-black/60 shadow-none hover:shadow-[0_0_40px_rgba(0,255,163,0.15)] min-h-[400px]"
    >
      <div className="relative z-20 mb-16 md:mb-24">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neon-green group-hover:scale-110 group-hover:bg-neon-green/10 transition-all duration-300">
            <img src="/logo-udesign.svg" alt="U_Design" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-3xl font-bold text-white">The Protection Workflow</h3>
        </div>
        <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
          From the moment you upload your artwork, it passes through 5 stages of cryptographic and semantic processing to ensure absolute, immutable copyright protection.
        </p>
      </div>

      {/* Interactive Visual Network */}
      <div className="relative w-full h-[150px] flex items-center justify-between px-4 sm:px-12 mt-auto">
         {/* Main Connecting Line (Idle) */}
         <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -translate-y-1/2" />
         
         {/* Highlighted Connecting Line (Animates on hover) */}
         <motion.div 
            variants={{ 
              rest: { scaleX: 0, opacity: 0, transition: { duration: 0.3 } }, 
              hover: { 
                scaleX: [0, 1, 1, 1, 0],
                opacity: [0, 1, 1, 0, 0],
                transition: { duration: DURATION, times: [0, 0.48, 0.92, 0.98, 1], ease: "easeInOut", repeat: Infinity }
              } 
            }}
            className="absolute top-1/2 left-8 right-8 h-0.5 bg-neon-green -translate-y-1/2 origin-left"
         />
         
         {/* Nodes */}
         {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center group/node">
               {/* Label above */}
               <motion.div 
                 variants={{ 
                   rest: { opacity: 0, y: 10, transition: { duration: 0.3 } }, 
                   hover: { 
                     opacity: [0, 0, 1, 1, 0, 0], 
                     y: [10, 10, 0, 0, 10, 10],
                     transition: { duration: DURATION, times: getTimes(i), repeat: Infinity }
                   } 
                 }}
                 className="absolute -top-16 w-32 text-center pointer-events-none"
               >
                 <div className="text-neon-green font-bold text-[10px] uppercase tracking-widest mb-1">Phase {i + 1}</div>
                 <div className="text-white text-xs font-mono leading-tight">{step.desc}</div>
               </motion.div>

               {/* Diamond Node */}
               <motion.div 
                 variants={{ 
                   rest: { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 0 0px rgba(0,0,0,0)', transition: { duration: 0.3 } }, 
                   hover: { 
                     scale: [1, 1, 1.2, 1.2, 1, 1], 
                     backgroundColor: [
                       'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)', 
                       'rgba(0,255,163,0.15)', 'rgba(0,255,163,0.15)', 
                       'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)'
                     ],
                     borderColor: [
                       'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 
                       'rgba(0,255,163,0.5)', 'rgba(0,255,163,0.5)', 
                       'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'
                     ],
                     boxShadow: [
                       '0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)', 
                       '0 0 20px rgba(0,255,163,0.4)', '0 0 20px rgba(0,255,163,0.4)', 
                       '0 0 0px rgba(0,0,0,0)', '0 0 0px rgba(0,0,0,0)'
                     ],
                     transition: { duration: DURATION, times: getTimes(i), repeat: Infinity }
                   } 
                 }}
                 className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl rotate-45 backdrop-blur-md flex items-center justify-center border-2"
               >
                  <motion.div 
                    variants={{ 
                      rest: { rotate: -45, color: '#94a3b8', transition: { duration: 0.3 } }, 
                      hover: { 
                        rotate: -45, 
                        color: ['#94a3b8', '#94a3b8', '#00FFA3', '#00FFA3', '#94a3b8', '#94a3b8'],
                        transition: { duration: DURATION, times: getTimes(i), repeat: Infinity }
                      } 
                    }}
                  >
                     {step.icon}
                  </motion.div>
               </motion.div>

               {/* Glowing dot in center */}
               <motion.div 
                 variants={{ 
                   rest: { scale: 0, opacity: 0, transition: { duration: 0.3 } }, 
                   hover: { 
                     scale: [0, 0, 1, 1, 0, 0], 
                     opacity: [0, 0, 1, 1, 0, 0],
                     transition: { duration: DURATION, times: getTimes(i), repeat: Infinity }
                   } 
                 }}
                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
               />
            </div>
         ))}

         {/* Data particle (Shoots across the line) */}
         <motion.div 
            variants={{ 
              rest: { left: "0%", opacity: 0, transition: { duration: 0.3 } }, 
              hover: { 
                left: ["0%", "100%", "100%", "0%"], 
                opacity: [0, 1, 0, 0],
                transition: { duration: DURATION, times: [0, 0.48, 0.58, 1], ease: "easeInOut", repeat: Infinity }
              } 
            }}
            className="absolute top-1/2 -translate-y-1/2 w-12 h-1 bg-white blur-[2px] rounded-full z-20 shadow-[0_0_15px_white]"
         />
      </div>
    </motion.div>
  );
}