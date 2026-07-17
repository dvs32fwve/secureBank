import { PublicPageShell } from '../../components/PublicPageShell';
import { Eye, FileText, Layers, Clock } from 'lucide-react';

export default function Transparency() {
  return (
    <PublicPageShell
      title="Transparency"
      intro="SmartBank makes it easy to understand your financial activity with clear records and honest controls."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Clear Records</h2>
          <p className="text-muted-foreground mb-4">
            Every transfer, balance update, and account action is logged with clarity and context.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <Eye className="h-6 w-6 text-primary mt-1" />
              <span>Transparent transaction history for users and admins.</span>
            </li>
            <li className="flex gap-3 items-start">
              <FileText className="h-6 w-6 text-primary mt-1" />
              <span>Readable details for every financial event.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Layers className="h-6 w-6 text-primary mt-1" />
              <span>Clear policy and process visibility across the platform.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Audit Ready</h3>
            <p className="text-muted-foreground">Built-in logs and dashboards make auditing faster and simpler.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Honest Insights</h3>
            <p className="text-muted-foreground">No hidden fees, no misleading statements — just accurate data.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Open Controls</h3>
            <p className="text-muted-foreground">Access and permissions are visible and easy to understand.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
