import { Dog } from "@/types";
import { createContext, PropsWithChildren, useMemo, useState } from "react";

interface MatchContextValue {
  match?: Dog;
  setMatch: React.Dispatch<React.SetStateAction<Dog | undefined>>;
  favorites: Dog[];
  setFavorites: React.Dispatch<React.SetStateAction<Dog[]>>;
}

export const MatchContext = createContext<MatchContextValue>({
  match: undefined,
  setMatch: () => {},
  favorites: [],
  setFavorites: () => {},
});

export function MatchContextProvider({ children }: PropsWithChildren) {
  const [match, setMatch] = useState<Dog | undefined>();
  const [favorites, setFavorites] = useState<Dog[]>([]);

  const value: MatchContextValue = useMemo(
    () => ({
      match,
      setMatch,
      favorites,
      setFavorites,
    }),
    [match, setMatch, favorites, setFavorites],
  );

  return (
    <MatchContext.Provider value={value}>{children}</MatchContext.Provider>
  );
}
