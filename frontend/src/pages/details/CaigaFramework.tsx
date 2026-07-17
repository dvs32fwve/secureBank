import { PublicPageShell } from '../../components/PublicPageShell';
import { ArrowRightCircle, Eye, ClipboardCheck, BarChart3, ShieldCheck } from 'lucide-react';

const principleMap = [
  {
    principle: 'Transparency',
    description:
      'SmartBank tells customers whenever a transaction is checked against fraud rules so no action happens invisibly.',
    feature: 'Clear, immediate fraud check notifications and alert explanations',
    icon: Eye,
  },
  {
    principle: 'Explainability',
    description:
      'Every flagged transaction includes a specific plain language reason, not a vague label.',
    feature:
      'Detailed explanations that say the transfer exceeded the limit, not that the activity was simply suspicious',
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
            <h2 className="text-3xl font-semibold mb-4">What makes CAIGA different?</h2>
            <p className="text-muted-foreground mb-4">
              Most banking apps treat fraud checks and spending analysis as invisible background logic. A transaction either goes through or is blocked with little explanation for the customer or oversight for staff.
            </p>
            <p className="text-muted-foreground mb-4">
              SmartBank takes a different approach. Fraud Detection and Spending Insights are built around CAIGA's five governance principles. This means the system is not just smart, it is governed.
            </p>
            <p className="text-muted-foreground">
              That makes SmartBank a concrete example of governed AI in practice: decisions are traceable, explainable, and open to review, not just automated.
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
          Fraud detection in SmartBank is rule based, not a black box model. That means every decision can be traced back to a specific human readable rule. Customers see the reason, and regulators can inspect the process.
        </p>
        <p className="text-muted-foreground">
          This makes SmartBank a clear example of governed AI in a real banking context, not just a compliance checkbox.
        </p>
      </div>
    </PublicPageShell>
  );
}
