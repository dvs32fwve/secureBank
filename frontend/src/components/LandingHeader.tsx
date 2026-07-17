import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { Banknote } from 'lucide-react';

export function LandingHeader() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.button
            onClick={() => setLocation('/home')}
            className="flex items-center gap-3 hover:opacity-80 transition"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-primary/20 p-2 rounded-lg">
              <Banknote className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">SmartBank</span>
          </motion.button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setLocation('/home')}
              className="hover:text-primary"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/features')}
              className="hover:text-primary"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/caiga-framework')}
              className="hover:text-primary"
            >
              CAIGA
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/about')}
              className="hover:text-primary"
            >
              About
            </Button>
            <Button
              variant="ghost"
              onClick={() => setLocation('/contact')}
              className="hover:text-primary"
            >
              Contact
            </Button>
            <Button
              onClick={() => setLocation(user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login')}
            >
              {user ? 'Dashboard' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
