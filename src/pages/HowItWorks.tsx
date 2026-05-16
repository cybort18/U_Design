import { motion } from 'motion/react';
import { Upload, Globe, Cpu, Database, FileCheck } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Data Initiation',
      desc: 'When you drop your artwork, our system initiates a secure session. It parses local metadata and prepares the raw file for distributed processing, ensuring absolute privacy from the first byte.',
      gradient: 'from-blue-500/20 to-transparent',
      iconColor: 'text-blue-400',
      borderColor: 'group-hover:border-blue-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      Icon: Upload
    },
    {
      step: '02',
      title: 'Immutable Storage',
      desc: 'We store your original file directly on the InterPlanetary File System (IPFS) via Pinata. Your image is mathematically hashed into a CID (Content Identifier) that acts as a permanent, unbreakable link.',
      gradient: 'from-emerald-500/20 to-transparent',
      iconColor: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      Icon: Globe
    },
    {
      step: '03',
      title: 'AI Fingerprinting',
      desc: 'Our AI Engine (Google Gemini) deeply analyzes the image. It extracts the art style, dominant colors, and structural composition-creating a unique "Semantic Fingerprint" to detect future plagiarism.',
      gradient: 'from-purple-500/20 to-transparent',
      iconColor: 'text-purple-400',
      borderColor: 'group-hover:border-purple-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      Icon: Cpu
    },
    {
      step: '04',
      title: 'Copyright Seal',
      desc: 'The IPFS CID and AI Fingerprint are permanently logged into a Firestore cryptographic ledger. This creates an immutable timestamped record establishing your absolute priority of possession.',
      gradient: 'from-rose-500/20 to-transparent',
      iconColor: 'text-rose-400',
      borderColor: 'group-hover:border-rose-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
      Icon: Database
    },
    {
      step: '05',
      title: 'Certificate Render',
      desc: 'You immediately receive a digital Certificate of Authenticity. This document cryptographically binds all metadata together, providing irrefutable mathematical proof of your copyright.',
      gradient: 'from-amber-500/20 to-transparent',
      iconColor: 'text-amber-400',
      borderColor: 'group-hover:border-amber-500/50',
      glow: 'group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]',
      Icon: FileCheck
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 mb-24 relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-neon-blue/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center justify-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
          <Cpu className="w-4 h-4 text-neon-blue" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-300">System Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight mb-6">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green">U_Design</span> Works
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          We combine cutting-edge AI visual analysis with immutable decentralized storage to protect your digital offspring. No crypto wallet required.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-6 lg:gap-8 relative"
      >
        {steps.map((item, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className={`glass-card p-8 group relative overflow-hidden transition-all duration-500 border border-white/5 ${item.borderColor} ${item.glow} ${i === 4 ? 'md:col-span-2' : ''}`}
          >
            {/* Ambient Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-black/40 border border-white/10 ${item.iconColor} shadow-inner`}>
                  <item.Icon className="w-8 h-8" />
                </div>
                <div className={`text-6xl font-display font-black opacity-10 group-hover:opacity-30 transition-opacity duration-500 ${item.iconColor} tracking-tighter`}>
                  {item.step}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Connection elements section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-16 glass-card p-10 border border-white/10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/10 blur-[80px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <Database className="w-12 h-12 text-slate-300 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-display font-bold text-white mb-4">Securing the Creator Economy</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Our hybrid Web2.5 infrastructure gives you the cryptographic security of decentralized IPFS networks, paired with advanced AI image analysis-without the complexity of managing blockchain keys.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="px-5 py-2.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-neon-blue uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse mr-2"></span> System Active
            </span>
            <span className="px-5 py-2.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-neon-green uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse mr-2"></span> Nodes Synced
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
