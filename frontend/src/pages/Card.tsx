import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVirtualCard, updateVirtualCard, VirtualCard } from '../firebase/firestore';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { CreditCard, Eye, EyeOff, Lock, Unlock, Wifi } from 'lucide-react';
import { toast } from 'sonner';

export default function Card() {
  const { user } = useAuth();
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const c = await getVirtualCard();
      setCard(c);
      setLoading(false);
    })();
  }, [user]);

  const toggleStatus = async () => {
    if (!user || !card) return;
    setToggling(true);
    try {
      const newStatus = card.status === 'active' ? 'blocked' : 'active';
      await updateVirtualCard(user.uid, { status: newStatus });
      setCard(c => c ? { ...c, status: newStatus } : c);
      toast.success(`Card ${newStatus === 'active' ? 'activated' : 'blocked'}`);
    } catch {
      toast.error('Failed to update card status');
    } finally {
      setToggling(false);
    }
  };

  const isActive = card?.status === 'active';

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-lg mx-auto space-y-6" data-testid="card-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold">Virtual Card</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your digital payment card</p>
          </motion.div>

          {loading ? (
            <div className="h-52 bg-muted rounded-2xl animate-pulse" />
          ) : (
            <>
              {/* Card Visual */}
              <motion.div
                initial={{ opacity: 0, y: 24, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                style={{ perspective: 800 }}
                data-testid="virtual-card"
              >
                <div className={`relative rounded-2xl p-6 overflow-hidden shadow-2xl ${isActive
                  ? 'bg-gradient-to-br from-primary via-blue-600 to-indigo-700'
                  : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800'
                }`}>
                  {/* Card decoration */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

                  <div className="relative flex justify-between items-start mb-10">
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-widest">SmartBank</p>
                      <p className="text-white font-bold text-lg mt-0.5">Virtual Card</p>
                    </div>
                    <Wifi className="h-6 w-6 text-white/60 rotate-90" />
                  </div>

                  <div className="relative">
                    <p className="font-mono text-xl text-white tracking-widest mb-4" data-testid="text-card-number">
                      {revealed ? card?.cardNumber : card?.cardNumberMasked || '**** **** **** ****'}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Card Holder</p>
                        <p className="text-white font-medium text-sm">{user?.name?.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Expires</p>
                        <p className="text-white font-medium text-sm font-mono">{card?.expiry}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Status + Controls */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Card Status</p>
                      <p className="text-xs text-muted-foreground">{card?.cardNumberMasked}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'
                  }`} data-testid="badge-card-status">
                    {card?.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    data-testid="button-reveal-card"
                    onClick={() => setRevealed(r => !r)}
                    className="flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {revealed ? 'Hide' : 'Reveal'}
                  </button>
                  <button
                    data-testid="button-toggle-status"
                    onClick={toggleStatus}
                    disabled={toggling}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                      isActive
                        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                  >
                    {isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {toggling ? 'Updating...' : isActive ? 'Block Card' : 'Activate Card'}
                  </button>
                </div>
              </motion.div>

              {!isActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-sm text-destructive">
                  <Lock className="h-4 w-4 shrink-0" />
                  This card is currently blocked. Activate it to make payments.
                </motion.div>
              )}
            </>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
