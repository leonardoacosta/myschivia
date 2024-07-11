import type { FeatureCollection } from "geojson";
import { MapContainer, TileLayer } from "react-leaflet";

import { api } from "~/trpc/react";
import FeatureGroupFC from "./feature-group";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function EditControl({ geojson, setGeojson }: Props) {
  const [url] = api.cityPlanning.getGoogleMaps.useSuspenseQuery();
  return (
    <MapContainer
      className="h-full w-full"
      center={[40.776787, -73.968467]}
      zoom={14}
      zoomControl={true}
    >
      <TileLayer url={url} />
      <FeatureGroupFC geojson={geojson} setGeojson={setGeojson} />
    </MapContainer>
  );
}
