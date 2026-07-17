import { PublicPageShell } from '../../components/PublicPageShell';
import { BarChart3, PieChart, TrendingUp, DollarSign } from 'lucide-react';

export default function SpendingInsights() {
  return (
    <PublicPageShell
      title="Spending Insights"
      intro="Understand your habits with clear charts, categories, and smarter recommendations."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-4">Clear Spending Breakdown</h2>
          <p className="text-muted-foreground mb-4">
            View your spending across categories, merchants, and time windows so you can make confident financial choices.
          </p>
          <ul className="space-y-3">
            <li className="flex gap-3 items-start">
              <BarChart3 className="h-6 w-6 text-primary mt-1" />
              <span>Category insights for every purchase.</span>
            </li>
            <li className="flex gap-3 items-start">
              <TrendingUp className="h-6 w-6 text-primary mt-1" />
              <span>Trend analysis that highlights opportunities to save.</span>
            </li>
            <li className="flex gap-3 items-start">
              <DollarSign className="h-6 w-6 text-primary mt-1" />
              <span>Budget alerts that keep overspending in check.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Spot Opportunities</h3>
            <p className="text-muted-foreground">Our insights help you identify where you can cut costs and improve savings.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Personalized Views</h3>
            <p className="text-muted-foreground">Easily compare spending across days, weeks, and categories.</p>
          </div>
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-3">Actionable Reporting</h3>
            <p className="text-muted-foreground">Get recommendations that turn raw data into smarter decisions.</p>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
