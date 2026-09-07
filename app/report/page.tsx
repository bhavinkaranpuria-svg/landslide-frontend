import { ReportFlow } from "@/components/report/report-flow"

export default function ReportPage() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">Field Reporting</h1>
        <p className="text-sm text-muted-foreground">
          Report cracks, slope movement & blocked roads — works offline
        </p>
      </div>
      <ReportFlow />
    </div>
  )
}
