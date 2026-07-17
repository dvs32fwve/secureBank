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
  Lock,
  Smartphone,
  Globe,
  BarChart3,
  Bell,
  Users,
  Zap as Lightning,
  Shield,
  Eye,
  Cpu,
  ArrowRight,
  ClipboardCheck,
} from 'lucide-react';

export default function Features() {
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

  const detailedFeatures = [
    {
      icon: ShieldCheck,
      title: 'AI Fraud Detection',
      description:
        'Smart, rule-based transaction monitoring checks every transfer in real time, flagging unusual activity with clear, transparent limits and a plain-language reason for every decision.',
      details: [
        'Real-time transaction analysis',
        'Transparent, rule-based limit checks',
        'Instant alerts with clear explanations',
        '24/7 monitoring dashboard for admins',
      ],
    },
    {
      icon: ClipboardCheck,
      title: 'CAIGA Governance',
      description:
        'SmartBank’s intelligent features are built on five core governance principles so every automated decision can be trusted and verified.',
      details: [
        'Transparency in every alert',
        'Explainable, rule-based decisions',
        'Full audit accountability',
        'Continuous monitoring',
        'Secure by design',
      ],
    },
    {
      icon: Lightning,
      title: 'Instant Transfers',
      description: 'Send money to anyone, anywhere, instantly. No waiting periods, no hidden fees, just fast and secure transfers.',
      details: [
        'Peer-to-peer transfers',
        'Zero processing time',
        'Multiple recipient support',
        'Transfer history tracking',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Get intelligent insights into your spending patterns, budget recommendations, and financial health metrics.',
      details: [
        'Spending categories',
        'Budget recommendations',
        'Trend analysis',
        'Financial reports',
      ],
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description: 'Military-grade encryption and multi-factor authentication keep your account and funds completely secure.',
      details: [
        'End-to-end encryption',
        'Multi-factor authentication',
        'Biometric login',
        'Session management',
      ],
    },
    {
      icon: Smartphone,
      title: 'Mobile First Design',
      description: 'Beautifully designed for mobile with full functionality available on your smartphone or tablet.',
      details: [
        'Responsive interface',
        'Touch-optimized controls',
        'Offline capabilities',
        'App notifications',
      ],
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Manage your finances from anywhere in the world with consistent, high-performance access.',
      details: [
        'International support',
        'Multi-currency support',
        'Global transactions',
        '99.9% uptime SLA',
      ],
    },
    {
      icon: BarChart3,
      title: 'Financial Insights',
      description: 'Detailed charts, graphs, and reports help you understand your financial situation better.',
      details: [
        'Monthly summaries',
        'Comparative analytics',
        'Goal tracking',
        'Export reports',
      ],
    },
    {
      icon: Users,
      title: 'Card Management',
      description: 'Manage multiple cards, set spending limits, and control access all from one dashboard.',
      details: [
        'Multiple cards',
        'Spending limits',
        'Card freezing',
        'Transaction controls',
      ],
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Stay informed with intelligent notifications about transactions, security alerts, and financial events.',
      details: [
        'Real-time alerts',
        'Customizable notifications',
        'Email notifications',
        'In-app alerts',
      ],
    },
  ];

  const advantages = [
    {
      number: '01',
      title: 'Secure Authentication',
      description: 'Sign in with Google OAuth for seamless and secure access to your account.',
    },
    {
      number: '02',
      title: 'Real-Time Updates',
      description: 'All balances, transactions, and alerts update instantly across all your devices.',
    },
    {
      number: '03',
      title: 'Advanced Encryption',
      description: 'Your data is protected with industry-leading encryption standards.',
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <LandingHeader />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              Comprehensive Banking Suite
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Manage Your Finances
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our powerful suite of tools designed to make banking easier,
              safer, and smarter.
            </p>
          </motion.div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 mb-16">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold mb-3">Powered by CAIGA</h2>
                <p className="text-muted-foreground max-w-3xl">
                  Every feature on this page is governed by the Comprehensive Artificial Intelligence
                  Governance Architecture, ensuring transactions are transparent, explainable,
                  accountable, monitored, and secure.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation('/caiga-framework')}
                className="w-full lg:w-auto"
              >
                Learn more about CAIGA →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {detailedFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-card border border-border rounded-2xl p-8 hover:bg-card/80 transition-colors group"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>

                <motion.ul
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  {feature.details.map((detail, i) => (
                    <motion.li
                      key={detail}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {detail}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Key Advantages</h2>
            <p className="text-lg text-muted-foreground">
              What sets us apart from other banking solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-2xl p-8">
                  <div className="text-6xl font-bold text-primary/20 mb-4">
                    {advantage.number}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{advantage.title}</h3>
                  <p className="text-muted-foreground">{advantage.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why SmartBank?</h2>
            <p className="text-lg text-muted-foreground">
              Compare our features with other banking solutions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Banknote className="h-5 w-5 text-primary" />
                        SmartBank
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
                      Traditional Banks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'AI Fraud Detection', smartbank: true, traditional: false },
                    { feature: 'Real-time Transfers', smartbank: true, traditional: false },
                    { feature: 'Mobile-First Design', smartbank: true, traditional: false },
                    { feature: '24/7 Access', smartbank: true, traditional: false },
                    { feature: 'Low Fees', smartbank: true, traditional: false },
                    { feature: 'Spending Analytics', smartbank: true, traditional: false },
                  ].map((item, index) => (
                    <motion.tr
                      key={item.feature}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="border-b border-border hover:bg-card/50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {item.smartbank ? (
                          <Shield className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        {item.traditional ? (
                          <Shield className="h-5 w-5 mx-auto" />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Experience the difference today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users enjoying secure, intelligent banking
            </p>
            <Button
              size="lg"
              onClick={() => setLocation('/login')}
              className="text-base"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <motion.button
              onClick={() => setLocation('/')}
              className="flex items-center gap-2 hover:opacity-80 transition"
              whileHover={{ scale: 1.05 }}
            >
              <Banknote className="h-6 w-6 text-primary" />
              <span className="font-bold">SmartBank</span>
            </motion.button>
            <p className="text-sm text-muted-foreground">
              © 2024 SmartBank. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setLocation('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Home
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
