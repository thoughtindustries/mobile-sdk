import { createContext } from "react";
import { filtersType } from "../../types";
import { GlobalTypes } from "../graphql";

interface FiltersProps {
  setFilters: React.Dispatch<React.SetStateAction<filtersType>>;
  filters: filtersType;
}

export const FilterContext = createContext<FiltersProps>({
  setFilters: () => undefined,
  filters: {
    sortBy: GlobalTypes.SortColumn.Title,
    sortDir: GlobalTypes.SortDirection.Asc,
    labels: [],
    values: [],
  },
});
