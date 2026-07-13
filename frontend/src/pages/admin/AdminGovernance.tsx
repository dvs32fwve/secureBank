import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { getAuditStats } from '../../firebase/firestore';

export default function AdminGovernance() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAuditStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Governance & Monitoring</h1>
            <p className="text-muted-foreground text-sm">Overview of flagged transactions and audit statistics</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/10">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-semibold">{stats.totalTransactions}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/10">
                  <p className="text-sm text-muted-foreground">Flagged Transactions</p>
                  <p className="text-2xl font-semibold">{stats.flaggedCount}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/10">
                  <p className="text-sm text-muted-foreground">Flagged %</p>
                  <p className="text-2xl font-semibold">{stats.flaggedPercentage}%</p>
                </div>

                <div className="sm:col-span-2 bg-card/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Flagged by Category</p>
                  {Object.keys(stats.flaggedByCategory || {}).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No flagged categories</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(stats.flaggedByCategory).map(([cat, cnt]) => (
                        <div key={cat} className="flex items-center justify-between">
                          <span className="text-sm">{cat}</span>
                          <span className="font-medium">{cnt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-card/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Flagged by Amount Range</p>
                  {Object.entries(stats.flaggedByAmountRanges || {}).map(([range, cnt]) => (
                    <div key={range} className="flex items-center justify-between">
                      <span className="text-sm">{range}</span>
                      <span className="font-medium">{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground">No data</div>
            )}
          </div>
        </motion.div>
      </Layout>
    </ProtectedRoute>
  );
}
