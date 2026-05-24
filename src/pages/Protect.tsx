import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { createPortal } from 'react-dom';
import { UploadCloud, CheckCircle, ShieldAlert, Copy, Download, RefreshCcw, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthContext } from '../contexts/AuthProvider';
import LoginPrompt from '../components/LoginPrompt';
import CertificateCard from '../components/protect/CertificateCard';

type ProcessState = 'idle' | 'processing' | 'success' | 'error' | 'duplicate';

interface FingerprintData {
  artStyle: string;
  dominantColors: string[];
  mainObjects: string[];
  copyrightDescription: string;
}

export default function ProtectPage() {
  const { user } = useAuthContext();
  const [processState, setProcessState] = useState<ProcessState>('idle');
  const [processStep, setProcessStep] = useState<'uploading' | 'checking' | 'analyzing'>('uploading');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [duplicateHash, setDuplicateHash] = useState<string>('');
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);
  const [timeStamped, setTimeStamped] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const certRef = useRef<HTMLDivElement>(null);
  const processingRef = useRef(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., data:image/png;base64,)
          const b64 = reader.result.split(',')[1];
          resolve(b64);
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const processArtwork = async (selectedFile: File) => {
    if (processingRef.current) return;
    processingRef.current = true;
    
    setProcessState('processing');
    setProcessStep('uploading');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setErrorMsg('');

    // Simulate UI steps while backend processes
    const stepTimers = [
      setTimeout(() => { setProcessStep('checking'); }, 1500),
      setTimeout(() => { setProcessStep('analyzing'); }, 3000)
    ];

    try {
      // Get auth token if user is signed in
      const token = await user?.getIdToken();
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user?.uid || '');

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/protect`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          throw { type: 'DUPLICATE', hash: errData.hash };
        }
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Clear timers and ensure UI catches up to success
      stepTimers.forEach(clearTimeout);
      setProcessStep('analyzing');
      
      setIpfsHash(data.ipfsHash);
      setFingerprint(data.fingerprint);
      setTimeStamped(data.timestamp);

      setProcessState('success');
    } catch (err: any) {
      stepTimers.forEach(clearTimeout);
      
      if (err.type === 'DUPLICATE') {
        setDuplicateHash(err.hash);
        setProcessState('duplicate');
      } else {
        console.error('Processing failed:', err);
        setErrorMsg(err.message || 'An unknown error occurred during processing.');
        setProcessState('error');
      }
    } finally {
      processingRef.current = false;
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processArtwork(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.webp'],
    },
    maxFiles: 1
  } as any);

  const downloadCert = async () => {
    if (!certRef.current) return;
    try {
      const dataUrl = await toPng(certRef.current, {
        backgroundColor: '#0b0c10', // match obsidian
        pixelRatio: 2,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `U_Design_Cert_${ipfsHash?.substring(0, 8)}.png`;
      a.click();
    } catch (e) {
      console.error('Failed to download cert', e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple visual feedback could be added here
  };

  const resetState = () => {
    if (processState === 'success') {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
    processingRef.current = false;
    setProcessState('idle');
    setFile(null);
    setPreviewUrl(null);
    setIpfsHash('');
    setFingerprint(null);
    setDuplicateHash('');
  };

  if (!user) {
    return <LoginPrompt title="Authentication Required" message="You must be signed in to protect artworks and add them to your vault." />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center fade-in position-relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-[100] bg-black/80 border border-neon-green/30 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center shadow-[0_0_20px_rgba(0,255,163,0.2)]"
          >
            <CheckCircle className="w-5 h-5 text-neon-green mr-3" />
            <span className="text-sm font-medium tracking-wide">Artwork successfully vaulted!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Area */}
      {processState === 'idle' && (
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-6 tracking-tight leading-tight">
            Immortalize your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-green text-glow-green">Digital Identity</span>
          </h1>
          <p className="text-lg text-slate-400">
            Secure your original artwork on the blockchain-ready IPFS network, protected by AI Semantic Fingerprinting. No wallet required.
          </p>
        </div>
      )}

      {/* Upload Zone */}
      {processState === 'idle' && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-3xl aspect-[16/9] sm:aspect-video relative group cursor-pointer`}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-green to-neon-blue rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className={`relative h-full w-full bg-[#15171E] rounded-2xl border transition-colors flex flex-col items-center justify-center p-8 overflow-hidden
            ${isDragActive ? 'border-neon-green bg-[#1a1f24]' : 'border-white/10'}`}>
            <input {...getInputProps()} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`p-6 rounded-full mb-6 transition-colors duration-500 
                ${isDragActive ? 'bg-neon-green/20' : 'bg-black/40 group-hover:bg-black/60'}`}>
                <UploadCloud className={`w-12 h-12 ${isDragActive ? 'text-neon-green animate-bounce' : 'text-slate-400 group-hover:text-white'}`} />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">
                {isDragActive ? 'Drop to scan & protect' : 'Drag & drop artwork here'}
              </h3>
              <p className="text-slate-400 mb-6 font-medium">PNG, JPG, WebP up to 10MB</p>
              <button className="px-8 py-3 rounded-xl bg-neon-green hover:bg-[#00e692] text-black font-bold uppercase tracking-widest text-xs transition-all shadow-[0_4px_20px_rgba(0,255,163,0.3)] cursor-pointer">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {processState === 'processing' && (
        <div className="w-full max-w-xl mx-auto glass-card p-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="relative w-40 h-40 mb-8 rounded-2xl overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-t from-neon-green/20 to-transparent mix-blend-overlay z-10"></div>
            
            {/* Scannning line effect */}
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
            
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green z-20"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green z-20"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green z-20"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green z-20"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-display font-medium text-white tracking-widest uppercase">Protocol Engaged</h2>
            <p className="text-neon-blue text-xs font-mono mt-2 animate-pulse">Running advanced diagnostic algorithms...</p>
          </motion.div>
          
          <div className="w-full space-y-4">
            {(processStep === 'uploading' || processStep === 'checking' || processStep === 'analyzing') && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden"
              >
                {processStep === 'uploading' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div className={`w-3 h-3 rounded-full border ${processStep === 'uploading' ? 'border-neon-green' : 'border-slate-600'} flex items-center justify-center mr-4`}>
                  {processStep === 'uploading' && <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-ping"></div>}
                  {processStep !== 'uploading' && <CheckCircle className="w-3 h-3 text-neon-green" />}
                </div>
                <p className={`text-sm font-mono tracking-tight whitespace-nowrap overflow-hidden ${processStep === 'uploading' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Securing image & hashing to IPFS...
                </p>
              </motion.div>
            )}

            {(processStep === 'checking' || processStep === 'analyzing') && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden"
              >
                {processStep === 'checking' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <div className={`w-3 h-3 rounded-full border ${processStep === 'checking' ? 'border-neon-blue' : 'border-slate-600'} flex items-center justify-center mr-4`}>
                  {processStep === 'checking' && <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping"></div>}
                  {processStep !== 'checking' && <CheckCircle className="w-3 h-3 text-neon-blue" />}
                </div>
                <p className={`text-sm font-mono tracking-tight whitespace-nowrap overflow-hidden ${processStep === 'checking' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Checking global ledger for duplicates...
                </p>
              </motion.div>
            )}

            {(processStep === 'analyzing') && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center shadow-inner relative overflow-hidden"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="w-3 h-3 rounded-full border border-purple-500 flex items-center justify-center mr-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></div>
                </div>
                <p className="text-sm text-slate-300 font-mono tracking-tight whitespace-nowrap overflow-hidden text-glow-purple">
                  Analyzing Semantic Fingerprint with AI... 
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {processState === 'error' && (
        <div className="w-full max-w-xl text-center glass-card p-10 border-rose-500/30">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Protection Failed</h2>
          <p className="text-slate-400 mb-8">{errorMsg}</p>
          <button 
            onClick={resetState}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center mx-auto cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
          </button>
        </div>
      )}

      {/* Duplicate State */}
      {processState === 'duplicate' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-[#15171E] border border-[#FF3131]/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(255,49,49,0.2)] text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3131]/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <ShieldAlert className="w-20 h-20 text-[#FF3131] mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">DUPLICATE DETECTED!</h2>
            <h3 className="text-[#FF3131] text-xs font-bold uppercase tracking-[0.2em] mb-4">Anti-Plagiarism Warning</h3>
            
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              A work with this file structure and pixel data is already protected. Operation denied.
            </p>
            
            <div className="bg-black/50 border border-[#FF3131]/20 rounded-xl p-3 font-mono text-[10px] text-[#FF3131] break-all mb-8">
              CID: {duplicateHash}
            </div>
            
            <button 
              onClick={resetState}
              className="px-8 py-3 w-full rounded-xl bg-[#FF3131]/10 hover:bg-[#FF3131] text-[#FF3131] hover:text-white transition-all font-bold uppercase tracking-widest text-xs border border-[#FF3131]/30 hover:shadow-[0_0_20px_rgba(255,49,49,0.4)] cursor-pointer"
            >
              Acknowledge & Reset
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Success / Certificate State */}
      {processState === 'success' && fingerprint && (
        <CertificateCard
          resetState={resetState}
          downloadCert={downloadCert}
          certRef={certRef}
          previewUrl={previewUrl}
          fingerprint={fingerprint}
          ipfsHash={ipfsHash}
          timeStamped={timeStamped}
          user={user}
          copyToClipboard={copyToClipboard}
        />
      )}
    </div>
  );
}
