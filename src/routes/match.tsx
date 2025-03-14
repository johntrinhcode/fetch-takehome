import { MatchContext } from "@/components/contexts/match-context";
import { DogItem } from "@/components/dog-item";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NAV_HEIGHT } from "@/lib/constants";
import { Dog, Match } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { useCallback, useContext, useEffect } from "react";

export const Route = createFileRoute("/match")({
  component: RouteComponent,
});

function RouteComponent() {
  const { favorites, match, setMatch } = useContext(MatchContext);
  const { mutate, data, status } = useMutation({
    mutationFn: async (favs: Dog[]) => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/dogs/match`;
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favs.map((fav) => fav.id)),
      });
      return (await response.json()) as Match;
    },
  });

  const handleMatch = useCallback(() => mutate(favorites), [mutate, favorites]);

  useEffect(() => {
    if (status === "success" && data) {
      setMatch(favorites.find((fav) => fav.id === data.match));
    }
  }, [status, data, favorites, setMatch]);

  return (
    <div
      className="flex flex-col md:flex-row md:h-full p-4 gap-4 overflow-auto"
      style={{
        height: `calc(100dvh - ${NAV_HEIGHT}px)`,
        width: "100dvw",
      }}
    >
      <Card className="h-fit md:h-full w-full md:w-fit">
        <CardHeader className="flex-none">
          <CardTitle>Your Favorites</CardTitle>
          <CardDescription>
            We'll use your list of favorite dogs to find a match that is ideal
            to you
          </CardDescription>
        </CardHeader>
        <CardContent className="flex grow overflow-auto">
          {favorites.length > 0 ? (
            <ul className="size-full flex flex-row md:flex-col gap-4">
              {favorites.map((fav) => (
                <li key={fav.id} className="h-fit">
                  <DogItem dog={fav} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex grow items-center justify-center text-center">
              <p>You haven't added any favorites yet!</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="grow">
        <CardHeader>
          <CardTitle>Matchmaking</CardTitle>
          <CardDescription>
            Let our team will match you with your lifelong fur buddy
          </CardDescription>
        </CardHeader>
        <CardContent className="size-full flex flex-col gap-4 items-center justify-center">
          {match && (
            <section className="flex flex-col gap-4 items-center">
              <div className="text-center">
                <h1 className="text-lg">
                  Say hello to <b>{match.name}</b>!
                </h1>
                <p className="text-muted-foreground">
                  Your {match.age} year old {match.breed}, ready for adoption
                  near {match.zip_code}
                </p>
              </div>

              <img
                src={match.img}
                alt={match.name}
                className="w-full h-[200px] md:h-[400px] object-cover rounded"
              />
            </section>
          )}
          {favorites.length === 0 && (
            <p className="text-center">
              To generate a match, you'll need to Favorite dogs from your{" "}
              <Link to="/search">
                <b>search</b>
              </Link>
              !
            </p>
          )}
          <Button
            disabled={status === "pending" || favorites.length === 0}
            onClick={handleMatch}
            className="bg-pink-500 hover:bg-pink-600"
            size="lg"
          >
            {status === "pending" ? (
              <LoaderIcon className="animate-spin" />
            ) : match ? (
              "Find Another Match"
            ) : (
              "Find My Match"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
