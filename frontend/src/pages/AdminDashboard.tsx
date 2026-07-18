import { useEffect, useState } from 'react';
import { getAllUsers, getAllTransactions, Transaction, User } from '../firebase/firestore';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const CHART_COLORS = [
  'hsl(210,100%,56%)',
  'hsl(174,72%,46%)',
  'hsl(263,70%,60%)',
  'hsl(38,92%,55%)',
  'hsl(0,72%,60%)',
  'hsl(180,60%,50%)',
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const FLAGGED_TX_PAGE_SIZE = 3;
const RECENT_TX_PAGE_SIZE = 5;

function txTypeLabel(type: string) {
  if (type === 'deposit') return 'Deposit';
  if (type === 'withdrawal') return 'Withdrawal';
  return 'Transfer';
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [flaggedPage, setFlaggedPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllUsers(), getAllTransactions()])
      .then(([loadedUsers, loadedTxs]) => {
        setUsers(loadedUsers);
        setTransactions(loadedTxs);
      })
      .catch((error) => {
        console.error('Failed to load admin dashboard data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = users.length;
  const totalTransactions = transactions.length;
  const flaggedTransactions = transactions.filter((tx) => tx.flagged);
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const categoryTotals = transactions.reduce<Record<string, number>>((acc, tx) => {
    if (tx.type !== 'deposit') {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    }
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total,
  }));

  const recentFlagged = flaggedTransactions;
  const recentTransactions = transactions;
  const flaggedPageCount = Math.max(1, Math.ceil(recentFlagged.length / FLAGGED_TX_PAGE_SIZE));
  const recentPageCount = Math.max(1, Math.ceil(recentTransactions.length / RECENT_TX_PAGE_SIZE));
  const safeFlaggedPage = Math.min(flaggedPage, flaggedPageCount);
  const safeRecentPage = Math.min(recentPage, recentPageCount);
  const startFlaggedIndex = (safeFlaggedPage - 1) * FLAGGED_TX_PAGE_SIZE;
  const startRecentIndex = (safeRecentPage - 1) * RECENT_TX_PAGE_SIZE;
  const pagedFlaggedTransactions = recentFlagged.slice(startFlaggedIndex, startFlaggedIndex + FLAGGED_TX_PAGE_SIZE);
  const pagedRecentTransactions = recentTransactions.slice(startRecentIndex, startRecentIndex + RECENT_TX_PAGE_SIZE);

  useEffect(() => {
    setFlaggedPage(1);
    setRecentPage(1);
  }, [transactions.length]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" data-testid="admin-dashboard-page">
          <motion.div variants={item} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage users, review flagged transfers, and monitor overall activity.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admin panel</p>
                <p className="font-medium">Overview</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Total Users',
                value: totalUsers.toString(),
                description: 'Registered accounts',
                color: 'text-primary',
                bg: 'bg-primary/10',
                icon: Users,
              },
              {
                label: 'Transactions',
                value: totalTransactions.toString(),
                description: 'All activity records',
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                icon: TrendingUp,
              },
              {
                label: 'Flagged Transfers',
                value: flaggedTransactions.length.toString(),
                description: 'Needs manual review',
                color: 'text-destructive',
                bg: 'bg-destructive/10',
                icon: ShieldAlert,
              },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${stat.bg} p-2 rounded-xl`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={item} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Transaction Volume</h2>
                <p className="text-sm text-muted-foreground">Total value of all transactions</p>
              </div>
              <p className="text-xl font-semibold">{formatCurrency(totalVolume)}</p>
            </div>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
            ) : chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground">No spending data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 40% 12%)', border: '1px solid hsl(220 30% 20%)', borderRadius: 8 }}
                    labelStyle={{ color: 'hsl(210 20% 94%)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Spent']}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div variants={item} className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Latest Flagged Transactions</h2>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentFlagged.length === 0 ? (
                <p className="text-muted-foreground text-sm">No flagged transactions at the moment.</p>
              ) : (
                <div className="space-y-3">
                  {pagedFlaggedTransactions.map((tx) => (
                    <div key={tx.id} className="rounded-2xl bg-muted/20 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium">{txTypeLabel(tx.type)} • {tx.category}</p>
                          <p className="text-sm text-muted-foreground">{tx.recipient || 'Unknown recipient'}</p>
                        </div>
                        <p className="font-semibold text-destructive">-{formatCurrency(tx.amount)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Flagged for review</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {recentFlagged.length === 0 ? 'No records' : `Showing ${pagedFlaggedTransactions.length} record${pagedFlaggedTransactions.length === 1 ? '' : 's'} on this page`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFlaggedPage((p) => Math.max(1, p - 1))}
                        disabled={safeFlaggedPage === 1}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">Page {safeFlaggedPage} of {flaggedPageCount}</span>
                      <button
                        onClick={() => setFlaggedPage((p) => Math.min(flaggedPageCount, p + 1))}
                        disabled={safeFlaggedPage === flaggedPageCount}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent transactions available.</p>
              ) : (
                <div className="space-y-3">
                  {pagedRecentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/20 p-4">
                      <div>
                        <p className="font-medium">{txTypeLabel(tx.type)}</p>
                        <p className="text-sm text-muted-foreground">{tx.timestamp ? format(tx.timestamp.toDate(), 'MMM d, yyyy') : 'Unknown date'}</p>
                      </div>
                      <div className="text-right">
                        <p className={tx.flagged ? 'text-destructive font-semibold' : 'font-semibold'}>{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-muted-foreground">{tx.category}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {recentTransactions.length === 0 ? 'No records' : `Showing ${pagedRecentTransactions.length} record${pagedRecentTransactions.length === 1 ? '' : 's'} on this page`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRecentPage((p) => Math.max(1, p - 1))}
                        disabled={safeRecentPage === 1}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-muted-foreground">Page {safeRecentPage} of {recentPageCount}</span>
                      <button
                        onClick={() => setRecentPage((p) => Math.min(recentPageCount, p + 1))}
                        disabled={safeRecentPage === recentPageCount}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </Layout>
    </ProtectedRoute>
  );
}
