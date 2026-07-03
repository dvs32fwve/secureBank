import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTransactions, Transaction } from '../firebase/firestore';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, Building2, Globe } from 'lucide-react';
import { format } from 'date-fns';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function Balance() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserTransactions(user.uid).then(txs => {
      setTransactions(txs);
      setLoading(false);
    });
  }, [user]);

  // Build running balance history
  const balanceHistory = (() => {
    if (!user) return [];
    let runningBalance = user.balance;
    const sorted = [...transactions].reverse();
    const history: { date: string; balance: number }[] = [];
    for (const tx of sorted) {
      const date = tx.timestamp ? format(tx.timestamp.toDate(), 'MMM d') : '';
      if (tx.type === 'deposit') runningBalance += tx.amount;
      else runningBalance -= tx.amount;
      history.push({ date, balance: Math.max(0, runningBalance) });
    }
    history.push({ date: 'Now', balance: user.balance });
    return history;
  })();

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <ProtectedRoute>
      <Layout>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6" data-testid="balance-page">
          <motion.div variants={item}>
            <h1 className="text-2xl font-bold">Account Balance</h1>
            <p className="text-muted-foreground text-sm mt-1">Your detailed financial position</p>
          </motion.div>

          {/* Main Balance */}
          <motion.div variants={item} className="bg-gradient-to-br from-primary/30 via-primary/10 to-card border border-primary/20 rounded-2xl p-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <Wallet className="h-4 w-4" />
              Total Balance
            </div>
            <div className="text-5xl font-bold tracking-tight mb-1" data-testid="text-total-balance">
              {formatCurrency(user?.balance ?? 0)}
            </div>
            <p className="text-sm text-muted-foreground">Last updated just now</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-xl font-semibold text-emerald-400 mt-1">{formatCurrency(user?.balance ?? 0)}</p>
              </div>
              <div className="bg-background/30 rounded-xl p-4">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-semibold mt-1">{formatCurrency(0)}</p>
              </div>
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Building2, label: 'Account Number', value: '**** **** 4532', sub: 'Checking Account' },
              { icon: Globe, label: 'Sort Code', value: '04-32-17', sub: 'SecureBank AI' },
              { icon: Wallet, label: 'IBAN', value: 'US83 0043 2170 0453 2000', sub: 'International' },
            ].map(d => (
              <div key={d.label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                  <d.icon className="h-3.5 w-3.5" />
                  {d.label}
                </div>
                <p className="font-mono font-medium text-sm">{d.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{d.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Balance Chart */}
          <motion.div variants={item} className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">Balance History</h2>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Loading...</div>
            ) : balanceHistory.length < 2 ? (
              <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Make some transactions to see your history</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={balanceHistory}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210,100%,56%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(220 40% 12%)', border: '1px solid hsl(220 30% 20%)', borderRadius: 8 }}
                    formatter={(v: number) => [formatCurrency(v), 'Balance']}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(210,100%,56%)" strokeWidth={2} fill="url(#balanceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </motion.div>
      </Layout>
    </ProtectedRoute>
  );
}
