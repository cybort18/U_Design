import { ShieldAlert, LogIn } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthProvider';

export default function LoginPrompt({ title, message }: { title: string; message: string }) {
  const { signIn } = useAuthContext();

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8">
      <div className="glass-card max-w-md w-full p-10 text-center flex flex-col items-center relative overflow-hidden border-neon-green/20">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-neon-green/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] relative z-10 text-neon-green">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-3">{title}</h2>
        <p className="text-slate-400 mb-8 leading-relaxed max-w-xs">{message}</p>
        <button 
          onClick={signIn}
          className="relative group w-full py-3 px-6 rounded-xl overflow-hidden font-bold transition-all bg-neon-green text-black hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] flex items-center justify-center gap-3 cursor-pointer"
        >
          <LogIn className="w-5 h-5" />
          Authenticate with Google
        </button>
      </div>
    </div>
  );
}
