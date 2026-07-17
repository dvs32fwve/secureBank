import { PublicPageShell } from '../../components/PublicPageShell';
import { Shield, Lock, Key, CircleCheck } from 'lucide-react';

export default function SecurityPrivacy() {
  return (
    <PublicPageShell
      title="Security & Privacy"
      intro="See how SmartBank protects your data and secures every transaction with best-in-class controls."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Privacy by Design</h2>
          <p className="text-muted-foreground mb-4">
            Your personal and financial information is protected with strict privacy controls and encrypted storage.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <span>Secure authentication and encrypted data flows.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Lock className="h-6 w-6 text-primary mt-1" />
              <span>Account access is protected with multi-factor authentication.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Key className="h-6 w-6 text-primary mt-1" />
              <span>Encryption and access controls keep your information private.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Encrypted Transfers</h3>
            <p className="text-muted-foreground">All transfers are encrypted end-to-end for maximum safety.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Data Integrity</h3>
            <p className="text-muted-foreground">Your transaction history and profile data remain tamper-proof and consistent.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
            <p className="text-muted-foreground">SmartBank enforces privacy controls across every login and action.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
