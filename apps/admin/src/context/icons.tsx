import { Icon } from "leaflet";

import type { ZoneClassEnum } from "@tribal-cities/db/schema";

import RvPng from "./rv.png";
import TentPng from "./tent.png";

//Define custom icons for different categories
const tentIcon = new Icon({
  iconUrl: TentPng.src,
  iconSize: [35, 35], // size of the icon
  // iconAnchor: [32, -3], // point of the icon which will correspond to marker's location
  // popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
const rvIcon = new Icon({
  iconUrl: RvPng.src,
  iconSize: [35, 35], // size of the icon
  // iconAnchor: [32, -3], // point of the icon which will correspond to marker's location
  // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

// const healthIcon = new Icon({
//   iconUrl: "https://img.icons8.com/doodle/48/heart-with-pulse.png",
//   iconSize: [35, 35], // size of the icon
//   iconAnchor: [32, -3], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });

// const housingIcon = new Icon({
//   iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
//   iconSize: [38, 45], // size of the icon
//   iconAnchor: [32, -3], // point of the icon which will correspond to marker's location
//   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
// });

// Function to get the appropriate icon for a category
export const getClassIcon = (zoneClass: ZoneClassEnum) => {
  if (zoneClass === "Camp") {
    return tentIcon;
  } else if (zoneClass === "RV") {
    return rvIcon;
  }
  // else if (zoneClass === 'Food') {
  //   return foodIcon;
  // } else if (zoneClass === 'Health') {
  //   return healthIcon;
  // }
  else {
    // Default icon if category doesn't match any of the above
    return null; // Or another default icon
  }
};
