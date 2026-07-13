import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import {
  Banknote,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  Check,
  BarChart3,
  Lock,
  Smartphone,
  Globe,
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const floatingVariants = {
    floating: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const heroImages = [
    'https://www.collidu.com/media/catalog/product/img/7/9/79edaf0db85981a8f053127a25fead0fd91a960a14ba8b53adfe1b8454fdb0c6/mobile-banking-slide1.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7b0Iw6mhqotl4xbviG9NPvZjy2HVXFdFyDch8-S_R2YSzpgXbS50RRNvR&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR1UxuNWV9OJ5whAa1wii3QEiEmhlQLRs32rKQqYK2Mm3gvH3U0wvsHnH8&s=10',
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'AI Fraud Detection',
      description: 'Real-time transaction monitoring with machine learning',
    },
    {
      icon: Zap,
      title: 'Instant Transfers',
      description: 'Move money to anyone in seconds',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Spending insights and financial trends',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'End-to-end encryption and multi-factor authentication',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Full-featured app works seamlessly on all devices',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Manage your finances from anywhere in the world',
    },
  ];

  const benefits = [
    'Secure authentication with Google OAuth',
    'Real-time balance and transaction updates',
    'Advanced fraud detection algorithms',
    'Comprehensive transaction history',
    'Easy peer-to-peer transfers',
    'Multi-card management',
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-primary/20 p-2 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">SecureBank AI</span>
            </motion.div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setLocation('/features')}
                className="hover:text-primary"
              >
                Features
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
                variant="ghost"
                onClick={() => setLocation('/api-docs')}
                className="hover:text-primary"
              >
                API Docs
              </Button>
              <Button onClick={() => setLocation(user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login')}>
                {user ? 'Dashboard' : 'Sign In'}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                Welcome to the future of banking
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Banking Made{' '}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Intelligent
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Experience secure, AI-powered banking with real-time fraud detection,
              instant transfers, and intelligent spending insights.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setLocation(user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login')}
                className="text-base"
              >
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation('/features')}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent rounded-3xl blur-3xl -z-10" />
            <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border rounded-3xl p-8 sm:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {heroImages.map((src, idx) => (
                  <motion.div
                    key={src}
                    variants={floatingVariants}
                    animate="floating"
                    style={{ animationDelay: `${(idx + 1) * 0.2}s` }}
                    className="rounded-2xl overflow-hidden border border-border bg-card"
                  >
                    <img
                      src={src}
                      alt={`Hero ${idx + 1}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover block"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern, secure banking
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-card border border-border rounded-2xl p-8 hover:bg-card/80 transition-colors"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Why choose SecureBank?
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-primary/10 rounded-full p-1">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg text-muted-foreground">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
              <div className="relative bg-card border border-border rounded-3xl p-12">
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Real-time Analytics</p>
                      <p className="text-sm text-muted-foreground">
                        Track your spending instantly
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Advanced Security</p>
                      <p className="text-sm text-muted-foreground">
                        Protection you can trust
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Zap className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Lightning Fast</p>
                      <p className="text-sm text-muted-foreground">
                        Instant transactions anytime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust SecureBank for their financial needs
            </p>
            <Button
              size="lg"
              onClick={() => setLocation('/login')}
              className="text-base"
            >
              Open Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Banknote className="h-6 w-6 text-primary" />
              <span className="font-bold">SecureBank AI</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              © 2024 SecureBank AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setLocation('/features')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Features
              </button>
              <button
                onClick={() => setLocation('/about')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                About
              </button>
              <button
                onClick={() => setLocation('/login')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
