import type { FeatureCollection } from "geojson";
import { useEffect, useRef } from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { toast } from "@tribal-cities/ui/toast";

import { api } from "~/trpc/react";

interface Props {
  geojson: FeatureCollection;
}

export default function FeatureGroupFC({ geojson }: Props) {
  const utils = api.useUtils();
  const { mutate } = api.cityPlanning.saveZones.useMutation();
  const ref = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    ref.current?.clearLayers();
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer: any) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          let castLayer = layer as L.Layer;

          if (layer.feature?.properties.radius && ref.current) {
            castLayer = new L.Circle(
              layer.feature.geometry.coordinates.slice().reverse(),
              {
                radius: layer.feature.properties.radius,
              },
            );
          }
          if (layer.feature?.properties.popupHTML)
            castLayer.bindPopup(layer.feature.properties.popupHTML);

          ref.current?.addLayer(castLayer);
        }
      });
    }
  }, [geojson]);

  const handleChange = () => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection")
      mutate(geo, {
        onSuccess: async () => {
          await utils.cityPlanning.getZones.refetch();
          toast.success("Zones saved");
        },
        onError: (err) => {
          console.error(err);
        },
      });
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        onEdited={(e) => {
          handleChange();
          console.log("edited", e);
        }}
        onCreated={(e) => {
          handleChange();
          console.log("onCreated", e);
        }}
        onDeleted={(e) => {
          console.log("onDeleted", e);
        }}
        onMounted={() => {
          console.log("onMounted");
        }}
        draw={{
          rectangle: false,
        }}
      />
    </FeatureGroup>
  );
}
