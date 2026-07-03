import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import {
  Banknote,
  Users,
  Target,
  Heart,
  Globe,
  Award,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

export default function About() {
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

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make is guided by what\'s best for our customers and their financial wellbeing.',
    },
    {
      icon: Target,
      title: 'Security',
      description: 'We employ industry-leading security measures to protect your data and transactions at all times.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We continuously innovate to bring cutting-edge features and improvements to our platform.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards of quality in everything we do and deliver.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', delay: 0 },
    { number: '$500M+', label: 'Transactions', delay: 0.1 },
    { number: '99.9%', label: 'Uptime', delay: 0.2 },
    { number: '24/7', label: 'Support', delay: 0.3 },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'SecureBank Founded',
      description: 'Founded with a mission to revolutionize digital banking with AI-powered security.',
    },
    {
      year: '2023',
      title: 'Beta Launch',
      description: 'Launched closed beta with initial features and gathered community feedback.',
    },
    {
      year: '2024',
      title: 'Public Launch',
      description: 'Officially launched to the public with full feature set and security protocols.',
    },
    {
      year: '2024',
      title: 'Expansion',
      description: 'Expanded user base to 10,000+ users and processed over $500M in transactions.',
    },
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
            <motion.button
              onClick={() => setLocation('/home')}
              className="flex items-center gap-3 hover:opacity-80 transition"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-primary/20 p-2 rounded-lg">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">SecureBank AI</span>
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
                onClick={() => setLocation('/contact')}
                className="hover:text-primary"
              >
                Contact
              </Button>
              <Button onClick={() => setLocation(user ? '/dashboard' : '/login')}>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Reimagining Banking
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                with AI Technology
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the future of banking with intelligent technology, world-class security, and a customer-first approach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At SecureBank, we believe that banking should be secure, intelligent, and accessible to everyone. Our mission is to democratize financial technology and empower individuals to take control of their financial lives.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're committed to combining cutting-edge AI technology with unwavering security standards to create a banking experience that's faster, smarter, and more secure than traditional banking.
              </p>
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
                <Globe className="h-16 w-16 text-primary mb-6" />
                <p className="text-xl font-semibold mb-3">Global Impact</p>
                <p className="text-muted-foreground">
                  Serving customers worldwide with a platform that transcends geographic boundaries and financial limitations.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">By the Numbers</h2>
            <p className="text-lg text-muted-foreground">
              Trusted by thousands and growing every day
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-card border border-border rounded-2xl p-8 text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              Principles that guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="bg-card border border-border rounded-2xl p-8 hover:bg-card/80 transition-colors group"
              >
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition">
                  <value.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground">
              How SecureBank has evolved since day one
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex gap-6 md:gap-12 items-start"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0"
                  >
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </motion.div>
                  {index < timeline.length - 1 && (
                    <div className="w-1 h-16 bg-gradient-to-b from-primary/50 to-primary/10 mt-4" />
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <div className="text-primary font-bold text-lg mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Dedicated Team</h2>
            <p className="text-lg text-muted-foreground">
              Talented individuals united by a shared vision
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-12 text-center"
          >
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Expert Team</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our team consists of experienced software engineers, security experts, financial analysts, and product designers who are passionate about creating the best banking experience possible.
            </p>
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
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of the banking revolution. Start your journey with SecureBank today.
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
              <span className="font-bold">SecureBank AI</span>
            </motion.button>
            <p className="text-sm text-muted-foreground">
              © 2024 SecureBank AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => setLocation('/')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Home
              </button>
              <button
                onClick={() => setLocation('/features')}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                Features
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
