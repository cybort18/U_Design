import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronDown, Check, X, AlertTriangle, Cpu, Globe, Database, Upload, FileCheck } from 'lucide-react';
import { cn } from '../lib/utils';

import BackgroundGlow from '../components/BackgroundGlow';

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
      <section className="py-6 border-y border-white/5 bg-black/50 backdrop-blur-md relative z-10 overflow-hidden flex whitespace-nowrap mask-edges">
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
      <section className="py-32 md:py-48 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
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

      {/* NEW SECTION: Tech Demo */}
      <TechDemoSection />

      {/* 4. The Comparison Matrix */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
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
              className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col border border-transparent hover:border-neon-green/50 hover:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <h3 className="text-2xl font-bold mb-2">Web2 <span className="text-slate-400 font-normal text-lg">(Traditional)</span></h3>
              <p className="text-slate-400 mb-8 text-sm">Highly vulnerable, centralized servers.</p>
              <ul className="space-y-4 flex-grow text-slate-300">
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> Easily downloaded & stolen</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> Single point of failure</li>
                <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> Platform controls your copyright</li>
              </ul>
            </motion.div>

            {/* Web3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col border border-transparent hover:border-neon-green/50 hover:shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
              <h3 className="text-2xl font-bold mb-2">Web3 <span className="text-slate-400 font-normal text-lg">(Pure NFT)</span></h3>
              <p className="text-slate-400 mb-8 text-sm">High security, high friction.</p>
              <ul className="space-y-4 flex-grow text-slate-300">
                <li className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" /> Requires Crypto Wallets</li>
                <li className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" /> High gas fees to mint</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Immutable storage</li>
              </ul>
            </motion.div>

            {/* Web2.5 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl relative overflow-hidden flex flex-col border border-neon-green/50 shadow-[0_0_30px_rgba(0,255,163,0.15)] hover:border-neon-green hover:shadow-[0_0_40px_rgba(0,255,163,0.3)] transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-neon-green shadow-[0_0_10px_rgba(0,255,163,0.8)]"></div>
              <h3 className="text-2xl font-bold mb-2 text-white">Web2.5 <span className="text-neon-green font-normal text-lg">(U_Design)</span></h3>
              <p className="text-slate-300 mb-8 text-sm">Best of both worlds. Zero friction.</p>
              <ul className="space-y-4 flex-grow text-white">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" /> 100% IPFS Immutable</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" /> Google AI Fingerprinting</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" /> Free & No Wallet Required</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Futuristic FAQ (Accordion) */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
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

function FaqItem({ question, answer, isOpen, onToggle }: { question: string, answer: string, isOpen: boolean, onToggle: () => void }) {
  return (
    <div 
      className={cn(
        "glass border rounded-xl overflow-hidden transition-all duration-300",
        isOpen 
          ? "border-neon-green/50 shadow-[0_0_15px_rgba(0,255,163,0.2)]" 
          : "border-white/5 hover:border-neon-green/30 hover:shadow-[0_0_10px_rgba(0,255,163,0.1)]"
      )}
    >
      <button 
        onClick={onToggle}
        className="w-full px-6 py-5 text-left flex justify-between items-center bg-transparent cursor-pointer"
      >
        <span className="font-medium text-lg pr-8">{question}</span>
        <ChevronDown className={cn("w-5 h-5 text-neon-green transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
      </button>
      <div 
        className={cn(
          "px-6 text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300",
          isOpen ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {answer}
      </div>
    </div>
  );
}

function TechDemoSection() {
  return (
    <section className="py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Powering the Next Wave of Evolution</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">U_Design's hybrid architecture combines the intelligence of AI with the immutability of decentralized networks.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <WorkflowDemo />
        </motion.div>
        
        <WorkflowPhasesGrid />
      </div>
    </section>
  );
}

function WorkflowDemo() {
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

function WorkflowPhasesGrid() {
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
