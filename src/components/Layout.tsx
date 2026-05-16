import { Link, useLocation, useOutlet } from 'react-router-dom';
import { ShieldCheck, Home, Menu, X, Shield, Search, LayoutGrid, Info, LogOut, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthProvider';

import { createPortal } from 'react-dom';

function AuthWidget() {
  const { user, loading, signIn, signOut } = useAuthContext();
  const [showConfirm, setShowConfirm] = useState(false);

  if (loading) return <div className="mb-6 h-10 animate-pulse bg-white/5 rounded-lg" />;

  if (user) {
    return (
      <div className="mb-6 flex flex-col gap-3">
        {showConfirm && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#15171E] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-rose-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Sign Out</h3>
              </div>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Are you sure you want to sign out of your account?
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { setShowConfirm(false); signOut(); }}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-sm font-medium transition-colors border border-rose-500/20 hover:border-rose-500 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
        <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
          <img 
            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email || 'User'}`} 
            alt="Avatar" 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-white/10 object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('ui-avatars')) {
                target.src = `https://ui-avatars.com/api/?name=${user.email || 'User'}&background=random`;
              }
            }}
          />
          <div className="flex flex-col flex-1 truncate">
            <span className="text-xs text-white truncate font-medium">{user.displayName || user.email}</span>
            <span className="text-[10px] text-neon-green/80 uppercase tracking-wider font-mono truncate">Connected</span>
          </div>
        </div>
        <button 
          onClick={() => setShowConfirm(true)}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-500/20 text-xs font-semibold cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button 
        onClick={signIn}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-colors border border-neon-green/20 text-sm font-semibold cursor-pointer"
      >
        <LogIn className="w-4 h-4" />
        Connect Account
      </button>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { name: 'Protect', path: '/app', icon: Shield },
    { name: 'Verify', path: '/app/verify', icon: Search },
    { name: 'My Vault', path: '/app/vault', icon: LayoutGrid },
    { name: 'How it Works', path: '/app/how-it-works', icon: Info },
  ];

  return (
    <div className="w-full min-h-screen flex bg-obsidian text-white font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <motion.aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 bg-obsidian/80",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-green/20 to-transparent border border-neon-green/30 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(0,255,163,0.3)]">
              <ShieldCheck className="w-5 h-5 text-neon-green" />
            </div>
            <h1 className="text-xl tracking-tighter font-bold text-white"><span className="text-neon-green">U_</span>DESIGN</h1>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/app' && location.pathname === '/app/');
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                  isActive 
                    ? "bg-neon-green/10 text-neon-green border border-neon-green/30 shadow-[0_0_15px_rgba(0,255,163,0.15)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-neon-green drop-shadow-[0_0_8px_rgba(0,255,163,0.8)]" : "opacity-70")} />
                <span className={isActive ? "text-glow-green" : ""}>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <AuthWidget />
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5 text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-obsidian/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-neon-green/20 to-transparent border border-neon-green/30 rounded-md flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
            </div>
            <h1 className="text-lg tracking-tighter font-bold text-white"><span className="text-neon-green">U_</span>DESIGN</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {outlet}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
