import { AlertsFeed } from "@/components/alerts/alerts-feed"

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">Early Warning Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Automated SMS, app & siren dispatch to authorities and communities
        </p>
      </div>
      <AlertsFeed />
    </div>
  )
}
