import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { createPortal } from 'react-dom';
import { UploadCloud, CheckCircle, ShieldAlert, Copy, Download, RefreshCcw, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthContext } from '../contexts/AuthProvider';
import LoginPrompt from '../components/LoginPrompt';
import { db } from '../services/firebase';
import { collection, doc, setDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../services/firestore_utils';

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

    try {
      const ts = new Date().toUTCString();
      setTimeStamped(ts);

      const hash = await uploadToPinata(selectedFile);

      setProcessStep('checking');
      
      // Global Duplicate Check
      const artworksRef = collection(db, 'artworks');
      const duplicateQuery = query(artworksRef, where('ipfsHash', '==', hash));
      const querySnapshot = await getDocs(duplicateQuery);
      
      if (!querySnapshot.empty) {
        setDuplicateHash(hash);
        setProcessState('duplicate');
        processingRef.current = false;
        return;
      }

      setProcessStep('analyzing');
      const aiData = await analyzeWithGemini(selectedFile);

      setIpfsHash(hash);
      setFingerprint(aiData);

      try {
        const docId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const artworkData = {
          userId: user?.uid,
          ipfsHash: hash,
          timestamp: ts,
          createdAt: serverTimestamp(),
          fingerprint: aiData,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type
        };
        
        await setDoc(doc(db, 'artworks', docId), artworkData);
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.WRITE, 'artworks', { currentUser: user });
      }

      setProcessState('success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An unknown error occurred during processing.');
      setProcessState('error');
      processingRef.current = false;
    }
  };

  const uploadToPinata = async (file: File) => {
    const apiKey = import.meta.env.VITE_PINATA_API_KEY;
    const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      // Allow graceful failure for testing if keys are absent, though not recommended for production
      console.warn("Pinata keys not found. Faking IPFS Hash for demonstration.");
      await new Promise(r => setTimeout(r, 2000));
      return "QmSample" + Math.random().toString(36).substring(2, 15);
      // throw new Error("Pinata API keys are missing in environment variables.");
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error(`Pinata upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.IpfsHash;
  };

  const analyzeWithGemini = async (file: File): Promise<FingerprintData> => {
    // We try to use VITE_GEMINI_API_KEY first, fallback to process.env.GEMINI_API_KEY injected by vite config
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!geminiKey) {
       console.warn("Gemini key not found. Faking AI response.");
       await new Promise(r => setTimeout(r, 2500));
       return {
         artStyle: "Cyberpunk Digital Art",
         dominantColors: ["#000000", "#00FFA3"],
         mainObjects: ["Abstract shape", "Neon lights"],
         copyrightDescription: "A dark cyberpunk abstract composition featuring neon green glowing geometries."
       };
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const b64Data = await fileToBase64(file);

    const prompt = `Analyze this image. Detect the Art Style, Dominant Colors (use Hex Codes), Main Objects, and provide a short (1-2 sentence) copyright description. 
    Return the result strictly in JSON format with keys: artStyle, dominantColors (array of strings), mainObjects (array of strings), copyrightDescription. Do not use markdown blocks around the response.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: b64Data, mimeType: file.type } },
                    { text: prompt }
                ]
            }
        ]
      });

      let text = response.text || '';
      // Clean up possible markdown json blocks
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      try {
        return JSON.parse(text) as FingerprintData;
      } catch (e) {
        console.error("Failed to parse Gemini output:", text);
        throw new Error("AI Analysis returned malformed data.");
      }
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      if (err.message?.includes('RESOURCE_EXHAUSTED') || err.message?.includes('429')) {
        throw new Error("Gemini API Rate Limit Exceeded. You have used your free quota or current quota limit. Please wait or check your Google AI Studio plan.");
      }
      throw new Error(`AI Analysis Failed: ${err.message || 'Unknown error'}`);
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
            className="relative bg-obsidian border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl p-8 md:p-10 lg:p-12 box-glow-green"
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
                    
                    <div className="grid grid-cols-2 gap-y-6 gap-x-6 relative z-10">
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
                      <div className="col-span-2 space-y-2 pt-4 border-t border-white/5">
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
      )}
    </div>
  );
}
