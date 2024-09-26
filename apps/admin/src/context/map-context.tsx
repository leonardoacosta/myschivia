import type { Feature, FeatureCollection } from "geojson";
import { createContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import * as L from "leaflet";

import type { RouterOutputs } from "@tribal-cities/api";

import { api } from "~/trpc/react";
import { getClassIcon } from "./icons";

interface MapContextType {
  geojson: FeatureCollection | null;
  zones: RouterOutputs["cityPlanning"]["getZones"] | undefined;
  hoverZone: string;
  setHoverZone: (zoneId: string) => void;
  pointsRef: React.RefObject<L.FeatureGroup>;
  mapUrl: string | undefined;
  mapRef: React.RefObject<L.Map>;
  pan: boolean;
  setPan: (pan: boolean) => void;
  panTo: (lat: number, lng: number) => void;
  campId: string | null;
  setCampId: (campId: string | null) => void;
  center: [number, number];
}

export const MapContext = createContext<MapContextType>({
  geojson: null,
  zones: [],
  hoverZone: "",
  setHoverZone: (zoneId: string) => {},
  pointsRef: { current: null },
  mapUrl: undefined,
  mapRef: { current: null },
  pan: false,
  setPan: (pan: boolean) => {},
  panTo: (lat: number, lng: number) => {},
  campId: null,
  setCampId: (campId: string | null) => {},
  center: [32.973934, -94.599279],
});

export default function Map({ children }: { children: React.ReactNode }) {
  const pointsRef = useRef<L.FeatureGroup>(null);
  const pathname = usePathname();
  const mapRef = useRef<L.Map>(null);

  const [pan, setPan] = useState(false);
  const [campId, setCampId] = useState<string | null>(null);
  const [center, setCenter] = useState<[number, number]>([
    32.973934, -94.599279,
  ]);

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

      (feature.properties as any).class = zone.class;
      (feature.properties as any).campId = zone.campId;

      if (zone.camp)
        (feature.properties as any).popupHTML = `
            <h3 style="text-decoration: underline;">${zone.camp.name}</h3>
            <p style="margin:0; font-style: italic;">${zone.camp.description}</p>
          `;
      feature.id = zone.id;

      return feature;
    });
    setGeojson({ type: "FeatureCollection", features });
  }, [zones]);

  useEffect(() => {
    if (!hoverZone) return;
    const update = geojson.features.map((feature) => {
      if (feature.id === hoverZone) {
        const coordinates = (feature.geometry as any).coordinates;
        const lat = coordinates[1];
        const lng = coordinates[0];

        // set focus
        if (pan) mapRef.current?.panTo(L.latLng(lat, lng));

        return {
          ...feature,
          properties: {
            ...feature.properties,
            opacity: 0.5,
            popup: true,
          },
        };
      }

      return {
        ...feature,
        properties: {
          ...feature.properties,
          opacity: 1,
          popup: false,
        },
      };
    });
    setGeojson({ ...geojson, features: update });
  }, [hoverZone]);

  useEffect(() => {
    pointsRef.current?.clearLayers();
    if (pointsRef.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer: any) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          let castLayer = layer as L.Layer;

          // * Set opacity
          (castLayer.options as any).opacity =
            layer.feature!.properties.opacity;

          // * Create circle if radius exists
          if (layer.feature?.properties.radius && pointsRef.current) {
            castLayer = new L.Circle(
              layer.feature.geometry.coordinates.slice().reverse(),
              {
                radius: layer.feature.properties.radius,
                opacity: layer.feature.properties.opacity,
              },
            );
          }

          // * Bind tooltip if popupHTML exists
          if (layer.feature?.properties.popupHTML)
            castLayer.bindTooltip(layer.feature.properties.popupHTML);

          // * Set path color based on zone class
          const _class = layer.feature?.properties.class;
          if (_class === "Road" || _class === "Path") {
            const color =
              _class === "Road"
                ? "blue"
                : _class === "Path"
                  ? "orange"
                  : "gray";
            (castLayer.options as any).color = color;
          } else {
            const icon = getClassIcon(_class);
            if (icon) {
              (castLayer.options as any).icon = icon;
            }
          }

          // * if campId is set, only show points with that campId, and all roads and paths
          const roadOrPath = _class === "Road" || _class === "Path";
          const ifCampSelected =
            (campId && layer.feature?.properties.campId === campId) || !campId;
          if (ifCampSelected || roadOrPath) {
            pointsRef.current?.addLayer(castLayer);
            if (!roadOrPath && campId)
              setCenter([
                layer.feature?.geometry.coordinates[1],
                layer.feature?.geometry.coordinates[0],
              ]);
          }

          console.log(layer.feature?.properties);
          console.log(layer.feature?.properties.popup);
          if (layer.feature?.properties.popup) {
            castLayer.toggleTooltip();
          }
        }
      });
    }
  }, [geojson, campId]);

  useEffect(() => {
    setCampId(null);
    setCenter([32.973934, -94.599279]);
  }, [pathname]);

  const panTo = (lat: number, lng: number) => {
    mapRef.current?.panTo([lat, lng]);
  };

  return (
    <MapContext.Provider
      value={{
        geojson,
        zones,
        hoverZone,
        setHoverZone,
        pointsRef,
        mapUrl,
        mapRef,
        pan,
        setPan,
        panTo,
        campId,
        setCampId,
        center,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
