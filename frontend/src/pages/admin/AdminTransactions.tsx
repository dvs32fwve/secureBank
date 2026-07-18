import { useEffect, useState } from 'react';
import { clearTransactionFlag, getAllTransactions, Transaction } from '../../firebase/firestore';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { ShieldAlert, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const PAGE_SIZE = 10;

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllTransactions().then(txs => { setTransactions(txs); setLoading(false); });
  }, []);

  const handleClearFlag = async (txId?: string) => {
    if (!txId) return;

    setUpdatingId(txId);
    try {
      await clearTransactionFlag(txId);
      setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, flagged: false, flagReason: '' } : tx));
      toast.success('Flag removed successfully');
    } catch (error) {
      console.error('Failed to clear transaction flag:', error);
      toast.error('Unable to remove the flag right now');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedTransactions = transactions.slice(startIndex, startIndex + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [transactions.length]);

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="space-y-6" data-testid="admin-transactions-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <ShieldAlert className="h-5 w-5 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold">All Transactions</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {transactions.filter(t => t.flagged).length} flagged transaction{transactions.filter(t => t.flagged).length !== 1 ? 's' : ''} detected
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">User ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Recipient</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Type</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Amount</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Category</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Date</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Flag</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pagedTransactions.map((tx, i) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`transition-colors ${tx.flagged ? 'bg-destructive/5 hover:bg-destructive/10' : 'hover:bg-accent/20'}`}
                        data-testid={`admin-tx-${tx.id}`}
                      >
                        <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{tx.userId.slice(0, 10)}...</td>
                        <td className="px-5 py-3.5 text-sm">{tx.recipient || '—'}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                            tx.type === 'withdrawal' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-primary/20 text-primary'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className={`px-5 py-3.5 text-right text-sm font-semibold ${tx.type === 'deposit' ? 'text-emerald-400' : 'text-destructive'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">{tx.category}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground">
                          {tx.timestamp ? format(tx.timestamp.toDate(), 'MMM d, yy · h:mm a') : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {tx.flagged && (
                            <span className="inline-flex items-center gap-1 text-xs text-destructive" data-testid="admin-badge-flagged">
                              <Flag className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {tx.flagged ? (
                            <button
                              onClick={() => handleClearFlag(tx.id)}
                              disabled={updatingId === tx.id}
                              className="text-xs font-medium text-primary hover:text-primary/80 disabled:opacity-60"
                            >
                              {updatingId === tx.id ? 'Updating...' : 'Remove Flag'}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {transactions.length > 0 && (
                  <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      {transactions.length === 0 ? 'No records' : `Showing ${pagedTransactions.length} record${pagedTransactions.length === 1 ? '' : 's'} on this page`}
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
                {transactions.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">No transactions found</div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
