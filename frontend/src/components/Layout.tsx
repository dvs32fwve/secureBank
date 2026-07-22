import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  List, 
  UserCircle, 
  CreditCard, 
  ShoppingBag,
  Users, 
  ShieldAlert,
  BarChart3,
  LogOut,
  Menu,
  X,
  Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientIp, setClientIp] = useState('Resolving…');

  const customerLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/balance', label: 'Balance', icon: Wallet },
    { href: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
    { href: '/transactions', label: 'Transactions', icon: List },
    { href: '/card', label: 'Virtual Card', icon: CreditCard },
    { href: '/store', label: 'Demo Store', icon: ShoppingBag },
    { href: '/profile', label: 'Profile', icon: UserCircle },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { href: '/admin/governance', label: 'Governance', icon: BarChart3 },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/transactions', label: 'All Transactions', icon: ShieldAlert },
  ];

  const links = user?.role === 'admin' ? [...customerLinks, ...adminLinks] : customerLinks;

  useEffect(() => {
    let ignore = false;

    const loadClientIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('Unable to resolve IP');
        const data = await response.json();
        if (!ignore) {
          setClientIp(typeof data?.ip === 'string' ? data.ip : 'Unavailable');
        }
      } catch {
        if (!ignore) {
          setClientIp('Unavailable');
        }
      }
    };

    loadClientIp();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setLocation('/login');
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      <Link href="/home" className="p-6 flex items-center gap-3 border-b border-sidebar-border hover:bg-sidebar-accent/40 transition-colors">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Banknote className="h-6 w-6 text-primary" />
        </div>
        <span className="font-bold text-xl tracking-tight">SmartBank</span>
      </Link>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {links.map((link) => {
          const isActive = location === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <link.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <Avatar src={user?.photoURL} name={user?.name} className="w-10 h-10 rounded-full bg-sidebar-accent" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
        <p className="px-4 pt-1 text-[11px] text-sidebar-foreground/45 break-all">IP: {clientIp}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Sidebar Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-30 flex items-center justify-between px-4">
        <Link href="/home" className="flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">SmartBank</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-sidebar-foreground">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 bg-sidebar z-50 shadow-xl"
            >
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-sidebar-foreground/50 hover:text-sidebar-foreground"
              >
                <X className="h-6 w-6" />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full md:w-auto pt-16 md:pt-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
