import { PublicPageShell } from '../../components/PublicPageShell';
import { Monitor, Clock, Activity, Bell } from 'lucide-react';

export default function Monitoring() {
  return (
    <PublicPageShell
      title="Monitoring"
      intro="Learn how SmartBank keeps watch over your account and transaction activity in real time."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Continuous Watch</h2>
          <p className="text-muted-foreground mb-4">
            Monitoring is built into every layer of the platform so abnormal behavior is identified quickly.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <Monitor className="h-6 w-6 text-primary mt-1" />
              <span>Real-time telemetry across transactions and sessions.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Activity className="h-6 w-6 text-primary mt-1" />
              <span>Performance and behavior metrics for security and reliability.</span>
            </li>
            <li className="flex gap-3 items-start">
              <Bell className="h-6 w-6 text-primary mt-1" />
              <span>Alerts and notifications for important events.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Activity Insights</h3>
            <p className="text-muted-foreground">Get visibility into transaction velocity, login patterns, and system health.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Alerting</h3>
            <p className="text-muted-foreground">Notifications help admins stay on top of key changes and risks.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Continuous Review</h3>
            <p className="text-muted-foreground">Monitoring supports ongoing operational visibility and response.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
