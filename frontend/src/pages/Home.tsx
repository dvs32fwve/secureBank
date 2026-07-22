import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { LandingHeader } from '../components/LandingHeader';
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
  Monitor,
  ClipboardCheck,
  Eye,
  Sparkles,
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
    'https://www.usbank.com/content/dam/usbank/en/images/photos/personal-banking/photo-smart-rewards-banner-2026-519x519.webp',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9fa8xzRNuSGGQrSmRjwWipPhUmqEEs411E9njlCtAJoj_PMhtCpv-0HK&s=10',
    'https://www.ebankit.com/hs-fs/hubfs/Marketing/1.%20Website%20%3E%202022/2026/ebankIT_Website_Platform_26_One%20platform%20fro%20all%20business%20tiers%201.png?width=527&height=387&name=ebankIT_Website_Platform_26_One%20platform%20fro%20all%20business%20tiers%201.png',
  ];

  const tiles = [
    {
      icon: Globe,
      title: 'Network Banking',
      description: 'Connected accounts, payments, and global access.',
      route: '/network-banking',
    },
    {
      icon: ShieldCheck,
      title: 'Fraud Detection',
      description: 'Real-time threat monitoring with IP-based fraud detection and intelligent alerts.',
      route: '/fraud-detection',
    },
    {
      icon: BarChart3,
      title: 'Spending Insights',
      description: 'Visualize spending habits and savings opportunities.',
      route: '/spending-insights',
    },
    {
      icon: Lock,
      title: 'Security & Privacy',
      description: 'Protect your data with bank-grade security.',
      route: '/security-privacy',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Clear transaction visibility and audit-ready records.',
      route: '/transparency',
    },
    {
      icon: ClipboardCheck,
      title: 'Accountability',
      description: 'Traceable actions and ownership for every event.',
      route: '/accountability',
    },
    {
      icon: Monitor,
      title: 'Monitoring',
      description: 'Continuous platform and activity monitoring.',
      route: '/monitoring',
    },
    {
      icon: Sparkles,
      title: 'CAIGA Framework',
      description: 'Governance, accountability, and intelligence in one model.',
      route: '/caiga-framework',
    },
  ];

  const benefits = [
    'Secure authentication with Google OAuth',
    'Real-time balance and transaction updates',
    'Transparent, IP-based fraud detection',
    'Comprehensive transaction history',
    'Easy peer-to-peer transfers',
    'Multi-card management',
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <LandingHeader />

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
              Banking Made Intelligent
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Powered by CAIGA: Comprehensive Artificial Intelligence Governance Architecture</span>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Experience secure banking governed by the CAIGA framework, with transparent IP-based fraud detection,
              real-time insights, and every decision built on accountability you can trust.
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {tiles.map((tile) => (
              <motion.div
                key={tile.title}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                onClick={() => setLocation(tile.route)}
                role="button"
                tabIndex={0}
                className="cursor-pointer bg-card border border-border rounded-3xl p-8 hover:bg-card/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
                  <tile.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{tile.title}</h3>
                <p className="text-muted-foreground mb-6">{tile.description}</p>
                <div className="inline-flex items-center gap-2 text-primary font-medium">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </div>
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
                Why choose SmartBank?
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
              Join thousands of users who trust SmartBank for their financial needs
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
              <span className="font-bold">SmartBank</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              © 2024 SmartBank. All rights reserved.
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
