import { NAV_HEIGHT } from "@/lib/constants";
import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { SessionContext } from "./contexts/session-context";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";

export function Navigation() {
  const { authenticated, refetch } = useContext(SessionContext);

  const { mutate } = useMutation({
    mutationFn: async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/auth/logout`;
      await fetch(url, { method: "POST", credentials: "include" });
      refetch();
    },
  });

  return (
    <nav
      className="w-full flex flex-row p-4 items-center"
      style={{ height: NAV_HEIGHT }}
    >
      <ul className="grow flex flex-row gap-4">
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/match">Match</Link>
        </li>
      </ul>
      {authenticated && (
        <Button onClick={() => mutate()} variant="ghost">
          Sign Out
        </Button>
      )}
    </nav>
  );
}
