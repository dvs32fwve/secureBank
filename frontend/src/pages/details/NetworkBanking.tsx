import { PublicPageShell } from '../../components/PublicPageShell';
import { Globe, ServerCog, Users, Database } from 'lucide-react';

export default function NetworkBanking() {
  return (
    <PublicPageShell
      title="Network Banking"
      intro="Discover how SmartBank connects accounts, partners, and services across a secure financial network."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Connected Financial Services</h2>
          <p className="text-muted-foreground mb-4">
            Network Banking brings a unified experience for account holders, payments, and financial insights.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <Globe className="h-6 w-6 text-primary mt-1" />
              <span>Cross-border transfers, payments, and global account access.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Users className="h-6 w-6 text-primary mt-1" />
              <span>Peer-to-peer services and connected customer experiences.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Database className="h-6 w-6 text-primary mt-1" />
              <span>Secure data flows keep your financial profile consistent across sessions.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Scalable Infrastructure</h3>
            <p className="text-muted-foreground">Built to support rapid growth and high-volume transaction processing.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Seamless Access</h3>
            <p className="text-muted-foreground">A single platform experience across web and mobile channels.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Service Ecosystem</h3>
            <p className="text-muted-foreground">Ecosystem integration for payments, accounts, and secure banking services.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
