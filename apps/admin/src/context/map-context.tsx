import type { Feature, FeatureCollection } from "geojson";
import { createContext, useEffect, useRef, useState } from "react";
import * as L from "leaflet";

import type { RouterOutputs } from "@tribal-cities/api";

import { api } from "~/trpc/react";

interface MapContextType {
  geojson: FeatureCollection | null;
  zones: RouterOutputs["cityPlanning"]["getZones"] | undefined;
  hoverZone: string;
  setHoverZone: (zoneId: string) => void;
  ref: React.RefObject<L.FeatureGroup>;
  mapUrl: string | undefined;
}

export const MapContext = createContext<MapContextType>({
  geojson: null,
  zones: [],
  hoverZone: "",
  setHoverZone: (zoneId: string) => {},
  ref: { current: null },
  mapUrl: undefined,
});

export default function Map({ children }: { children: React.ReactNode }) {
  const ref = useRef<L.FeatureGroup>(null);

  const [hoverZone, setHoverZone] = useState<string>("");
  const { data: mapUrl } = api.cityPlanning.getGoogleMaps.useQuery();
  const { data: zones } = api.cityPlanning.getZones.useQuery();
  const [geojson, setGeojson] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  // * Convert zones to geojson
  useEffect(() => {
    if (!zones) return;
    const features: Feature[] = zones.map((zone) => {
      const feature: Feature = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
      };
      if (zone.type === "Point") {
        feature.geometry.type = "Point";
        (feature.geometry as any).coordinates = zone.coordinates
          .map((c) => [parseFloat(c.lng), parseFloat(c.lat)])
          .at(0);
      }

      if (zone.type === "Polygon") {
        feature.geometry.type = "Polygon";
        (feature.geometry as any).coordinates[0] = zone.coordinates.map((c) => [
          parseFloat(c.lng),
          parseFloat(c.lat),
        ]);
      }

      if (zone.type === "LineString") {
        feature.geometry.type = "LineString";
        (feature.geometry as any).coordinates = zone.coordinates.map((c) => [
          parseFloat(c.lng),
          parseFloat(c.lat),
        ]);
      }

      if (zone.radius) (feature.properties as any).radius = zone.radius;
      // (feature.properties as any).opacity = 0.5;
      if (zone.camp)
        feature.properties = {
          popupHTML: `<h3>${zone.camp.name}</h3>`,
        };
      feature.id = zone.id;

      return feature;
    });
    console.log("Set Geojson");
    setGeojson({ type: "FeatureCollection", features });
  }, [zones]);

  useEffect(() => {
    const update = geojson.features.map((feature) => {
      if (feature.id === hoverZone) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            opacity: 0.5,
          },
        };
      } else {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            opacity: 1,
          },
        };
      }
    });
    setGeojson({ ...geojson, features: update });
  }, [hoverZone]);

  useEffect(() => {
    ref.current?.clearLayers();
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer: any) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          console.log(layer.feature?.geometry);

          let castLayer = layer as L.Layer;
          (castLayer.options as any).opacity =
            layer.feature!.properties.opacity;

          if (layer.feature?.properties.radius && ref.current) {
            castLayer = new L.Circle(
              layer.feature.geometry.coordinates.slice().reverse(),
              {
                radius: layer.feature.properties.radius,
                opacity: layer.feature.properties.opacity,
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

  return (
    <MapContext.Provider
      value={{ geojson, zones, hoverZone, setHoverZone, ref, mapUrl }}
    >
      {children}
    </MapContext.Provider>
  );
}
