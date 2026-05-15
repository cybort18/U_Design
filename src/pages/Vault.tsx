import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthContext } from '../components/AuthProvider';
import LoginPrompt from '../components/LoginPrompt';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore_utils';

export default function VaultPage() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    
    const fetchArtworks = async () => {
      try {
        setLoadingItems(true);
        const q = query(collection(db, 'artworks'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedItems: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        // Sort by timestamp descending since we don't have indexes yet to rely on query sorting
        fetchedItems.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setItems(fetchedItems);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'artworks', { currentUser: user });
      } finally {
        setLoadingItems(false);
      }
    };

    fetchArtworks();
  }, [user]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      const itemToDelete = items.find(item => item.id === deleteId);
      
      if (itemToDelete?.ipfsHash) {
        const apiKey = import.meta.env.VITE_PINATA_API_KEY;
        const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;
        if (apiKey && apiSecret) {
          const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${itemToDelete.ipfsHash}`, {
            method: 'DELETE',
            headers: {
              pinata_api_key: apiKey,
              pinata_secret_api_key: apiSecret,
            }
          });
          
          if (!response.ok && response.status !== 404) {
             console.warn('Failed to unpin from Pinata (but will delete locally)');
          }
        }
      }

      await deleteDoc(doc(db, 'artworks', deleteId));

      setItems(items.filter(item => item.id !== deleteId));
      
      setToastMessage(`Artwork successfully revoked & removed.`);
      setTimeout(() => setToastMessage(''), 4000);
      
      setDeleteId(null);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `artworks/${deleteId}`, { currentUser: user });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return <LoginPrompt title="Vault Secured" message="Sign in with your verified account to access your protected artifacts." />;
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 relative">
      {/* Toast Notification */}
      {createPortal(
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 right-8 z-[100] bg-black/80 backdrop-blur-md border border-neon-green/30 px-6 py-4 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,163,0.15)]"
            >
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <span className="text-white text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#15171E] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Revoke Protection</h3>
            </div>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Are you sure you want to revoke this artwork?<br/><br/>
              This will remove the file from your vault and unpin it from the IPFS network permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-sm font-medium transition-colors border border-rose-500/20 hover:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? 'Revoking...' : 'Revoke'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">My Vault</h1>
          <p className="text-slate-400">Your heavily-guarded archive of protected artworks.</p>
        </div>
        {!loadingItems && (
          <div className="mt-4 md:mt-0 text-sm font-mono text-neon-green bg-neon-green/10 px-4 py-2 rounded-lg border border-neon-green/20">
            {items.length} Asset(s) Protected
          </div>
        )}
      </div>

      {loadingItems ? (
        <div className="flex items-center justify-center p-32">
          <Loader2 className="w-10 h-10 animate-spin text-neon-green/50" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed border-white/20">
          <p className="text-slate-400 mb-4">Your vault is currently empty.</p>
          <Link to="/app" className="inline-block px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
            Protect your first artwork
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${item.ipfsHash}`;
            return (
              <div key={item.id} className="glass-card overflow-hidden group relative flex flex-col">
                <div className="aspect-square w-full bg-black/50 relative overflow-hidden flex items-center justify-center">
                  <img 
                    src={ipfsUrl} 
                    alt="Artwork thumbnail" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105" 
                    onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       if (target.src.includes('placehold.co')) return;
                       target.src = 'https://placehold.co/400x400/0b0c10/00ffa3?text=IPFS+Asset';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    Secured
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-white line-clamp-1 pr-4">{item.fileName || `IPFS Asset ${i + 1}`}</h3>
                    <button 
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20 flex-shrink-0"
                      title="Remove from Vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{new Date(item.timestamp).toLocaleDateString()}</p>
                  <p className="text-[10px] font-mono text-white/40 mb-4 truncate" title={item.ipfsHash}>CID: {item.ipfsHash}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <a 
                      href={ipfsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block text-center py-2 bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white rounded-lg transition-colors border border-white/10 hover:border-white/20"
                    >
                      View on IPFS
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
