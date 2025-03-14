import { cn } from "@/lib/utils";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Location } from "@/types";
import { SearchContext } from "@/components/contexts/search-context";

export function Map() {
  const { setZipCodes } = useContext(SearchContext);
  const [position, setPosition] = useState<GeolocationCoordinates>();
  const mapRef = useRef<maplibregl.Map>(null);

  useEffect(() => {
    mapRef.current = new maplibregl.Map({
      container: "map",
      style: "https://tiles.openfreemap.org/styles/positron", // shoutout to openfreemap.org for providing free map tiles
      center: [0, 0],
      zoom: 12, // starting zoom
      minZoom: 10, // to prevent zooming out too far and fetching too many zipcodes
      attributionControl: false,
    });

    mapRef.current.on("moveend", async () => {
      if (!mapRef.current) return;
      const bounds = mapRef.current.getBounds();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/locations/search`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            size: 10_000,
            geoBoundingBox: {
              top_right: {
                lat: bounds._ne.lat,
                lon: bounds._ne.lng,
              },
              bottom_left: {
                lat: bounds._sw.lat,
                lon: bounds._sw.lng,
              },
            },
          }),
        },
      );

      if (response.ok) {
        const data = (await response.json()) as {
          results: Location[];
          total: number;
        };
        setZipCodes(data.results.map((location) => location.zip_code));
      }
    });

    navigator.geolocation.getCurrentPosition(async (position) => {
      setPosition(position.coords);
      const map = mapRef.current;
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // set default marker
      if (map) {
        map.setCenter(coords);
        new maplibregl.Marker().setLngLat(coords).addTo(map);
      }
    });
  }, []);

  return (
    <div
      id="map"
      className={cn(
        "relative w-full h-full",
        position === undefined && "hidden",
      )}
    />
  );
}
