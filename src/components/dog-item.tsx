import { cn } from "@/lib/utils";
import { Dog } from "@/types";
import { PawPrintIcon, CakeIcon, MapPinIcon, HeartIcon } from "lucide-react";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchContext } from "@/components/contexts/match-context";

export function DogItem({ dog }: { dog: Dog }) {
  const { favorites, setFavorites } = useContext(MatchContext);
  return (
    <Card className="relative p-0 gap-0 overflow-hidden">
      <img
        src={dog.img}
        alt={dog.name}
        className="w-full h-[100px] md:h-[200px] object-cover"
      />
      <CardContent className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between p-4">
        <p className="font-semibold">{dog.name}</p>
        <div className="flex flex-col md:flex-row gap-2">
          <Badge variant="outline" className="gap-2">
            <PawPrintIcon />
            {dog.breed}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <CakeIcon /> {formatAge(dog.age)}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <MapPinIcon className="size-4" /> {dog.zip_code}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-0 right-0 m-4"
          onClick={() => {
            const isFavorited = favorites.some((fav) => fav.id === dog.id);
            setFavorites((curr) =>
              isFavorited
                ? curr.filter((fav) => fav.id !== dog.id)
                : [...curr, dog],
            );
          }}
        >
          <HeartIcon
            className={cn(
              favorites.some((fav) => fav.id === dog.id) && "text-[red]",
            )}
            fill={
              favorites.some((fav) => fav.id === dog.id) ? "red" : "transparent"
            }
          />
        </Button>
      </CardContent>
    </Card>
  );
}

function formatAge(age: number) {
  return age > 0 ? `${age}` : "Less than a year";
}
