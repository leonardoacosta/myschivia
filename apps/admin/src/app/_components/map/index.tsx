"use client";

import type { Feature, FeatureCollection } from "geojson";
import * as React from "react";
import * as L from "leaflet";
import { FeatureGroup, MapContainer, TileLayer } from "react-leaflet";

import { api } from "~/trpc/react";
import ZoneTable from "./zone-table";

export default function MainMap() {
  const ref = React.useRef<L.FeatureGroup>(null);
  const [url] = api.cityPlanning.getGoogleMaps.useSuspenseQuery();
  const { data: zones } = api.cityPlanning.getZones.useQuery();
  const [geojson, setGeojson] = React.useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  // * Convert zones to geojson
  React.useEffect(() => {
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
      if (zone.camp)
        feature.properties = {
          popupHTML: `<h3>${zone.camp.name}</h3>`,
        };
      feature.id = zone.id;

      return feature;
    });
    setGeojson({ type: "FeatureCollection", features });
  }, [zones]);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.clearLayers();

    if (geojson.features) {
      L.geoJSON(geojson).eachLayer((layer: any) => {
        if (!layer.feature) return;
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          let castLayer = layer as L.Layer;

          if (layer.feature.properties.radius && ref.current) {
            castLayer = new L.Circle(
              layer.feature.geometry.coordinates.slice().reverse(),
              {
                radius: layer.feature.properties.radius,
              },
            );
          }
          if (layer.feature.properties.popupHTML)
            castLayer.bindPopup(layer.feature.properties.popupHTML);

          if (ref.current) ref.current.addLayer(castLayer);
        }
      });
    }
  }, [geojson]);

  return (
    <div className="h-[50vh] md:flex">
      <div className="hidden h-0 w-0 md:block md:h-[100%] md:w-1/3">
        <ZoneTable zones={zones} />
      </div>
      <div className="h-[100%] w-[100%] md:w-2/3">
        <MapContainer
          className="h-full w-full"
          center={[32.972534, -94.597279]}
          zoom={18}
          zoomControl={true}
        >
          <TileLayer url={url} />
          <FeatureGroup ref={ref}></FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
}
