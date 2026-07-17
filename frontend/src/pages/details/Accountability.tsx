import { PublicPageShell } from '../../components/PublicPageShell';
import { CheckCircle2, ClipboardCheck, Users, ShieldCheck } from 'lucide-react';

export default function Accountability() {
  return (
    <PublicPageShell
      title="Accountability"
      intro="See how SmartBank holds every action accountable with audit trails and clear ownership."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Traceable Actions</h2>
          <p className="text-muted-foreground mb-4">
            Every login, transfer, and profile update is tracked so users and administrators can always understand what happened.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <ClipboardCheck className="h-6 w-6 text-primary mt-1" />
              <span>Detailed records of who did what and when.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Users className="h-6 w-6 text-primary mt-1" />
              <span>Clear ownership for every account and transaction event.</span>
            </li>
            <li className="flex gap-3 items-start">
              <ShieldCheck className="h-6 w-6 text-primary mt-1" />
              <span>Accountability supports security and compliance across the platform.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Audit Trails</h3>
            <p className="text-muted-foreground">The platform preserves full audit histories for key actions and decisions.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Control Ownership</h3>
            <p className="text-muted-foreground">Every policy and change is tied to a responsible role or user.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Aligned Governance</h3>
            <p className="text-muted-foreground">Our approach ensures policy compliance is visible and enforceable.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
