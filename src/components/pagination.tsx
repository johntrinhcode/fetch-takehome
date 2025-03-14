import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SearchContext } from "@/components/contexts/search-context";

export function PaginationControls() {
  const {
    page,
    maxPage,
    total,
    hasNext,
    hasPrevious,
    handleNext,
    handlePrevious,
  } = useContext(SearchContext);

  return (
    <div className="flex justify-between items-center p-4 text-sm gap-2">
      {total !== undefined && (
        <Badge variant="outline" className="flex-none">
          {total} Dogs found
        </Badge>
      )}
      {total !== 0 && (
        <p className="flex-none">
          Page {page} of {maxPage}
        </p>
      )}

      <div className="w-full flex gap-2 justify-end">
        <Button
          disabled={!hasPrevious}
          onClick={handlePrevious}
          size="icon"
          variant="ghost"
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          disabled={!hasNext}
          onClick={handleNext}
          size="icon"
          variant="ghost"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
