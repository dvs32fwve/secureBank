import { Link } from 'wouter';
import { BookOpen, ChevronRight, ShieldCheck, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const endpoints = [
  {
    method: 'GET',
    path: '/health',
    description: 'Checks if the backend is running.',
  },
  {
    method: 'POST',
    path: '/users',
    description: 'Creates or returns the logged-in user profile.',
  },
  {
    method: 'GET',
    path: '/virtual-card',
    description: 'Returns the current virtual card for the authenticated user.',
  },
  {
    method: 'PATCH',
    path: '/virtual-card',
    description: 'Updates the virtual card status between active and blocked.',
  },
  {
    method: 'POST',
    path: '/transfer',
    description: 'Transfers money to another user by email and creates transaction records.',
  },
];

export default function ApiDocs() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">SecureBank API Docs</p>
              <p className="text-xs text-muted-foreground">Simple developer reference</p>
            </div>
          </div>
          <Link href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/home'}>
            <a className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              {user ? 'Back to dashboard' : 'Back to home'}
              <ChevronRight className="h-4 w-4" />
            </a>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Fast API-style reference
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Simple backend documentation</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            This page gives a lightweight overview of the main backend endpoints used by SecureBank for auth, cards, and money transfers. It is available without signing in.
          </p>
        </section>

        <section className="mt-6 grid gap-4">
          {endpoints.map((endpoint) => (
            <article key={endpoint.path} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {endpoint.method}
                </span>
                <code className="rounded bg-muted px-2.5 py-1 text-sm text-foreground">{endpoint.path}</code>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{endpoint.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Send className="h-4 w-4 text-primary" />
            Example: transfer money
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-background p-4 text-sm">
{`POST /transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientEmail": "user@example.com",
  "amount": 50,
  "category": "Other",
  "note": "Dinner"
}`}
          </pre>
        </section>
      </main>
    </div>
  );
}
