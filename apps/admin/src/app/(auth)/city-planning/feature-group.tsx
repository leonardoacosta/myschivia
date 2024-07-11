import type { FeatureCollection } from "geojson";
import { useEffect, useRef } from "react";
import * as L from "leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function FeatureGroupFC({ geojson, setGeojson }: Props) {
  const ref = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    console.log("geojson", geojson);
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer: any) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          const castLayer = layer as L.Layer;

          if (layer.feature?.properties.popupHTML)
            castLayer.bindPopup(layer.feature.properties.popupHTML);

          ref.current?.addLayer(castLayer);
        }
      });
    }
  }, [geojson]);

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position="topright"
        // onEdited={console.log}
        // onCreated={console.log}
        // onDeleted={console.log}
        // onMounted={console.log}
        draw={{
          rectangle: false,
        }}
      />
    </FeatureGroup>
  );
}
