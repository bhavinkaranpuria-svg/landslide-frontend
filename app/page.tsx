import { StatCards } from "@/components/dashboard/stat-cards"
import { RegionRiskGauge } from "@/components/dashboard/region-risk-gauge"
import { ForecastChart } from "@/components/dashboard/forecast-chart"
import { DistrictRiskList } from "@/components/dashboard/district-risk-list"
import { RoadStatus } from "@/components/dashboard/road-status"
import { ResponsePriority } from "@/components/dashboard/response-priority"
import { DataSources } from "@/components/dashboard/data-sources"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <StatCards />
      <RegionRiskGauge />
      <DistrictRiskList />
      <ForecastChart />
      <div className="grid grid-cols-1 gap-4">
        <RoadStatus />
        <ResponsePriority />
      </div>
      <DataSources />
    </div>
  )
}
