import type { Feature, FeatureCollection, Geometry } from "geojson";
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
  const { mutate: add } = api.cityPlanning.addZone.useMutation();
  const { mutate: save } = api.cityPlanning.saveZones.useMutation();
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
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === "FeatureCollection")
      save(geo, {
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
        onEdited={handleEdit}
        onCreated={handleCreate}
        onDeleted={(e) => {
          console.log("onDeleted", e);
        }}
        onMounted={() => {
          console.log("onMounted");
        }}
        draw={{}}
      />
    </FeatureGroup>
  );
}
