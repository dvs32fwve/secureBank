import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Banknote, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/dashboard');
      }
    }
  }, [user, setLocation]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    { icon: ShieldCheck, label: 'AI Fraud Detection', desc: 'Real-time transaction monitoring' },
    { icon: Zap, label: 'Instant Transfers', desc: 'Move money in seconds' },
    { icon: TrendingUp, label: 'Spending Insights', desc: 'Smart analytics dashboard' },
  ];

  return (
    <div className="min-h-screen bg-background flex" data-testid="login-page">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-primary/5 to-background flex-col justify-between p-12 border-r border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Banknote className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SmartBank</span>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Banking built for<br />
            <span className="text-primary">the digital age</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Intelligent financial management with AI-powered fraud detection, real-time insights, and seamless transfers.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4 bg-card/50 border border-border rounded-xl p-4"
            >
              <div className="bg-primary/10 p-2 rounded-lg">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">SmartBank</span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to access your account</p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3 mb-6">
                {error}
              </div>
            )}

            <button
              data-testid="button-google-signin"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed border border-gray-200"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Protected by 256-bit SSL encryption
          </p>
        </motion.div>
      </div>
    </div>
  );
}
