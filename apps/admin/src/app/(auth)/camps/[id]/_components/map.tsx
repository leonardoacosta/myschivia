import { useContext } from "react";
import { useParams } from "next/navigation";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";

import { Card, CardContent, CardHeader } from "@tribal-cities/ui/card";

import { MapContext } from "~/context/map-context";
import { api } from "~/trpc/react";

export default function Map() {
  const { id } = useParams();
  const { data: camp } = api.camp.byId.useQuery({ id: id as string });
  const { pointsRef, mapUrl, mapRef, setCampId, center, panTo } =
    useContext(MapContext);

  if (!mapUrl) return null;
  if (!camp?.id) {
    return (
      <Card className="h-[50vh] p-6 lg:col-span-2">
        <CardHeader>
          <h3 className="text-xl font-bold">No site assigned</h3>
        </CardHeader>
        <CardContent className="h-full">
          <p className="mb-6">This camp has no assigned site.</p>
        </CardContent>
        <CardContent className="h-full"></CardContent>
      </Card>
    );
  }

  setCampId(camp?.id || null);
  panTo(center[0], center[1]);

  return (
    <Card className="p-6 lg:col-span-2">
      <CardHeader>
        <h3 className="text-xl font-bold">Where is this camp?</h3>
      </CardHeader>
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
