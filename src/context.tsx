import { createContext } from "react";
import { filtersType } from "../types";

interface ExploreCatalogContextType {
  setFilters: React.Dispatch<React.SetStateAction<filtersType>>;
  filters: filtersType;
}

export const ExploreCatalogContext = createContext<ExploreCatalogContextType>({
  setFilters: () => undefined,
  filters: {
    sortBy: "title",
    sortDir: "asc",
    duration: "",
    difficulty: "",
    tag: "",
  },
});
