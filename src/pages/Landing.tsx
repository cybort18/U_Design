import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronDown, Check, X, AlertTriangle, Cpu, Globe, Database, Upload, FileCheck, PenTool, Camera, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

import BackgroundGlow from '../components/BackgroundGlow';

import FaqItem from '../components/landing/FaqItem';
import WhoIsThisForSection from '../components/landing/WhoIsThisForSection';
import TechDemoSection from '../components/landing/TechDemoSection';
import WorkflowDemo from '../components/landing/WorkflowDemo';
import WorkflowPhasesGrid from '../components/landing/WorkflowPhasesGrid';


export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [marqueePosition, setMarqueePosition] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const animateMarquee = () => {
      setMarqueePosition((prev) => (prev - 1) % 1000); // Reset after arbitrary length
      animationFrameId = requestAnimationFrame(animateMarquee);
    };
    animationFrameId = requestAnimationFrame(animateMarquee);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const dummyCIDs = [
    { type: 'SECURED', text: 'CID: QmYwAP...' },
    { type: 'AI VERIFIED', text: 'CID: baFaZx...' },
    { type: 'PROTECTED', text: 'CID: ZkOpQ1...' },
    { type: 'IMMUTABLE', text: 'CID: xpRqW0...' },
    { type: 'SECURED', text: 'CID: OpiEw2...' },
    { type: 'AI VERIFIED', text: 'CID: XlqA2r...' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-white selection:bg-neon-green selection:text-black overflow-hidden font-sans relative">
      <BackgroundGlow />
      {/* 1. The Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-neon-green/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

        {/* Top left Logo */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <img src="/logo-company.svg" alt="Company" className="w-11 h-11 object-contain rounded-xl shadow-[0_0_15px_rgba(0,255,163,0.2)]" />
          <img src="/logo-udesign.svg" alt="U_Design" className="h-6 object-contain" />
        </div>

        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(0,255,163,0.2)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
            Web2.5 Anti-Plagiarism Engine Active
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter leading-tight mb-6">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Immortalize Your
            </motion.span>{' '}
            <br className="hidden sm:block" />
            <motion.span
              className="inline-block text-transparent border-none bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Digital Identity.
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl leading-relaxed mb-10 font-light"
          >
            Secure your original artwork on the blockchain-ready IPFS network, protected by AI Semantic Fingerprinting. <span className="text-neon-green">Zero crypto wallet required.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <Link 
              to="/app" 
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-neon-green uppercase tracking-widest transition-all duration-300 hover:text-black overflow-hidden rounded-md border border-neon-green"
            >
              <div className="absolute inset-0 w-full h-full bg-neon-green transition-all duration-300 -translate-x-[101%] group-hover:translate-x-0 ease-out-expo"></div>
              <span className="relative z-10 flex items-center gap-3">
                Enter the Vault
              </span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 opacity-50" />
        </motion.div>
      </section>

      {/* 2. The "Live Network" Marquee */}
      <section className="py-8 relative z-10 overflow-hidden flex whitespace-nowrap mask-edges">
        <div 
          className="flex gap-12 font-mono text-sm tracking-widest uppercase opacity-70"
        >
          <div className="flex gap-12 animate-marquee">
            {[...dummyCIDs, ...dummyCIDs, ...dummyCIDs, ...dummyCIDs].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-neon-green">[{item.type}]</span>
                <span className="text-slate-400">{item.text}</span>
                <span className="text-white/20 mx-6">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Manifesto */}
      <section className="py-32 md:py-48 px-4 relative z-10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-neon-green/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-medium leading-tight tracking-tight text-white/90 text-center"
          >
            Your art is <span className="text-neon-green">your identity.</span><br/><br/>
            It is not free scraping material. <br className="hidden md:block" />
            It is not for thieves to claim. <br/><br/>
            It is time to take back absolute control of your digital copyright.
          </motion.p>
        </div>
      </section>

      {/* NEW SECTION: Who Is This For */}
      <WhoIsThisForSection />

      {/* NEW SECTION: Tech Demo */}
      <TechDemoSection />

      {/* 4. The Comparison Matrix */}
      <section className="py-24 px-4 relative z-10 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-green/5 blur-[150px] rounded-[100%] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">The Evolution of Protection</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Stop relying on vulnerable servers. Start using immutable infrastructure.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Web2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col border border-white/5 hover:border-red-500/30 hover:shadow-[0_10px_40px_rgba(239,68,68,0.1)] hover:-translate-y-2 transition-all duration-300 ease-out group bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform duration-300">
                <Database className="text-red-500 w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold mb-1">Web2 <span className="text-slate-500 font-normal text-lg">(Traditional)</span></h3>
              <p className="text-slate-400 mb-8 text-sm h-10">Highly vulnerable, centralized servers owned by corporations.</p>
              
              <ul className="space-y-4 flex-grow text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3.5 h-3.5 text-red-500" /></span> 
                  <span className="text-sm">Easily downloaded & stolen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3.5 h-3.5 text-red-500" /></span> 
                  <span className="text-sm">Single point of failure</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5"><X className="w-3.5 h-3.5 text-red-500" /></span> 
                  <span className="text-sm">Platform controls your copyright</span>
                </li>
              </ul>
            </motion.div>

            {/* Web3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col border border-white/5 hover:border-yellow-500/30 hover:shadow-[0_10px_40px_rgba(234,179,8,0.1)] hover:-translate-y-2 transition-all duration-300 ease-out group bg-gradient-to-b from-white/5 to-transparent"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
                <Globe className="text-yellow-500 w-6 h-6" />
              </div>

              <h3 className="text-2xl font-bold mb-1">Web3 <span className="text-slate-500 font-normal text-lg">(Pure NFT)</span></h3>
              <p className="text-slate-400 mb-8 text-sm h-10">High security, but massive friction for non-crypto users.</p>
              
              <ul className="space-y-4 flex-grow text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /></span> 
                  <span className="text-sm">Requires Crypto Wallets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /></span> 
                  <span className="text-sm">High gas fees to mint</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-emerald-500" /></span> 
                  <span className="text-sm">Immutable IPFS storage</span>
                </li>
              </ul>
            </motion.div>

            {/* Web2.5 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-obsidian/60 backdrop-blur-2xl p-8 rounded-3xl relative overflow-hidden flex flex-col border border-neon-green/40 shadow-[0_15px_50px_rgba(0,255,163,0.15)] hover:border-neon-green hover:shadow-[0_20px_60px_rgba(0,255,163,0.3)] hover:-translate-y-2 transition-all duration-500 ease-out group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green/0 via-neon-green to-neon-green/0 shadow-[0_0_15px_rgba(0,255,163,1)]"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-green/20 rounded-full blur-[60px] group-hover:bg-neon-green/30 transition-all duration-500"></div>
              
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-green/20 to-transparent flex items-center justify-center mb-5 border border-neon-green/40 shadow-[0_0_20px_rgba(0,255,163,0.2)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all duration-300">
                <ShieldCheck className="text-neon-green w-7 h-7" />
              </div>

              <h3 className="relative z-10 text-3xl font-bold mb-1 text-white">Web2.5 <span className="text-neon-green font-normal text-xl">(U_Design)</span></h3>
              <p className="relative z-10 text-slate-300 mb-8 text-sm font-medium h-10">Best of both worlds. Zero friction. Absolute security.</p>
              
              <ul className="relative z-10 space-y-4 flex-grow text-white">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-neon-green" /></span> 
                  <span className="text-sm font-medium">100% IPFS Immutable</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-neon-green" /></span> 
                  <span className="text-sm font-medium">Google AI Fingerprinting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-neon-green" /></span> 
                  <span className="text-sm font-medium">Free & No Wallet Required</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Futuristic FAQ (Accordion) */}
      <section className="py-24 px-4 relative z-10 overflow-hidden">
        {/* Abstract glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-green/5 blur-[150px] rounded-[100%] pointer-events-none rotate-12"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FaqItem 
              question="Do I need a MetaMask or Crypto Wallet?" 
              answer="No. U_Design uses Web2.5 architecture. We handle the blockchain-level IPFS distribution seamlessly in the background."
              isOpen={openFaqIndex === 0}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
            />
            <FaqItem 
              question="How does AI Semantic Fingerprinting work?" 
              answer="Google Gemini scans your art style, dominant hex colors, and core objects to create an unforgeable, intelligent metadata layer."
              isOpen={openFaqIndex === 1}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
            />
            <FaqItem 
              question="Is IPFS storage permanent?" 
              answer="Yes, it is anchored to a decentralized global network, making your art immutable and censorship-resistant."
              isOpen={openFaqIndex === 2}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
            />
            <FaqItem 
              question="Can this physically stop people from 'right-clicking' and saving my art?" 
              answer="While no technology can stop a screenshot, U_Design gives you something better: undeniable, immutable proof of original creation. Your timestamped IPFS hash and AI Fingerprint act as absolute evidence to win any DMCA takedown or copyright dispute."
              isOpen={openFaqIndex === 3}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
            />
            <FaqItem 
              question="What if I decide to delete my artwork later?" 
              answer="You maintain absolute control. Inside 'My Vault', you can click 'Revoke Protection' at any time. This executes an 'Unpin' command across the network, removing your file from our secure decentralized nodes."
              isOpen={openFaqIndex === 4}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
            />
            <FaqItem 
              question="How is this different from just using a visual watermark?" 
              answer="Visual watermarks can easily be cropped or erased using AI tools. An IPFS cryptographic hash protects the image at the deepest data level. Even if someone changes 1 pixel to try and claim it, the system will expose it as a fake."
              isOpen={openFaqIndex === 5}
              onToggle={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
            />
          </div>
        </div>
      </section>

      {/* 6. The Final CTA */}
      <section className="py-32 px-4 relative z-10 flex flex-col items-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-neon-green/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, type: "spring" }}
          className="relative perspective-1000 mb-12"
        >
          {/* Certificate Mockup */}
          <div className="w-[300px] sm:w-[500px] h-auto p-1 bg-gradient-to-br from-neon-green/40 to-transparent rounded-2xl transform rotate-12 hover:rotate-6 transition-all duration-500 shadow-[0_0_50px_rgba(0,255,163,0.2)]">
            <div className="bg-obsidian border border-neon-green/20 rounded-xl p-6 h-full w-full">
              <div className="flex justify-between items-start mb-8">
                <img src="/logo-company.svg" alt="Company Logo" className="w-8 h-8 object-contain" />
                <div className="text-right">
                  <div className="text-[10px] text-neon-green font-mono uppercase tracking-widest">Certificate of</div>
                  <div className="text-sm font-bold tracking-tight">AUTHENTICITY</div>
                </div>
              </div>
              <div className="space-y-4 font-mono text-[10px] text-slate-400">
                <div>
                  <div className="uppercase tracking-widest text-[8px] text-slate-500 mb-1">IPFS CID</div>
                  <div className="text-white truncate">QmYwAPJzv5CZsnA625s3Xf2sm5Dya7fWdKBR</div>
                </div>
                <div>
                  <div className="uppercase tracking-widest text-[8px] text-slate-500 mb-1">AI Fingerprint</div>
                  <div className="text-white">Cyberpunk • High Contrast • 1080p</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: false }}
           transition={{ duration: 0.6, delay: 0.3 }}
           className="relative z-10"
        >
          <Link 
            to="/app" 
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-obsidian bg-neon-green uppercase tracking-widest transition-all duration-300 overflow-hidden rounded-md shadow-[0_0_30px_rgba(0,255,163,0.4)] hover:shadow-[0_0_50px_rgba(0,255,163,0.6)] hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-3">
              Protect Your Artwork Now
            </span>
          </Link>
        </motion.div>
      </section>

      {/* 2.5 Tech Stack / Powered By */}
      <section className="py-12 border-t border-white/10 bg-white/5 backdrop-blur-md relative z-10 w-full mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs font-mono tracking-[0.2em] uppercase text-slate-500 mb-8">
            POWERED BY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="group flex items-center justify-center transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full group-hover:bg-neon-green/40 transition-colors duration-300"></div>
                <span className="relative z-10 text-xl font-bold tracking-tighter text-white group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]"><span className="text-neon-green">Google</span> Gemini AI</span>
              </div>
            </div>
            <div className="group transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]">Google Cloud</span>
            </div>
            <div className="group transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]">IPFS</span>
            </div>
            <div className="group transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]">Pinata</span>
            </div>
            <div className="group transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]">React</span>
            </div>
            <div className="group transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-neon-green transition-colors duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global CSS adjustments for Landing */}
      <style>{`
        .mask-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
