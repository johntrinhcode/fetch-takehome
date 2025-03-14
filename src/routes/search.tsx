import {
  SearchContext,
  SearchContextProvider,
} from "@/components/contexts/search-context";
import { Controls } from "@/components/controls";
import { DogItem } from "@/components/dog-item";
import { Map } from "@/components/map";
import { PaginationControls } from "@/components/pagination";
import { NAV_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";

export const Route = createFileRoute("/search")({
  component: Index,
});

function Index() {
  return (
    <main
      className="relative flex items-center justify-center flex-col md:flex-row"
      style={{
        height: `calc(100dvh - ${NAV_HEIGHT}px)`,
        width: "100dvw",
      }}
    >
      <SearchContextProvider>
        <SearchResultsContainer />
        <MapContainer />
      </SearchContextProvider>
    </main>
  );
}

function SearchResultsContainer() {
  const { status, dogs, locationFilterEnabled } = useContext(SearchContext);

  return (
    <div
      className={cn(
        "flex flex-col h-full grow",
        locationFilterEnabled
          ? "w-full md:w-1/2 h-2/3 md:h-full"
          : "h-2/3 md:h-full w-full md:w-full",
      )}
    >
      <Controls />
      {status === "pending" && (
        <p className="size-full flex items-center justify-center">Loading..</p>
      )}
      {status === "success" && (
        <div className="flex grow overflow-auto">
          {dogs.length > 0 ? (
            <ul
              className={cn(
                "w-full h-fit grid gap-4 pb-4 px-4",
                locationFilterEnabled
                  ? "grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3",
              )}
            >
              {dogs.map((dog) => (
                <li className="h-fit" key={dog.id}>
                  <DogItem dog={dog} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="size-full flex items-center justify-center text-center p-4">
              No dogs found, try updating your filters or map position
            </div>
          )}
        </div>
      )}
      <PaginationControls />
    </div>
  );
}

function MapContainer() {
  const { locationFilterEnabled } = useContext(SearchContext);

  if (!locationFilterEnabled) return null;

  return (
    <div className="w-full md:w-1/2 h-1/3 md:h-full">
      <Map />
    </div>
  );
}
