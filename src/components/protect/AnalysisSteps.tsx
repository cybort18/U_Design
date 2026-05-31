import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

interface AnalysisStepsProps {
  processStep: 'uploading' | 'checking' | 'analyzing';
  previewUrl: string | null;
}

export default function AnalysisSteps({ processStep, previewUrl }: AnalysisStepsProps) {
  return (
    <div className="w-full max-w-xl mx-auto glass-card p-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
      <div className="relative w-40 h-40 mb-8 rounded-2xl overflow-hidden border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-t from-neon-green/20 to-transparent mix-blend-overlay z-10"></div>
        
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1 bg-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
          animate={{ y: [0, 160, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        
        {previewUrl && (
          <motion.img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover transition-all"
            animate={{ filter: ['grayscale(100%) blur(2px)', 'grayscale(50%) blur(0px)', 'grayscale(100%) blur(2px)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green z-20"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green z-20"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green z-20"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green z-20"></div>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h2 className="text-2xl font-display font-medium text-white tracking-widest uppercase">Protocol Engaged</h2>
        <p className="text-neon-blue text-xs font-mono mt-2 animate-pulse">Running advanced diagnostic algorithms...</p>
      </motion.div>
      
      <div className="w-full space-y-4">
        {(processStep === 'uploading' || processStep === 'checking' || processStep === 'analyzing') && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden">
            {processStep === 'uploading' && (
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
            )}
            <div className={`w-3 h-3 rounded-full border ${processStep === 'uploading' ? 'border-neon-green' : 'border-slate-600'} flex items-center justify-center mr-4`}>
              {processStep === 'uploading' && <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping"></div>}
              {processStep !== 'uploading' && <CheckCircle className="w-3 h-3 text-neon-green" />}
            </div>
            <p className={`text-sm font-mono tracking-tight whitespace-nowrap overflow-hidden ${processStep === 'uploading' ? 'text-slate-300' : 'text-slate-500'}`}>Securing image & hashing to IPFS...</p>
          </motion.div>
        )}

        {(processStep === 'checking' || processStep === 'analyzing') && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden">
            {processStep === 'checking' && (
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
            )}
            <div className={`w-3 h-3 rounded-full border ${processStep === 'checking' ? 'border-neon-blue' : 'border-slate-600'} flex items-center justify-center mr-4`}>
              {processStep === 'checking' && <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping"></div>}
              {processStep !== 'checking' && <CheckCircle className="w-3 h-3 text-neon-blue" />}
            </div>
            <p className={`text-sm font-mono tracking-tight whitespace-nowrap overflow-hidden ${processStep === 'checking' ? 'text-slate-300' : 'text-slate-500'}`}>Checking global ledger for duplicates...</p>
          </motion.div>
        )}

        {(processStep === 'analyzing') && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            <div className="w-3 h-3 rounded-full border border-purple-500 flex items-center justify-center mr-4">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></div>
            </div>
            <p className="text-sm text-slate-300 font-mono tracking-tight whitespace-nowrap overflow-hidden text-glow-purple">Analyzing Semantic Fingerprint with AI...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
