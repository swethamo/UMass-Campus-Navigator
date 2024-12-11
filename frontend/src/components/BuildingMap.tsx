import { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Libraries,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import TramIcon from "@mui/icons-material/Tram";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { environment } from "../environment";
import { Building } from "../../../models/Building";
import { IconButton } from "@mui/material";

type TravelModeType =
  | google.maps.TravelMode.WALKING
  | google.maps.TravelMode.DRIVING
  | google.maps.TravelMode.TRANSIT
  | google.maps.TravelMode.BICYCLING;

const mapContainerStyle = {
  width: "100%",
  height: "calc(100% - 40px)",
};

const libraries = ["places", "geometry", "drawing"];

function BuildingMap({ building }: { building: Building }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: environment.mapsId,
    libraries: libraries as Libraries,
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [travelMode, setTravelMode] = useState<TravelModeType | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (currentLocation && travelMode) {
      const directionsService = new google.maps.DirectionsService();

      if (building.address) {
        directionsService.route(
          {
            origin: currentLocation,
            destination: building.address,
            travelMode: travelMode || google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);
            }
          }
        );
      }
    } else if (!travelMode && mapRef) {
      mapRef.panTo(building.location);
      setDirections(null);
    }
  }, [
    currentLocation,
    building.address,
    travelMode,
    mapRef,
    building.location,
  ]);

  return (
    isLoaded &&
    currentLocation && (
      <>
        <div>
          <IconButton
            onClick={() => {
              setTravelMode(null);
              setDirections(null);
            }}
          >
            <LocationOnIcon color={travelMode === null ? "info" : "inherit"} />
          </IconButton>
          <IconButton
            onClick={() =>
              google?.maps && setTravelMode(google.maps.TravelMode.WALKING)
            }
          >
            <DirectionsWalkIcon
              color={
                travelMode === google.maps.TravelMode.WALKING
                  ? "info"
                  : "inherit"
              }
            />
          </IconButton>
          <IconButton
            onClick={() =>
              google?.maps && setTravelMode(google.maps.TravelMode.BICYCLING)
            }
          >
            <DirectionsBikeIcon
              color={
                travelMode === google.maps.TravelMode.BICYCLING
                  ? "info"
                  : "inherit"
              }
            />
          </IconButton>
          <IconButton
            onClick={() =>
              google?.maps && setTravelMode(google.maps.TravelMode.DRIVING)
            }
          >
            <DriveEtaIcon
              color={
                travelMode === google.maps.TravelMode.DRIVING
                  ? "info"
                  : "inherit"
              }
            />
          </IconButton>
          <IconButton
            onClick={() =>
              google?.maps && setTravelMode(google.maps.TravelMode.TRANSIT)
            }
          >
            <TramIcon
              color={
                travelMode === google.maps.TravelMode.TRANSIT
                  ? "info"
                  : "inherit"
              }
            />
          </IconButton>
        </div>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={building.location}
          zoom={16}
          onLoad={(map) => setMapRef(map)}
        >
          {!travelMode && <MarkerF position={building.location} />}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </>
    )
  );
}

export default BuildingMap;
