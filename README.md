# Fetch Rewards Takehome

Hello, Fetch Rewards team! Hope all is well.

My name is John Trinh, and this is my takehome assessment for the FE engineer role.

# Live Preview

https://jt-fetch-takehome.netlify.app/

# Local Setup

- Install dependencies with `pnpm i`.
- Spin up the local development server with `pnpm dev`.
- The web application will be accessible at `http://localhost:5173/`.

# Directory Structure

- `src/routes` - Holds files that are the pages and route entrypoints.
- `src/components/contexts` - Holds context providers that allow for sharing state between routes, components, etc.
- `src/components/guards` - Guard components, used in this case for gating certain routes behind an authentication check.
- `src/components/ui` - Generic UI components.
- `src/components` - Specific UI components for the take home assessment.
- `src/lib` - Various utilities.

# Approach

So I had a lot of fun with this assessment, especially with digging a little deeper with the location information and implementing a location search with a `Map` component powered by [MapLibre](https://maplibre.org/) and [OpenFreeMap](https://openfreemap.org/).

The web application is a straight-forward SPA page with [Vite](https://vite.dev/) as the lightweight build tool and using the [TanStack](https://tanstack.com/) suite for both client-side routing and querying with built-in caching capabilities.

Filtering state is managed by the `SearchContext` which manages API calls to the `POST /dog/*` endpoints to retrieve dog data.

Match state is managed by the `MatchContext` which keeps a track of favorited dogs during the search process and later used by the matching process to generate matches based on favorites.

Also, I put some effort into making the web application responsive for mobile screens.

# Possible Improvements

As a take home assessment, I conciously left out some improvements for the sake of time. But, in a production environment here are some things I'd implement to improve the application:

- Authentication via JWT
  - The current session checking mechanism polls an endpoint and checks for a `401` from the server to determine if a user in unauthenticated. This is okay for a takehome, but ideally i'd like to reduce network traffic and work with JWT-based session such that the expiration information is baked into a token and the client does not need to poll an endpoint.
- SSR of pages and components for better SEO
  - I purposefully implemented this takehome as a complete SPA for convenience/speed. But, for a more refined project I'd like to server render certain pages to make it easy for web crawlers to index my page for better SEO.
- Persisting filter state in URL
  - Another common feature for filter-heavy views like `/search` is the ability to get/set filter state into the URL. This allows for queries to be copied and shared for later on or between different users.
