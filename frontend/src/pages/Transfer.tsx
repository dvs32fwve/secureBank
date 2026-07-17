import { useState } from 'react';
import { getIdToken } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/+$/, '');

const buildUrl = (baseUrl: string, path: string) => {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
};

const CATEGORIES = ['Food', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other'];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function Transfer() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ recipient: '', amount: '', category: 'Other', note: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.recipient.trim()) e.recipient = 'Recipient email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipient.trim())) e.recipient = 'Enter a valid email address';
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount';
    if (amt > (user?.balance ?? 0)) e.amount = 'Insufficient funds';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep('confirm');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(form.amount);
      const token = await getIdToken(auth.currentUser!);
      const response = await fetch(buildUrl(BACKEND_URL, '/transfer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail: form.recipient.trim(),
          amount,
          category: form.category,
          note: form.note,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Transfer failed');
      }

      await refreshUser();
      toast.success(data.flagged ? 'Transfer completed successfully. This transaction exceeds your daily transfer limit of $1,000.' : 'Transfer completed successfully');
      setForm({ recipient: '', amount: '', category: 'Other', note: '' });
      setStep('form');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Transfer failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const amount = parseFloat(form.amount) || 0;
  const isFlagRisk = amount > 1000;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-lg mx-auto" data-testid="transfer-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">Transfer Money</h1>
            <p className="text-muted-foreground text-sm mb-8">Send funds to any recipient instantly</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-card border border-border rounded-2xl p-6">
              <AnimatePresence mode="wait">
                {step === 'form' ? (
                  <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-foreground/80 block mb-1.5">Recipient Email</label>
                      <input
                        data-testid="input-recipient"
                        value={form.recipient}
                        onChange={e => setForm(f => ({ ...f, recipient: e.target.value }))}
                        placeholder="Enter recipient email"
                        className="w-full bg-muted border border-input rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                      />
                      {errors.recipient && <p className="text-destructive text-xs mt-1">{errors.recipient}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground/80 block mb-1.5">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <input
                          data-testid="input-amount"
                          type="number"
                          value={form.amount}
                          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-muted border border-input rounded-lg pl-8 pr-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      {errors.amount && <p className="text-destructive text-xs mt-1">{errors.amount}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Available: {formatCurrency(user?.balance ?? 0)}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground/80 block mb-1.5">Category</label>
                      <select
                        data-testid="select-category"
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full bg-muted border border-input rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground/80 block mb-1.5">Note (optional)</label>
                      <input
                        data-testid="input-note"
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        placeholder="Add a note..."
                        className="w-full bg-muted border border-input rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                      />
                    </div>

                    {isFlagRisk && (
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        This transaction exceeds your daily transfer limit of $1,000
                      </div>
                    )}

                    <button
                      data-testid="button-next"
                      onClick={handleNext}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                      Review Transfer <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="text-center py-4">
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowLeftRight className="h-7 w-7 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-sm">You are sending</p>
                      <p className="text-4xl font-bold mt-1" data-testid="text-confirm-amount">{formatCurrency(amount)}</p>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                      {[
                        { label: 'To', value: form.recipient },
                        { label: 'Category', value: form.category },
                        { label: 'Note', value: form.note || '—' },
                        { label: 'Transfer Limit', value: isFlagRisk ? 'Exceeded ($1,000)' : 'Within limit' },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{r.label}</span>
                          <span className={`font-medium ${r.label === 'Transfer Limit' && isFlagRisk ? 'text-amber-400' : ''}`}>{r.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        data-testid="button-back"
                        onClick={() => setStep('form')}
                        className="flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-sm font-medium hover:bg-accent transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        data-testid="button-confirm-transfer"
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors disabled:opacity-60"
                      >
                        {loading ? <div className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        {loading ? 'Sending...' : 'Confirm'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
