import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { createTransaction, getVirtualCard, VirtualCard } from '../firebase/firestore';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, CreditCard, ShoppingBag, Sparkles, Store, X } from 'lucide-react';
import { toast } from 'sonner';

const FRAUD_THRESHOLD = 1000;
const PRODUCTS = [
  { id: 'gamebundle', name: 'Ultra Gaming Bundle', price: 1499, category: 'Gaming', description: 'A premium bundle with a headset, controller, and game pass.', accent: 'from-fuchsia-500/20 to-violet-500/10' },
  { id: 'giftcard', name: 'Digital Gift Card Pack', price: 320, category: 'Gift Cards', description: 'Instant e-gift cards for retail and entertainment brands.', accent: 'from-cyan-500/20 to-sky-500/10' },
  { id: 'streaming', name: 'Premium Streaming Pass', price: 890, category: 'Entertainment', description: 'Unlock premium streaming and creator subscriptions for a month.', accent: 'from-amber-500/20 to-orange-500/10' },
  { id: 'wearable', name: 'Smart Fitness Band', price: 240, category: 'Electronics', description: 'A lightweight band with sleep and heart-rate tracking.', accent: 'from-emerald-500/20 to-teal-500/10' },
  { id: 'headphones', name: 'Noise-Cancel Headphones', price: 410, category: 'Electronics', description: 'Immersive audio for work, travel, and gaming.', accent: 'from-slate-500/20 to-blue-500/10' },
  { id: 'travel', name: 'Weekend Travel Pack', price: 680, category: 'Travel', description: 'A compact travel bundle with luggage tags and accessories.', accent: 'from-rose-500/20 to-pink-500/10' },
  { id: 'voucher', name: 'Cloud Storage Voucher', price: 180, category: 'Software', description: 'A one-year storage voucher for your everyday files.', accent: 'from-indigo-500/20 to-purple-500/10' },
  { id: 'console', name: 'Arcade Controller', price: 125, category: 'Gaming', description: 'A stylish controller for retro and modern gaming.', accent: 'from-lime-500/20 to-green-500/10' },
  { id: 'coffee', name: 'Coffee Subscription', price: 95, category: 'Lifestyle', description: 'Three months of premium coffee delivered each week.', accent: 'from-orange-500/20 to-amber-500/10' },
  { id: 'books', name: 'Book Bundle', price: 70, category: 'Education', description: 'A curated list of bestselling business and design books.', accent: 'from-blue-500/20 to-cyan-500/10' },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

function normalize(value: string) {
  return value.replace(/\s+/g, '').toLowerCase();
}

export default function StorePage() {
  const { user, refreshUser } = useAuth();
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[number] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    const loadCard = async () => {
      try {
        const data = await getVirtualCard();
        if (active) setCard(data);
      } catch {
        if (active) setCard(null);
      } finally {
        if (active) setLoadingCard(false);
      }
    };

    loadCard();
    return () => {
      active = false;
    };
  }, [user]);

  const handleOpenCheckout = (product: (typeof PRODUCTS)[number]) => {
    setSelectedProduct(product);
    setForm({ cardName: user?.name || '', cardNumber: '', expiry: '', cvv: '' });
    setMessage(null);
  };

  const handleCloseCheckout = () => {
    setSelectedProduct(null);
    setMessage(null);
  };

  const handlePurchase = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedProduct || !user || !card) return;

    if (card.status !== 'active') {
      setMessage({ type: 'error', text: 'Your virtual card is blocked. Activate it first to continue.' });
      return;
    }

    const expectedName = (user.name || '').trim().toLowerCase();
    const enteredName = form.cardName.trim().toLowerCase();
    const enteredCardNumber = normalize(form.cardNumber);
    const storedCardNumber = normalize(card.cardNumber);

    if (!enteredName || enteredName !== expectedName) {
      setMessage({ type: 'error', text: 'Cardholder name must match your SecureBank profile name.' });
      return;
    }

    if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(form.cardNumber)) {
      setMessage({ type: 'error', text: 'Enter the full 16-digit card number.' });
      return;
    }

    if (enteredCardNumber !== storedCardNumber) {
      setMessage({ type: 'error', text: 'The card number does not match your VCC.' });
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry) || form.expiry !== card.expiry) {
      setMessage({ type: 'error', text: 'The expiry date does not match your VCC.' });
      return;
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      setMessage({ type: 'error', text: 'Enter a valid 3-digit or 4-digit CVV.' });
      return;
    }

    setSubmitting(true);
    try {
      // Evaluate local store fraud reasons (mirrors backend transfer rules where applicable)
      const reasons: string[] = [];
      if (selectedProduct.price > FRAUD_THRESHOLD) reasons.push('high_value');
      if (selectedProduct.category.toLowerCase() === 'gift cards' && selectedProduct.price > 500) reasons.push('high_risk_category');

      const isFlagged = reasons.length > 0;
      await createTransaction(user.uid, {
        type: 'withdrawal',
        amount: selectedProduct.price,
        recipient: `${selectedProduct.name} via SecureBank VCC`,
        category: selectedProduct.category,
        flagged: isFlagged,
        flagReason: reasons.join('; '),
      });

      await refreshUser();
      toast.success(isFlagged ? `Purchase approved and flagged for review because it exceeded $${FRAUD_THRESHOLD}.` : 'Payment completed successfully.');
      handleCloseCheckout();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Payment failed';
      setMessage({ type: 'error', text });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground" data-testid="store-page">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">SecureBank Demo</p>
                <p className="text-xs text-muted-foreground">Virtual checkout</p>
              </div>
            </div>
            <nav className="flex items-center gap-2">
              <Link href={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>
                <a className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Dashboard</a>
              </Link>
              <Link href="/store">
                <a className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">Store</a>
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card/70 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <ShoppingBag className="h-4 w-4" />
                  Demo storefront
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Buy with your SecureBank virtual card</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Choose a product, enter your VCC details, and complete a realistic checkout. Large purchases are automatically flagged for review.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PRODUCTS.map((product) => {
              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className={`rounded-xl bg-gradient-to-br ${product.accent} p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{product.category}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-sm font-semibold">Limited demo offer</p>
                    </div>
                  </div>

                  <div className="mt-4 flex-1">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</p>
                      <p className="text-xl font-semibold">{formatCurrency(product.price)}</p>
                    </div>
                    <button
                      onClick={() => handleOpenCheckout(product)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>

        <AnimatePresence>
          {selectedProduct && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-primary">Checkout</p>
                    <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
                  </div>
                  <button onClick={handleCloseCheckout} className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CreditCard className="h-4 w-4 text-primary" />
                    SecureBank VCC payment
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Enter your card details to confirm the payment. Only the correct VCC details will succeed.</p>
                </div>

                <form onSubmit={handlePurchase} className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Cardholder Name</label>
                    <input value={form.cardName} onChange={(e) => setForm((prev) => ({ ...prev, cardName: e.target.value }))} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="Your full name" />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Card Number</label>
                    <input value={form.cardNumber} onChange={(e) => setForm((prev) => ({ ...prev, cardNumber: e.target.value.replace(/[^\d]/g, '').slice(0, 16) }))} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="4242 4242 4242 4242" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Expiry</label>
                      <input value={form.expiry} onChange={(e) => setForm((prev) => ({ ...prev, expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 5) }))} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">CVV</label>
                      <input value={form.cvv} onChange={(e) => setForm((prev) => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="123" />
                    </div>
                  </div>

                  {message && (
                    <div className={`rounded-xl border px-3 py-2 text-sm ${message.type === 'error' ? 'border-destructive/20 bg-destructive/10 text-destructive' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'}`}>
                      {message.text}
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold">{formatCurrency(selectedProduct.price)}</p>
                    </div>
                    <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70">
                      {submitting ? 'Processing...' : <><CheckCircle2 className="h-4 w-4" /> Pay Now</>}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
