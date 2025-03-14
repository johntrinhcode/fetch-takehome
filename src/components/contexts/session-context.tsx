import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useMemo } from "react";

interface SessionContextValue {
  authenticated: boolean;
  refetch: () => void;
}

export const SessionContext = createContext<SessionContextValue>({
  authenticated: false,
  refetch: () => {},
});

export function SessionContextProvider({ children }: PropsWithChildren) {
  const { data, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/dogs/breeds`;
      const response = await fetch(url, { credentials: "include" });

      if (response.status === 401) {
        return { authenticated: false };
      }

      return { authenticated: true };
    },
    gcTime: Infinity,
    refetchInterval: 5000, // check ever 5 seconds session is still active
  });

  const value: SessionContextValue = useMemo(
    () => ({
      authenticated: data?.authenticated ?? false,
      refetch,
    }),
    [data, refetch],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
