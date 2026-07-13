import { useEffect, useState } from 'react';
import { getAllUsers, parseTimestampToDate, User } from '../../firebase/firestore';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { Users, UserCircle } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { format } from 'date-fns';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="space-y-6" data-testid="admin-users-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold">All Users</h1>
            </div>
            <p className="text-muted-foreground text-sm">Manage all registered accounts</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">User</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Email</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Role</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Balance</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3.5 uppercase tracking-wide">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u, i) => (
                      <motion.tr
                        key={u.uid}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-accent/20 transition-colors"
                        data-testid={`user-row-${u.uid}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={u.photoURL} name={u.name} className="w-9 h-9 rounded-full" />
                            <span className="text-sm font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/20 text-primary'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-medium">{formatCurrency(u.balance)}</td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {u.createdAt ? format(parseTimestampToDate(u.createdAt) ?? new Date(0), 'MMM d, yyyy') : '—'}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">No users found</div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
