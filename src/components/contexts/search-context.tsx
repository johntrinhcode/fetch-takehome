import { Dog } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

export type SortOption = "breed" | "name" | "age";
export type SortDirection = "asc" | "desc";

interface SearchContextValue {
  status: "pending" | "success";
  dogs: Dog[];
  total?: number;
  page: number;
  maxPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  handleNext: () => void;
  handlePrevious: () => void;
  selectedBreeds: string[];
  setSelectedBreeds: React.Dispatch<React.SetStateAction<string[]>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  sortDirection: SortDirection;
  setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
  minAge: number;
  setMinAge: React.Dispatch<React.SetStateAction<number>>;
  maxAge: number;
  setMaxAge: React.Dispatch<React.SetStateAction<number>>;
  zipCodes: string[];
  setZipCodes: React.Dispatch<React.SetStateAction<string[]>>;
  locationFilterEnabled: boolean;
  setLocationFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchContext = createContext<SearchContextValue>({
  status: "pending",
  dogs: [],
  total: undefined,
  page: 1,
  maxPage: 1,
  pageSize: 25,
  hasNext: false,
  hasPrevious: false,
  handleNext: () => {},
  handlePrevious: () => {},
  selectedBreeds: [],
  setSelectedBreeds: () => {},
  sortOption: "breed",
  setSortOption: () => {},
  sortDirection: "asc",
  setSortDirection: () => {},
  minAge: 0,
  setMinAge: () => {},
  maxAge: 25,
  setMaxAge: () => {},
  zipCodes: [],
  setZipCodes: () => {},
  locationFilterEnabled: false,
  setLocationFilterEnabled: () => {},
});

export function SearchContextProvider({ children }: PropsWithChildren) {
  // query params
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(25);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(25);
  const [sortOption, setSortOption] = useState<SortOption>("breed");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [zipCodes, setZipCodes] = useState<string[]>([]);

  // pagination
  const [maxPage, setMaxPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);

  // other
  const [locationFilterEnabled, setLocationFilterEnabled] =
    useState<boolean>(false);

  const query = useQuery({
    queryKey: [
      "search",
      page,
      pageSize,
      selectedBreeds,
      minAge,
      maxAge,
      sortOption,
      sortDirection,
      zipCodes,
      locationFilterEnabled,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.set("sort", `${sortOption}:${sortDirection}`);
      params.set("ageMin", String(minAge));
      params.set("ageMax", String(maxAge));

      if (locationFilterEnabled) {
        if (zipCodes.length > 0) {
          for (const zipCode of zipCodes) {
            params.append("zipCodes", zipCode);
          }
        } else {
          return {
            results: [],
            total: 0,
          };
        }
      }

      if (page !== 1) {
        params.set("from", String((page - 1) * pageSize));
      }

      if (selectedBreeds.length > 0) {
        for (const breed of selectedBreeds) {
          params.append("breeds", breed);
        }
      }

      const searchURL = `${
        import.meta.env.VITE_API_BASE_URL
      }/dogs/search?${params.toString()}`;
      const searchResponse = await fetch(searchURL, {
        method: "GET",
        credentials: "include",
      });

      const ids = (await searchResponse.json()) as {
        resultIds: string[];
        total: number;
      };

      const dogsURL = `${import.meta.env.VITE_API_BASE_URL}/dogs`;
      const dogsResponse = await fetch(dogsURL, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids.resultIds),
      });

      return {
        results: (await dogsResponse.json()) as Dog[],
        total: ids.total,
      };
    },
  });

  // computed pagination state
  const [hasNext, hasPrevious, handleNext, handlePrevious] = useMemo(() => {
    const hasNext = query.data?.total
      ? query.data.total > pageSize * page
      : false;
    const hasPrevious = page > 1;
    const handleNext = () => (hasNext ? setPage((curr) => curr + 1) : {});
    const handlePrevious = () =>
      hasPrevious ? setPage((curr) => curr - 1) : {};
    return [hasNext, hasPrevious, handleNext, handlePrevious];
  }, [query]);

  // update pagination state when total changes
  useEffect(() => {
    if (query.data?.total !== undefined) {
      setMaxPage(Math.ceil(query.data.total / pageSize));
      setTotal(query.data.total);
    }
  }, [query.data?.total]);

  // Reset page position when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedBreeds, minAge, maxAge, zipCodes, locationFilterEnabled]);

  const value: SearchContextValue = useMemo(
    () => ({
      status: query.isPending ? "pending" : "success",
      dogs: query.data?.results ?? [],
      total,
      page,
      pageSize,
      maxPage,
      hasNext,
      hasPrevious,
      handleNext,
      handlePrevious,
      selectedBreeds,
      setSelectedBreeds,
      sortOption,
      setSortOption,
      sortDirection,
      setSortDirection,
      minAge,
      setMinAge,
      maxAge,
      setMaxAge,
      zipCodes,
      setZipCodes,
      locationFilterEnabled,
      setLocationFilterEnabled,
    }),
    [
      query.data,
      query.isPending,
      page,
      pageSize,
      maxPage,
      hasNext,
      hasPrevious,
      handleNext,
      handlePrevious,
      selectedBreeds,
      setSelectedBreeds,
      sortOption,
      setSortOption,
      sortDirection,
      setSortDirection,
      minAge,
      setMinAge,
      maxAge,
      setMaxAge,
      zipCodes,
      setZipCodes,
      locationFilterEnabled,
      setLocationFilterEnabled,
    ],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
