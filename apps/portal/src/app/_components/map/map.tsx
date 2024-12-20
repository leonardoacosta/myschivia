import { useContext } from "react";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";

import { MapContext } from "~/context/map-context";

export default function Map() {
  const { pointsRef, mapUrl, mapRef } = useContext(MapContext);

  if (!mapUrl) return null;

  return (
    <MapContainer
      ref={mapRef}
      className="h-full w-full"
      center={[32.973934, -94.599279]}
      zoom={18}
      zoomControl={true}
    >
      <TileLayer url={mapUrl} />
      <FeatureGroup ref={pointsRef}></FeatureGroup>
    </MapContainer>
  );
}
