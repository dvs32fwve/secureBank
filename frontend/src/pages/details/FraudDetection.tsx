import { PublicPageShell } from '../../components/PublicPageShell';
import { ShieldCheck, AlertTriangle, Lock, Eye } from 'lucide-react';

export default function FraudDetection() {
  return (
    <PublicPageShell
      title="Fraud Detection"
      intro="Learn how SmartBank detects and blocks suspicious activity before it impacts your account."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Real-Time Monitoring</h2>
          <p className="text-muted-foreground mb-4">
            Our fraud detection engine evaluates every transfer, login, and payment across multiple risk signals.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <ShieldCheck className="h-6 w-6 text-primary mt-1" />
              <span>Automated alerts for unusual transactions.</span>
            </li>
            <li className="flex gap-3 items-start">
              <AlertTriangle className="h-6 w-6 text-primary mt-1" />
              <span>Dynamic risk scoring and intelligent review workflows.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Eye className="h-6 w-6 text-primary mt-1" />
              <span>Continuous surveillance of account behavior and activity patterns.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Automatic Risk Controls</h3>
            <p className="text-muted-foreground">Thresholds and policies are built into the transfer flow so suspicious actions are caught early.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Alert Accuracy</h3>
            <p className="text-muted-foreground">SmartBank reduces false positives by focusing only on meaningful risk signals.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Secure Response</h3>
            <p className="text-muted-foreground">When a risk is detected, we protect your account while keeping you informed.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
