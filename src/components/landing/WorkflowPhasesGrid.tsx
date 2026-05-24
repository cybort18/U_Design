import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck, PenTool, Camera, Palette, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function WorkflowPhasesGrid() {
  const phaseDetails = [
    {
      phase: "Phase 1",
      title: "Data Initiation",
      desc: "Securely input and parse metadata from your source files before processing.",
      icon: <Upload className="w-5 h-5" />,
      colSpan: "lg:col-span-2",
      graphic: (
        <div className="relative w-full h-full flex flex-col items-center justify-center pt-4">
           <motion.div variants={{ rest: { y: -10, opacity: 0, transition: { duration: 0.3 } }, hover: { y: 10, opacity: 1, transition: { duration: 1.5, repeat: Infinity } } }} className="w-1 h-4 bg-neon-green rounded-full mb-1 shadow-[0_0_8px_#00FFA3]" />
           <motion.div variants={{ rest: { scale: 0.9, borderColor: 'rgba(255,255,255,0.1)', transition: { duration: 0.3 } }, hover: { scale: 1, borderColor: 'rgba(0,255,163,0.5)', transition: { duration: 0.4 } } }} className="w-16 h-8 border-2 rounded-lg border-t-0 flex items-end justify-center pb-1">
             <div className="w-8 h-1 bg-white/20 rounded-full" />
           </motion.div>
        </div>
      )
    },
    {
      phase: "Phase 2",
      title: "Immutable Storage",
      desc: "Decentralized, censorship-resistant storage ensuring your data is never lost.",
      icon: <Globe className="w-5 h-5" />,
      colSpan: "lg:col-span-2",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center gap-3">
           {[0,1,2].map((n) => (
             <motion.div key={n} variants={{ rest: { scale: 0.5, opacity: 0.5, transition: { duration: 0.3 } }, hover: { scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5], transition: { duration: 2, delay: n * 0.3, repeat: Infinity } } }} className="w-3 h-3 rounded-full border border-neon-green bg-neon-green/20 relative z-10" />
           ))}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
        </div>
      )
    },
    {
      phase: "Phase 3",
      title: "AI Fingerprint",
      desc: "Advanced semantic hashing and feature extraction to detect modifications.",
      icon: <Cpu className="w-5 h-5" />,
      colSpan: "lg:col-span-2",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center">
           <motion.div variants={{ rest: { scale: 0.8, opacity: 0.5, transition: { duration: 0.3 } }, hover: { scale: [0.8, 1.5, 0.8], opacity: [0.5, 0, 0.5], transition: { duration: 1.5, repeat: Infinity } } }} className="absolute w-10 h-10 rounded-lg border border-neon-green" />
           <div className="w-8 h-8 bg-black border border-white/20 rounded-md z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#00FFA3]" />
           </div>
        </div>
      )
    },
    {
      phase: "Phase 4",
      title: "Copyright Seal",
      desc: "Permanent timestamping and cryptographic logging of your asset's identity.",
      icon: <Database className="w-5 h-5" />,
      colSpan: "lg:col-span-3",
      graphic: (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
           {[0,1,2].map((n) => (
             <motion.div key={n} variants={{ rest: { x: 0, transition: { duration: 0.3 } }, hover: { x: n % 2 === 0 ? [0, 4, 0] : [0, -4, 0], transition: { duration: 2, delay: n * 0.2, repeat: Infinity } } }} className="w-16 h-3 border border-white/20 rounded bg-black/50 flex items-center px-1">
                <div className={`w-1 h-1 rounded-full ${n === 1 ? 'bg-neon-green shadow-[0_0_5px_#00FFA3]' : 'bg-white/30'}`} />
             </motion.div>
           ))}
        </div>
      )
    },
    {
      phase: "Phase 5",
      title: "Certificate Render",
      desc: "Cryptographically verifiable certificates ready to be shared or minted.",
      icon: <FileCheck className="w-5 h-5" />,
      colSpan: "lg:col-span-3",
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center">
           {[0,1,2].map((n) => (
             <motion.div key={n} variants={{ rest: { scale: 0, opacity: 0, transition: { duration: 0.3 } }, hover: { scale: [0, 2], opacity: [0.8, 0], transition: { duration: 2, delay: n * 0.4, repeat: Infinity } } }} className="absolute w-8 h-8 rounded-full border border-neon-green" />
           ))}
           <div className="w-6 h-6 bg-black border-2 border-neon-green rounded-full z-10 shadow-[0_0_15px_rgba(0,255,163,0.5)]" />
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mt-6">
      {phaseDetails.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 0.6, delay: idx * 0.15 }}
          className={item.colSpan}
        >
          <motion.div
            initial="rest"
            whileHover="hover"
            className="glass pt-8 px-8 flex flex-col group border border-transparent hover:border-neon-green/30 transition-all duration-500 cursor-pointer bg-black/40 hover:bg-black/60 shadow-none hover:shadow-[0_0_30px_rgba(0,255,163,0.1)] relative overflow-hidden min-h-[280px] rounded-3xl h-full"
          >
          {/* Subtle background glow on hover */}
          <motion.div 
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-3xl rounded-full pointer-events-none"
          />

          <div className="flex items-center gap-4 mb-4 relative z-10">
             <motion.div 
               variants={{
                 rest: { scale: 1, color: '#94a3b8', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
                 hover: { scale: 1.1, color: '#00FFA3', backgroundColor: 'rgba(0,255,163,0.15)', borderColor: 'rgba(0,255,163,0.5)' }
               }}
               transition={{ duration: 0.3 }}
               className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors shrink-0"
             >
               {item.icon}
             </motion.div>
             <div>
               <div className="text-neon-green font-bold text-[10px] uppercase tracking-widest mb-1">{item.phase}</div>
               <h4 className="text-xl font-bold text-white leading-tight">{item.title}</h4>
             </div>
          </div>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10 flex-grow">
            {item.desc}
          </p>

          {/* Abstract visual representation at bottom */}
          <div className="w-[calc(100%+4rem)] h-28 border-t border-white/5 relative flex items-center justify-center mt-auto -mx-8 overflow-hidden pointer-events-none">
             {/* Subtle Grid Background inside graphic area */}
             <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] bg-[size:12px_12px] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
             
             {item.graphic}
          </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}