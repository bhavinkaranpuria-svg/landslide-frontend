"use client"

import { useEffect, useMemo } from "react"
import { CircleMarker, Circle, MapContainer, Polyline, TileLayer, Tooltip, useMap } from "react-leaflet"
import { districts, infrastructure, riskZones, roads, REGION_CENTER } from "@/lib/data"
import { riskHex, roadHex } from "@/lib/risk"
import type { AssetType, RiskLevel } from "@/lib/types"

interface RiskMapProps {
  focusDistrict?: string
  showZones: boolean
  showRoads: boolean
  showAssets: boolean
}

function FlyToDistrict({ districtId }: { districtId?: string }) {
  const map = useMap()
  useEffect(() => {
    if (!districtId) return
    const d = districts.find((x) => x.id === districtId)
    if (d) map.flyTo(d.center, 12, { duration: 1.1 })
  }, [districtId, map])
  return null
}

const assetGlyph: Record<AssetType, string> = {
  village: "V",
  hospital: "H",
  school: "S",
  bridge: "B",
  shelter: "R",
}

export default function RiskMap({ focusDistrict, showZones, showRoads, showAssets }: RiskMapProps) {
  const center = useMemo(() => {
    const d = focusDistrict ? districts.find((x) => x.id === focusDistrict) : undefined
    return d ? d.center : REGION_CENTER
  }, [focusDistrict])

  return (
    <MapContainer
      center={center}
      zoom={focusDistrict ? 12 : 9}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap &middot; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />

      {showZones &&
        riskZones.map((z) => (
          <Circle
            key={z.id}
            center={z.center}
            radius={z.radius}
            pathOptions={{
              color: riskHex[z.riskLevel],
              fillColor: riskHex[z.riskLevel],
              fillOpacity: 0.28,
              weight: 1.5,
            }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              <span className="text-xs font-semibold capitalize">
                {z.riskLevel} risk · {z.riskScore}/100
              </span>
            </Tooltip>
          </Circle>
        ))}

      {showRoads &&
        roads.map((r) => (
          <Polyline
            key={r.id}
            positions={r.path}
            pathOptions={{
              color: roadHex[r.status],
              weight: 5,
              opacity: 0.9,
              dashArray: r.status === "restricted" ? "8 6" : undefined,
            }}
          >
            <Tooltip sticky>
              <div className="text-xs">
                <p className="font-semibold">{r.name}</p>
                <p className="capitalize text-muted-foreground">
                  {r.status} — {r.note}
                </p>
              </div>
            </Tooltip>
          </Polyline>
        ))}

      {showAssets &&
        infrastructure.map((a) => (
          <CircleMarker
            key={a.id}
            center={a.position}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: riskHex[a.riskLevel as RiskLevel],
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              <div className="text-xs">
                <p className="font-semibold">
                  {assetGlyph[a.type]} · {a.name}
                </p>
                <p className="capitalize text-muted-foreground">
                  {a.type}
                  {a.people ? ` · ${a.people.toLocaleString()} people` : ""}
                </p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      <FlyToDistrict districtId={focusDistrict} />
    </MapContainer>
  )
}
