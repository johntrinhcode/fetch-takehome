import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchContextProvider } from "@/components/contexts/search-context";
import { Navigation } from "@/components/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MatchContextProvider } from "@/components/contexts/match-context";
import { SessionGuard } from "@/components/guards/session-guard";
import { SessionContextProvider } from "@/components/contexts/session-context";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <SearchContextProvider>
          <MatchContextProvider>
            <TooltipProvider>
              <SessionContextProvider>
                <SessionGuard>
                  <Navigation />
                  <Outlet />
                </SessionGuard>
              </SessionContextProvider>
            </TooltipProvider>
          </MatchContextProvider>
        </SearchContextProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  ),
});
