import { PublicPageShell } from '../../components/PublicPageShell';
import { ArrowRightCircle, Eye, ClipboardCheck, BarChart3, ShieldCheck } from 'lucide-react';

const principleMap = [
  {
    principle: 'Transparency',
    description:
      'SmartBank tells customers whenever a transaction is checked against fraud rules and IP-based signals so no action happens invisibly.',
    feature: 'Clear, immediate fraud check notifications and IP-based alert explanations',
    icon: Eye,
  },
  {
    principle: 'Explainability',
    description:
      'Every flagged transaction includes a specific plain language reason, not a vague label, including why an unusual IP pattern triggered review.',
    feature:
      'Detailed explanations that say the transfer exceeded the limit or matched an unusual IP pattern, not that the activity was simply suspicious',
    icon: ArrowRightCircle,
  },
  {
    principle: 'Accountability',
    description:
      'SmartBank keeps audit logs for every fraud event so administrators can trace which rule triggered a decision.',
    feature: 'Traceable flagged transaction records and review histories',
    icon: ClipboardCheck,
  },
  {
    principle: 'Monitoring',
    description:
      'The platform is watched continuously so administrators can spot rule patterns before customers complain.',
    feature: 'Live dashboards for flagged transactions and transaction activity',
    icon: BarChart3,
  },
  {
    principle: 'Security & Privacy',
    description:
      'Customer data is protected with Firebase Authentication and role based access, while sensitive details remain masked by default.',
    feature: 'Verified user access, admin permissions, and masked sensitive data',
    icon: ShieldCheck,
  },
];

export default function CaigaFramework() {
  return (
    <PublicPageShell
      title="CAIGA Framework"
      intro="SmartBank is built on CAIGA, the Comprehensive Artificial Intelligence Governance Architecture. Every intelligent feature is designed from the ground up with governance in mind so customers can trust decisions and administrators can verify them."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-semibold">CAIGA in motion</h2>
                <p className="text-sm text-muted-foreground">A visual map of how governance turns into visible banking protection.</p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-border/70 bg-background/70 p-4">
              <svg viewBox="0 0 640 260" className="w-full h-auto" role="img" aria-label="Three tier governance structure showing Rules, Oversight, and Audit">
                <rect x="40" y="30" width="180" height="90" rx="24" fill="#111827" />
                <rect x="230" y="30" width="180" height="90" rx="24" fill="#1f2937" />
                <rect x="420" y="30" width="180" height="90" rx="24" fill="#111827" />
                <circle cx="130" cy="160" r="30" fill="#0f766e" />
                <circle cx="320" cy="160" r="30" fill="#0f766e" />
                <circle cx="510" cy="160" r="30" fill="#0f766e" />
                <path d="M130 190 L130 231" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                <path d="M320 190 L320 231" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                <path d="M510 190 L510 231" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                <rect x="70" y="231" width="120" height="40" rx="16" fill="#0f172a" />
                <rect x="260" y="231" width="120" height="40" rx="16" fill="#0f172a" />
                <rect x="450" y="231" width="120" height="40" rx="16" fill="#0f172a" />
                <path d="M220 75 L230 75" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M410 75 L420 75" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M130 110 L130 130" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M320 110 L320 130" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M510 110 L510 130" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M130 130 L320 130" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M320 130 L510 130" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <text x="130" y="80" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="600">Rules</text>
                <text x="320" y="80" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="600">Oversight</text>
                <text x="510" y="80" textAnchor="middle" fill="#f8fafc" fontSize="20" fontWeight="600">Audit</text>
                <text x="130" y="248" textAnchor="middle" fill="#f8fafc" fontSize="14">Policy checks</text>
                <text x="320" y="248" textAnchor="middle" fill="#f8fafc" fontSize="14">Review &amp; control</text>
                <text x="510" y="248" textAnchor="middle" fill="#f8fafc" fontSize="14">Traceable evidence</text>
              </svg>
            </div>

            <p className="text-muted-foreground mt-6">
              SmartBank turns CAIGA into a visible loop: rules decide, oversight reviews, and audit records keep the whole process accountable.
            </p>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <ArrowRightCircle className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Why this matters</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Customers see when transactions are reviewed and why.</li>
              <li>Administrators can verify every fraud rule decision.</li>
              <li>Governance stays active through monitoring and review, not only after a complaint.</li>
            </ul>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6">The Five CAIGA Principles</h2>

          <div className="mb-6 overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-primary/10 via-background to-background p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/20 bg-background/80 p-4">
                <p className="text-sm font-semibold text-primary">Principle mapping</p>
                <p className="text-sm text-muted-foreground mt-2">Transparency, explainability, accountability, monitoring, and security & privacy are expressed through visible system behavior.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                <p className="text-sm font-semibold text-foreground">How it appears in the product</p>
                <p className="text-sm text-muted-foreground mt-2">Customers receive notices, admins review flagged events, and audit trails support every governance decision.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {principleMap.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.principle} className="grid gap-4 sm:grid-cols-[auto_1fr] items-start rounded-3xl border border-border/70 bg-background/80 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{item.principle}</h3>
                      <span className="text-xs uppercase tracking-[0.18em] text-primary/80">CAIGA</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    <p className="text-sm font-semibold text-foreground">SmartBank feature: {item.feature}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-card border border-border rounded-3xl p-8">
        <h2 className="text-3xl font-semibold mb-4">Why this matters for SmartBank</h2>
        <p className="text-muted-foreground mb-4">
          Fraud detection in SmartBank is rule based, not a black box model. It combines rule checks with IP-based signals so every decision can be traced back to a specific human readable reason. Customers see the reason, and regulators can inspect the process.
        </p>
        <p className="text-muted-foreground">
          This makes SmartBank a clear example of governed AI in a real banking context, not just a compliance checkbox.
        </p>
      </div>
    </PublicPageShell>
  );
}
