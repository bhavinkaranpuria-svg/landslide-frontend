import { MapView } from "@/components/map/map-view"

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ district?: string }>
}) {
  const { district } = await searchParams

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">GIS Risk Map</h1>
        <p className="text-sm text-muted-foreground">Vulnerable roads, villages & infrastructure</p>
      </div>
      <MapView initialDistrict={district} />
    </div>
  )
}
