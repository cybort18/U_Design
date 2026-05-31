import { UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadAreaProps {
  onDrop: (files: File[]) => void;
}

export default function UploadArea({ onDrop }: UploadAreaProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpeg', '.jpg', '.webp'] },
    maxFiles: 1
  } as any);

  return (
    <div {...getRootProps()} className={`w-full max-w-3xl aspect-[16/9] sm:aspect-video relative group cursor-pointer`}>
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
  );
}
