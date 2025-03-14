import { PropsWithChildren, useContext, useEffect } from "react";
import { SessionContext } from "../contexts/session-context";
import { useLocation, useNavigate } from "@tanstack/react-router";

export function SessionGuard({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();

  const { authenticated } = useContext(SessionContext);

  useEffect(() => {
    if (!authenticated && location.pathname !== "/") {
      navigate({ to: "/" });
    }

    if (authenticated && location.pathname === "/") {
      navigate({ to: "/search" });
    }
  }, [authenticated, location.pathname]);

  if (!authenticated && location.pathname !== "/") {
    return null;
  }

  if (authenticated && location.pathname === "/") {
    return null;
  }

  return children;
}
