import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  ChevronsUpDown,
  Check,
  ArrowUpWideNarrowIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  SearchContext,
  SortOption,
} from "@/components/contexts/search-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Controls() {
  return (
    <div className="flex px-4 pb-4 gap-4 flex-wrap">
      {/* filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <LocationToggle />
        <BreedComboBox />
        <AgeRangeSlider />
      </div>
      {/* sorting */}
      <div className="flex grow justify-end gap-2">
        <SortSelector />
        <SortDirectionSelector />
      </div>
    </div>
  );
}

function LocationToggle() {
  const { locationFilterEnabled, setLocationFilterEnabled } =
    useContext(SearchContext);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          pressed={locationFilterEnabled}
          onPressedChange={(pressed) => setLocationFilterEnabled(pressed)}
          variant="outline"
          aria-label="Filter for dogs near you"
        >
          <MapPinIcon />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>Filter for dogs near you</p>
      </TooltipContent>
    </Tooltip>
  );
}

function AgeRangeSlider() {
  const [open, setOpen] = useState(false);
  const [displayRange, setDisplayRange] = useState<[number, number]>([0, 25]);
  const { minAge, maxAge, setMinAge, setMaxAge } = useContext(SearchContext);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-expanded={open} aria-label="Age Range">
          Ages {minAge} to {maxAge}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex gap-2 items-center">
          <p className="text-sm w-4 text-center">{displayRange[0]}</p>
          <Slider
            id="age-input"
            value={displayRange}
            onValueChange={(value) =>
              setDisplayRange(value as [number, number])
            }
            onValueCommit={(value) => {
              setMinAge(value[0]);
              setMaxAge(value[1]);
            }}
            className="w-[200px]"
            defaultValue={[0, 25]}
            min={0}
            max={25}
            step={1}
          />
          <p className="text-sm w-4 text-center">{displayRange[1]}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SortSelector() {
  const { sortOption, setSortOption } = useContext(SearchContext);
  return (
    <div className="flex gap-2 items-center">
      <Label htmlFor="sort-input">Sort by</Label>
      <Select
        value={sortOption}
        onValueChange={(value) => setSortOption(value as SortOption)}
      >
        <SelectTrigger id="sort-input" className="w-[100px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="breed">Breed</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="age">Age</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SortDirectionSelector() {
  const { sortDirection, setSortDirection } = useContext(SearchContext);
  return (
    <Toggle
      pressed={sortDirection === "desc"}
      onPressedChange={(pressed) => setSortDirection(pressed ? "desc" : "asc")}
      aria-label="Toggle sort"
      className="data-[state=on]:bg-unset"
    >
      <ArrowUpWideNarrowIcon
        className={cn(
          "size-4 transition-transform duration-200",
          sortDirection === "desc" && "rotate-180",
        )}
      />
    </Toggle>
  );
}

function BreedComboBox() {
  const { selectedBreeds, setSelectedBreeds } = useContext(SearchContext);
  const [open, setOpen] = useState(false);

  const { data: breeds } = useQuery({
    queryKey: ["breeds"],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/dogs/breeds`;
      const response = await fetch(url, { credentials: "include" });
      return (await response.json()) as string[];
    },
  });

  // move selected breeds towards the top of the list to make it easier to deselect / see selected breeds together
  const sortedBreeds = useMemo(() => {
    const sortedSelectedBreeds = selectedBreeds.sort((a, b) =>
      b.localeCompare(a),
    );
    return breeds?.sort(
      (a, b) =>
        sortedSelectedBreeds.indexOf(b) - sortedSelectedBreeds.indexOf(a),
    );
  }, [breeds, selectedBreeds]);

  return (
    <div className="flex gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Breed"
            className="justify-between"
          >
            {selectedBreeds.length > 0
              ? `${selectedBreeds.length} breed${
                  selectedBreeds.length > 1 ? "s" : ""
                } selected`
              : "Select breed"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search breed" />
            <CommandList>
              <CommandEmpty>No breed found.</CommandEmpty>
              <CommandGroup>
                {sortedBreeds &&
                  sortedBreeds.map((breed) => (
                    <CommandItem
                      key={breed}
                      value={breed}
                      onSelect={(currentValue) => {
                        if (selectedBreeds.includes(currentValue)) {
                          setSelectedBreeds(
                            selectedBreeds.filter((b) => b !== currentValue),
                          );
                        } else {
                          setSelectedBreeds([...selectedBreeds, currentValue]);
                        }
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBreeds.includes(breed)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {breed}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
