import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Trash2, AlertTriangle, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthContext } from '../contexts/AuthProvider';
import LoginPrompt from '../components/LoginPrompt';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, limit, startAfter, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../services/firestore_utils';

export default function VaultPage() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchArtworks = async () => {
      try {
        setLoadingItems(true);
        const q = query(
          collection(db, 'artworks'), 
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(12)
        );
        const querySnapshot = await getDocs(q);
        const fetchedItems: any[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedItems.push({ id: docSnap.id, ...docSnap.data() });
        });
        setItems(fetchedItems);
        
        if (querySnapshot.docs.length > 0) {
          setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setHasMore(querySnapshot.docs.length === 12);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'artworks', { currentUser: user });
      } finally {
        setLoadingItems(false);
      }
    };

    fetchArtworks();
  }, [user]);

  const loadMore = async () => {
    if (!user || !lastDoc || isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const q = query(
        collection(db, 'artworks'), 
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        startAfter(lastDoc),
        limit(12)
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedItems: any[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedItems.push({ id: docSnap.id, ...docSnap.data() });
      });
      
      setItems([...items, ...fetchedItems]);
      
      if (querySnapshot.docs.length > 0) {
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setHasMore(querySnapshot.docs.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    
    try {
      const token = await user?.getIdToken();
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:3001' : '');

      const response = await fetch(`${apiUrl}/api/protect/${deleteId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete artwork from server');
      }

      setItems(items.filter(item => item.id !== deleteId));
      
      setToastMessage(`Artwork successfully revoked & removed.`);
      setTimeout(() => setToastMessage(''), 4000);
      
      setDeleteId(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setToastMessage(`Failed to delete artwork.`);
      setTimeout(() => setToastMessage(''), 4000);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#15171E]/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(244,63,94,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 shadow-[inset_0_0_15px_rgba(244,63,94,0.2)]">
                <ShieldAlert className="w-7 h-7 text-rose-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Revoke Protection?</h3>
                <h4 className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">Irreversible Action</h4>
              </div>
            </div>
            
            <div className="space-y-4 mb-8 relative z-10">
              <p className="text-slate-300 text-sm leading-relaxed">
                This action will delete the asset from your <span className="text-white font-semibold">U_Design Vault</span> and unpin it from our primary <span className="text-white font-semibold">Pinata nodes</span>.
              </p>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                <p className="text-rose-400/90 text-xs leading-relaxed italic">
                  <strong>Note:</strong> Due to the immutable nature of the decentralized IPFS network, if your asset has already been cached by other global nodes, it may still remain accessible on the network permanently.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 relative z-10">
              <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-rose-500/30 hover:border-rose-600 hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? 'Revoking...' : 'Yes, Revoke Asset'}
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

      {hasMore && items.length > 0 && !loadingItems && (
        <div className="mt-12 text-center pb-12">
          <button 
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10 disabled:opacity-50 flex items-center justify-center mx-auto cursor-pointer"
          >
            {isLoadingMore ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoadingMore ? 'Loading...' : 'Load More Artworks'}
          </button>
        </div>
      )}
    </div>
  );
}
