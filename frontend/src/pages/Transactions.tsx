import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTransactions, Transaction } from '../firebase/firestore';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, AlertTriangle, Flag } from 'lucide-react';
import { format } from 'date-fns';

type Filter = 'all' | 'transfer' | 'deposit' | 'withdrawal';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const PAGE_SIZE = 10;

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Transfers', value: 'transfer' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Withdrawals', value: 'withdrawal' },
];

function txIcon(type: string) {
  if (type === 'deposit') return <ArrowDownRight className="h-4 w-4 text-emerald-400" />;
  if (type === 'withdrawal') return <ArrowUpRight className="h-4 w-4 text-destructive" />;
  return <ArrowLeftRight className="h-4 w-4 text-primary" />;
}

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!user) return;
    getUserTransactions(user.uid).then(txs => {
      setTransactions(txs);
      setLoading(false);
    });
  }, [user]);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedTransactions = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6" data-testid="transactions-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground text-sm mt-1">Your complete transaction history</p>
          </motion.div>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                data-testid={`filter-${f.value}`}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* List */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <ArrowLeftRight className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div>
                <div className="divide-y divide-border">
                  {pagedTransactions.map((tx, i) => {
                    const isHighValueWarning = tx.type === 'transfer' && tx.amount > 1000;
                    const isFlagged = !!tx.flagged;

                    return <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center justify-between p-4 hover:bg-accent/30 transition-colors ${isFlagged ? 'bg-destructive/5' : ''}`}
                    data-testid={`tx-item-${tx.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg shrink-0">{txIcon(tx.type)}</div>
                      <div>
                        <p className="text-sm font-medium">{tx.recipient || tx.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.category} · {tx.timestamp ? format(tx.timestamp.toDate(), 'MMM d, yyyy · h:mm a') : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isFlagged && (
                        <span className="flex items-center gap-1 text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full" data-testid="badge-flagged">
                          <Flag className="h-3 w-3" /> Flagged
                        </span>
                      )}
                      {isHighValueWarning && !isFlagged && (
                        <span className="flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-full" data-testid="badge-warning">
                          <AlertTriangle className="h-3 w-3" /> Warning
                        </span>
                      )}
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-destructive'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{tx.type}</p>
                      </div>
                    </div>
                  </motion.div>;
                  })}
                </div>
                {filtered.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {filtered.length === 0 ? 'No records' : `Showing ${pagedTransactions.length} record${pagedTransactions.length === 1 ? '' : 's'} on this page`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">Page {safePage} of {totalPages}</span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
