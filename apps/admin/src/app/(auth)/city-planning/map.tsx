import type { Feature } from "geojson";
import { useContext, useRef } from "react";
import * as L from "leaflet";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { toast } from "@tribal-cities/ui/toast";

import { MapContext } from "~/context/map-context";
import { api } from "~/trpc/react";

export default function Map() {
  const { pointsRef, mapUrl, mapRef } = useContext(MapContext);
  const sending = useRef(false);

  const utils = api.useUtils();
  const { mutate: add } = api.cityPlanning.addZone.useMutation({});
  const { mutate: save } = api.cityPlanning.saveZones.useMutation();

  const handleCreate = (e: L.DrawEvents.Created) => {
    let layerType = "";
    switch (e.layerType) {
      case "circle":
        layerType = "Point";
        break;
      case "rectangle":
        layerType = "Polygon";
        break;
      case "polygon":
        layerType = "Polygon";
        break;
      case "polyline":
        layerType = "LineString";
        break;
      case "marker":
        layerType = "Point";
        break;
      default:
        layerType = "Point";
    }
    const feature: Feature = {
      type: "Feature",
      geometry: {
        type: layerType as any,
        coordinates: e.layer.toGeoJSON().geometry.coordinates,
      },
      properties: {},
    };
    if (e.layer instanceof L.Circle && feature.properties)
      feature.properties.radius = e.layer.getRadius();

    add(feature, {
      onSuccess: async () => {
        await utils.cityPlanning.getZones.refetch();
        toast.success("Zone added");
      },
      onError: (err) => {
        console.error(err);
      },
    });
  };

  const handleEdit = (e: L.DrawEvents.Edited) => {
    sending.current = true;

    const geo = pointsRef.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection")
      save(geo, {
        onSuccess: async () => {
          await utils.cityPlanning.getZones.refetch();
          toast.success("Zones saved");
        },
        onError: (err) => {
          toast.error("Zones couldn't be saved");
        },
        onSettled: () => {
          sending.current = false;
        },
      });
  };
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
      <FeatureGroup ref={pointsRef}>
        <EditControl
          position="topright"
          onEdited={(e) => {
            if (sending.current) return;
            handleEdit(e);
          }}
          onCreated={handleCreate}
          draw={{}}
        />
      </FeatureGroup>
    </MapContainer>
  );
}
