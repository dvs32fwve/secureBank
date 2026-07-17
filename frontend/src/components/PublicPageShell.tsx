import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { LandingHeader } from './LandingHeader';
import { Banknote, ArrowRight } from 'lucide-react';

interface PublicPageShellProps {
  title: string;
  intro: string;
  children: ReactNode;
}

export function PublicPageShell({ title, intro, children }: PublicPageShellProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <LandingHeader />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              In-depth platform insights
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{intro}</p>
          </div>

          {children}
        </div>
      </main>

      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Banknote className="h-6 w-6 text-primary" />
            <span className="font-bold">SmartBank</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 SmartBank. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => setLocation('/features')}
              className="hover:text-foreground transition"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => setLocation('/about')}
              className="hover:text-foreground transition"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setLocation('/contact')}
              className="hover:text-foreground transition"
            >
              Contact
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
