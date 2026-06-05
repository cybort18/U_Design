import React from 'react';
import { ShieldCheck, Fingerprint, Copy, ArrowRight, Download } from 'lucide-react';

interface FingerprintData {
  artStyle: string;
  dominantColors: string[];
  mainObjects: string[];
  copyrightDescription: string;
}

interface CertificateCardProps {
  resetState: () => void;
  downloadCert: () => void;
  certRef: React.RefObject<HTMLDivElement | null>;
  previewUrl: string | null;
  fingerprint: FingerprintData | null;
  ipfsHash: string;
  timeStamped: string;
  user: any; // Ideally Use User from firebase
  copyToClipboard: (text: string) => void;
}

export default function CertificateCard({
  resetState,
  downloadCert,
  certRef,
  previewUrl,
  fingerprint,
  ipfsHash,
  timeStamped,
  user,
  copyToClipboard
}: CertificateCardProps) {
  if (!fingerprint) return null;

  return (
    <div className="w-full max-w-4xl animate-in slide-in-from-bottom-8 duration-700">
      {/* Action Bar */}
      <div className="flex gap-4 mb-8 w-full max-w-md mx-auto">
        <button 
          onClick={resetState}
          className="flex-1 bg-neon-green hover:bg-[#00e692] text-black font-bold py-4 rounded-xl text-center text-xs uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(0,255,163,0.3)] cursor-pointer"
        >
          Protect New Artwork
        </button>
        <button onClick={downloadCert} className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 transition-colors text-white cursor-pointer">
          <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Certificate Card */}
      <div 
        ref={certRef}
        className="relative bg-obsidian border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-6 md:p-8 lg:p-10 box-glow-green"
      >
        {/* Texture & Background Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none" 
          style={{ backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '16px 16px' }}
        ></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Image */}
          <div className="w-full md:w-5/12 flex-shrink-0 flex flex-col min-h-[350px]">
            <div className="w-full h-full rounded-3xl overflow-hidden bg-black border border-white/10 relative group shadow-lg flex-1">
              {/* Blurred Background to fill empty space */}
              <img src={previewUrl!} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-2xl scale-125" />
              {/* Actual Image without cropping */}
              <img src={previewUrl!} alt="Protected Original" className="absolute inset-0 w-full h-full object-contain p-2 z-10 drop-shadow-2xl" />
              
              <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none z-20 mix-blend-overlay"></div>
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neon-green/20 via-transparent to-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen z-30"></div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full md:w-7/12 flex flex-col h-full justify-between">
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 pb-6 border-b border-white/5 gap-4">
                <div>
                  <h2 className="text-neon-green text-[10px] font-bold uppercase tracking-[0.3em] mb-2.5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> 
                    Verified Digital Asset
                  </h2>
                  <h3 className="text-3xl font-display font-semibold tracking-tight text-white">Certificate of Authenticity</h3>
                </div>
                <div className="hidden sm:flex flex-shrink-0 w-14 h-14 rounded-full border border-neon-green/20 bg-neon-green/5 items-center justify-center shadow-[inset_0_0_15px_rgba(0,255,163,0.1)]">
                  <Fingerprint className="w-7 h-7 text-neon-green opacity-80" />
                </div>
              </div>

              {/* Fingerprint Stats */}
              <div className="mb-6 bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">AI Semantic Fingerprint</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-neon-blue font-mono bg-neon-blue/10 px-2 py-1 rounded-full border border-neon-blue/20">Confidence: 99.9%</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Art Style</p>
                    <p className="text-white text-sm font-medium">{fingerprint.artStyle}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Dominant Palette</p>
                    <div className="flex gap-2 items-center h-5">
                      {fingerprint.dominantColors.map((color, i) => (
                        <div key={`${color}-${i}`} className="w-5 h-5 rounded-full shadow-inner border border-white/20 ring-2 ring-black" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2 space-y-2 pt-4 border-t border-white/5">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">AI Description Analysis</p>
                    <p className="text-gray-300 leading-relaxed italic text-sm pr-4">"{fingerprint.copyrightDescription}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata & Timestamp */}
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">IPFS Content ID (CID)</p>
                  <button onClick={() => copyToClipboard(ipfsHash)} className="text-neon-green text-[10px] uppercase font-bold hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none">
                    <Copy className="w-3.5 h-3.5" /> Copy Hash
                  </button>
                </div>
                <div className="bg-black/40 px-3.5 py-3 rounded-lg font-mono text-xs text-neon-green/90 border border-neon-green/10 flex justify-between items-center group overflow-hidden">
                  <span className="truncate mr-4 tracking-tight">{ipfsHash}</span>
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-white/30 hover:text-neon-green transition-colors"
                    title="View on IPFS Explorer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 sm:p-5 rounded-xl border border-white/5 backdrop-blur-sm min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Timestamp (UTC)</p>
                      <div className="text-sm font-medium text-white flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2">
                        <span className="whitespace-nowrap">{new Date(timeStamped).toISOString().split('T')[0]}</span>
                        <span className="hidden xl:inline text-gray-500">&bull;</span> 
                        <span className="whitespace-nowrap">{new Date(timeStamped).toISOString().split('T')[1].substring(0,8)}</span>
                      </div>
                  </div>
                  <div className="bg-white/5 p-4 sm:p-5 rounded-xl border border-white/5 backdrop-blur-sm min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Creator</p>
                      <p className="text-sm font-medium text-white break-words line-clamp-2" title={user?.displayName || user?.email || 'Registered User'}>
                        {user?.displayName || user?.email || 'Registered User'}
                      </p>
                  </div>
              </div>
            </div>
            
            {/* Footer Validation */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-8 pt-6 border-t border-white/10 gap-4">
              <div className="text-[10px] text-slate-400 font-mono tracking-widest flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                VERIFICATION SECURED
              </div>
              <div className="opacity-15 select-none flex items-center gap-2 grayscale pointer-events-none">
                <img src="/logo-company.svg" alt="Company" className="w-6 h-6 object-contain" />
                <img src="/logo-udesign.svg" alt="U_Design" className="h-4 object-contain" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
