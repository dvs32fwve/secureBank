import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../firebase/firestore';
import { FraudBanner } from '../components/FraudBanner';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Avatar from '../components/Avatar';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowDownRight, ArrowUpRight, ArrowLeftRight, TrendingUp, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { useLocation } from 'wouter';

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

function txIcon(type: string) {
  if (type === 'deposit') return <ArrowDownRight className="h-4 w-4 text-emerald-400" />;
  if (type === 'withdrawal') return <ArrowUpRight className="h-4 w-4 text-destructive" />;
  return <ArrowLeftRight className="h-4 w-4 text-primary" />;
}

function txColor(type: string) {
  if (type === 'deposit') return 'text-emerald-400';
  return 'text-destructive';
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      setLocation('/admin/dashboard');
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const hasFlagged = transactions.some((t) => t.flagged);

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

  const recent = transactions.slice(0, 5);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <ProtectedRoute>
      <Layout>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" data-testid="customer-dashboard-page">
          {hasFlagged && <FraudBanner />}

          <motion.div variants={item} className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good day, {user?.name?.split(' ')[0]}</h1>
              <p className="text-muted-foreground text-sm mt-1">Here's your financial overview</p>
            </div>
            <Avatar src={user?.photoURL} name={user?.name} className="w-10 h-10 rounded-full ring-2 ring-primary/30" />
          </motion.div>

          <motion.div
            variants={item}
            className="bg-gradient-to-br from-primary/30 via-primary/10 to-card border border-primary/20 rounded-2xl p-6"
            data-testid="card-balance"
          >
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Wallet className="h-4 w-4" />
              Available Balance
            </div>
            <div className="text-4xl font-bold tracking-tight" data-testid="text-balance">
              {formatCurrency(user?.balance ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Account ending in **** 4532</p>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Total Spent',
                value: formatCurrency(transactions.filter((t) => t.type !== 'deposit').reduce((a, t) => a + t.amount, 0)),
                icon: ArrowUpRight,
                color: 'text-destructive',
                bg: 'bg-destructive/10',
              },
              {
                label: 'Total Received',
                value: formatCurrency(transactions.filter((t) => t.type === 'deposit').reduce((a, t) => a + t.amount, 0)),
                icon: ArrowDownRight,
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10',
              },
              {
                label: 'Transactions',
                value: transactions.length.toString(),
                icon: TrendingUp,
                color: 'text-primary',
                bg: 'bg-primary/10',
              },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className={`${s.bg} p-2.5 rounded-lg`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-semibold" data-testid={`stat-${s.label.toLowerCase().replace(' ', '-')}`}>{s.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Spending by Category
            </h2>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
            ) : chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No spending data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 40% 12%)', border: '1px solid hsl(220 30% 20%)', borderRadius: 8 }}
                    labelStyle={{ color: 'hsl(210 20% 94%)' }}
                    formatter={(v: number) => [formatCurrency(v), 'Spent']}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          <motion.div variants={item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Recent Transactions</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-2">
                {recent.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-3 border-b border-border last:border-0" data-testid={`tx-row-${tx.id}`}>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-lg">{txIcon(tx.type)}</div>
                      <div>
                        <p className="text-sm font-medium">{tx.recipient || tx.type}</p>
                        <p className="text-xs text-muted-foreground">{tx.category} · {tx.timestamp ? format(tx.timestamp.toDate(), 'MMM d') : '—'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${tx.type === 'deposit' ? 'text-emerald-400' : txColor(tx.type)}`}>
                        {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      {tx.flagged && <span className="text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">Flagged</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </Layout>
    </ProtectedRoute>
  );
}
