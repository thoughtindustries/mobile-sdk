import { createContext } from "react";
import { filtersType } from "../types";
import { GlobalTypes } from "./graphql";

interface FilterType {
  setFilters: React.Dispatch<React.SetStateAction<filtersType>>;
  filters: filtersType;
}

export const FilterContext = createContext<FilterType>({
  setFilters: () => undefined,
  filters: {
    sortBy: GlobalTypes.SortColumn.Title,
    sortDir: GlobalTypes.SortDirection.Asc,
    values: [],
    labels: [],
  },
});
