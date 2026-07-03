import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { parseTimestampToDate } from '../firebase/firestore';
import { updateUser } from '../firebase/firestore';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';
import { UserCircle, Mail, Calendar, Shield, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setLoading(true);
    try {
      await updateUser(user.uid, { name: name.trim() });
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEditing(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-xl mx-auto space-y-6" data-testid="profile-page">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your account information</p>
          </motion.div>

          {/* Avatar Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-5">
              <Avatar src={user?.photoURL} name={user?.name} className="w-20 h-20 rounded-full ring-4 ring-primary/20" />
              <div>
                <p className="text-lg font-semibold" data-testid="text-username">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className={`inline-block mt-2 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                  user?.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-primary/20 text-primary'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl divide-y divide-border">
            {/* Name */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <UserCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  {editing ? (
                    <input
                      data-testid="input-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="mt-1 bg-muted border border-input rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-0.5">{user?.name}</p>
                  )}
                </div>
              </div>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    data-testid="button-save-name"
                    onClick={handleSave}
                    disabled={loading}
                    className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    data-testid="button-cancel-name"
                    onClick={handleCancel}
                    className="p-1.5 bg-muted hover:bg-accent text-muted-foreground rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  data-testid="button-edit-name"
                  onClick={() => setEditing(true)}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Email */}
            <div className="p-5 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium mt-0.5" data-testid="text-email">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Managed by Google</p>
              </div>
            </div>

            {/* Role */}
            <div className="p-5 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Role</p>
                <p className="text-sm font-medium mt-0.5 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Joined */}
            <div className="p-5 flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Member Since</p>
                <p className="text-sm font-medium mt-0.5">
                  {user?.createdAt ? format(parseTimestampToDate(user.createdAt) ?? new Date(0), 'MMMM d, yyyy') : '—'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
