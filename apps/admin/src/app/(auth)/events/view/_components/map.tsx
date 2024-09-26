import { useContext } from "react";
import { useParams } from "next/navigation";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";

import { Card, CardContent } from "@tribal-cities/ui/card";

import { MapContext } from "~/context/map-context";
import { api } from "~/trpc/react";

export default function Map() {
  const { id } = useParams();
  const { data: ev } = api.event.byId.useQuery({ id: id as string });
  const { pointsRef, mapUrl, mapRef, setCampId, center, panTo } =
    useContext(MapContext);

  if (!mapUrl) return null;

  setCampId(ev?.campId || null);
  panTo(center[0], center[1]);

  return (
    <Card className="h-1/2">
      <CardContent className="h-[50vh]">
        <MapContainer
          ref={mapRef}
          className="h-full w-full"
          center={center}
          zoom={18}
          zoomControl={true}
        >
          <TileLayer url={mapUrl} />
          <FeatureGroup ref={pointsRef}></FeatureGroup>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
