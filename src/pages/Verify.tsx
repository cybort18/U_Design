import { useState } from 'react';
import { ShieldCheck, Loader2, XCircle, Search, RefreshCcw, ArrowRight, CheckCircle, Fingerprint } from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthProvider';

export default function VerifyPage() {
  const { user } = useAuthContext();
  const [cid, setCid] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'found_local' | 'found_remote' | 'error'>('idle');
  const [verifyStep, setVerifyStep] = useState<'local' | 'remote' | null>(null);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async () => {
    if (!cid.trim()) return;
    setStatus('verifying');
    setVerifyStep('local');
    setErrorMsg('');
    setResult(null);

    try {
      // Small simulated delay for the "scanning" UI effect
      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. Check global vault via API
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:3001' : '');
      
      try {
        const verifyResponse = await fetch(`${apiUrl}/api/verify/${cid.trim()}`);
        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          // Check if the current user is the owner
          const isOwner = user && user.uid === data.ownerId;
          
          setResult({
            ...data,
            isOwner
          });
          setStatus('found_local');
          setVerifyStep(null);
          return;
        }
      } catch (err) {
        console.warn("Global vault check failed or not found, falling back to IPFS gateway");
      }

      setVerifyStep('remote');
      // Simulated delay for UI effect to feel the step transition
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2. If not local, try fetching from IPFS Gateway
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid.trim()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
          setResult({
            ipfsHash: cid.trim(),
            imageUrl: `https://gateway.pinata.cloud/ipfs/${cid.trim()}`
          });
        } else {
          setResult({
             ipfsHash: cid.trim(),
             isNotImage: true
          });
        }
        setStatus('found_remote');
        setVerifyStep(null);
      } else {
        throw new Error('CID not found on the IPFS network.');
      }
    } catch (err: any) {
      setErrorMsg(
        err.name === 'AbortError' 
          ? 'Verification timed out. The IPFS network gateway might be slow.' 
          : (err.message || 'Verification failed. Invalid or unreachable CID.')
      );
      setStatus('error');
      setVerifyStep(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-8 md:mt-12 mb-24">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 mb-4 border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Search className="w-8 h-8 text-neon-blue animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Authenticity Verification</h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
          Enter an IPFS CID to verify its original creator, registration timestamp, and AI Fingerprint data across the decentralized network.
        </p>
      </div>
      
      {/* Search Input Card */}
      <div className="glass-card p-6 md:p-10 max-w-2xl mx-auto relative overflow-hidden group border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-widest">IPFS Hash (CID)</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={cid}
              onChange={(e) => setCid(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. QmXa..." 
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all font-mono text-sm"
              disabled={status === 'verifying'}
            />
            <button 
              onClick={handleVerify}
              disabled={!cid.trim() || status === 'verifying'}
              className="px-8 py-3 bg-neon-blue hover:bg-[#60A5FA] text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] cursor-pointer"
            >
              {status === 'verifying' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="max-w-3xl mx-auto">
        {status === 'verifying' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 mb-6">
              <div className="relative">
                <Search className="w-12 h-12 text-neon-blue animate-pulse" />
                <div className="absolute inset-0 rounded-full border-t-2 border-neon-blue animate-spin"></div>
              </div>
              <p className="text-neon-blue font-mono text-sm uppercase tracking-wider animate-pulse">Running Verification Protocol</p>
            </div>

            <div className="w-full space-y-3 max-w-md mx-auto">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center shadow-inner relative overflow-hidden"
              >
                 <div className={`w-3 h-3 rounded-full border ${verifyStep === 'local' ? 'border-neon-blue' : 'border-slate-600'} flex items-center justify-center mr-3`}>
                   {verifyStep === 'local' ? <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping"></div> : <CheckCircle className="w-3 h-3 text-neon-green" />}
                 </div>
                 <p className={`text-sm tracking-tight font-mono ${verifyStep === 'local' ? 'text-slate-300' : 'text-slate-500'}`}>Scanning local secure vault...</p>
              </motion.div>

              {verifyStep === 'remote' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center shadow-inner relative overflow-hidden mt-3"
                >
                   <div className="w-3 h-3 rounded-full border border-purple-500 flex items-center justify-center mr-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></div>
                   </div>
                   <p className="text-sm text-slate-300 font-mono tracking-tight text-glow-purple">Querying IPFS global ledger...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-rose-500/30 text-center"
          >
            <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Record Not Found</h3>
            <p className="text-slate-400 font-mono text-sm">{errorMsg}</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors inline-flex items-center text-sm"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Try Another CID
            </button>
          </motion.div>
        )}

        {status === 'found_remote' && result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
              <CheckCircle className="w-8 h-8 text-neon-blue" />
              <div>
                <h3 className="text-xl font-display font-bold text-white">Verified on IPFS</h3>
                <p className="text-slate-400 text-sm">This file exists immutably on the decentralized network.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {result.imageUrl && !result.isNotImage ? (
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                  <img src={result.imageUrl} alt="Recovered from IPFS" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                    <span className="text-[10px] text-white font-mono uppercase">From IPFS Node</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/5] rounded-xl bg-black/50 border border-white/10 flex items-center justify-center p-6 text-center">
                  <p className="text-slate-500 text-sm">File exists but is not an image, or image preview could not be generated.</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Content Identifier</p>
                  <div className="bg-black/50 border border-neon-blue/20 rounded-lg p-3 font-mono text-xs text-neon-blue break-all">
                    {result.ipfsHash}
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <ShieldCheck className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    This file is confirmed to be hosted on IPFS. However, since it was not found in your local U_Design vault, we cannot display its localized AI Semantic Fingerprint or original creator metadata here.
                  </p>
                </div>

                <a 
                  href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors flex items-center justify-center text-sm font-medium"
                >
                  View Raw File on IPFS <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'found_local' && result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 lg:p-12 relative overflow-hidden box-glow-green"
          >
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-5/12">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-white/10 relative group">
                  <img 
                    src={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`} 
                    alt="Verified Original" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('placehold.co')) {
                        target.src = 'https://placehold.co/400x400/0b0c10/00ffa3?text=IPFS+Asset';
                      }
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-neon-green/40 flex items-center gap-2">
                     <CheckCircle className="w-3.5 h-3.5 text-neon-green" />
                     <span className="text-neon-green text-[10px] font-bold uppercase tracking-tighter">
                       {result.isOwner ? 'Ownership Confirmed (You)' : 'Verified Creation'}
                     </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-7/12 flex flex-col">
                <div className="flex items-center space-x-3 mb-6 border-b border-white/10 pb-6">
                  <ShieldCheck className="w-8 h-8 text-neon-green" />
                  <div>
                    <h2 className="text-neon-green text-xs font-bold uppercase tracking-[0.3em] mb-1">
                       {result.isOwner ? 'Authenticity Verified' : 'Protected by Another Creator'}
                    </h2>
                    <h3 className="text-2xl font-semibold tracking-tight text-white mb-1">U_Design Digital Certificate</h3>
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <Fingerprint className="w-4 h-4 text-neon-blue" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">AI Semantic Fingerprint</span>
                    </div>
                    {result.fingerprint && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs relative z-10">
                        <div>
                          <p className="text-gray-500 mb-1">Art Style</p>
                          <p className="text-white font-medium">{result.fingerprint.artStyle}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Dominant Palette</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {result.fingerprint.dominantColors.map((color: string) => (
                              <div key={color} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }} title={color}></div>
                            ))}
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-gray-500 mb-1">AI Description</p>
                          <p className="text-white/80 leading-relaxed italic">"{result.fingerprint.copyrightDescription}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Content ID (CID)</p>
                      <div className="bg-black/40 border border-neon-green/10 rounded-lg p-2 font-mono text-[10px] text-neon-green break-all">
                        {result.ipfsHash}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Registration Timestamp</p>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs">
                        {new Date(result.timestamp).toUTCString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <a 
                      href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center py-3 bg-neon-green hover:bg-[#00e692] text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(0,255,163,0.3)]"
                    >
                      View Raw Asset on IPFS
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
