import { createContext, FC, ReactNode } from "react";
import { courseListType, filtersType } from "../types";
import { GlobalTypes } from "./graphql";
import {
  useUserRecentContentQuery,
  useUserContentItemsQuery,
  useCatalogContentQuery,
} from "./graphql";

interface DataContextProps {
  recentContent: courseListType[] | undefined;
  refetchRecentContent: () => void;
  catalogData: courseListType[] | undefined;
  refetchCatalogData: () => void;
  contentData: courseListType[] | undefined;
  refetchContentData: () => void;
}

export const DataContext = createContext<DataContextProps>({
  recentContent: [],
  refetchRecentContent: () => undefined,
  catalogData: [],
  refetchCatalogData: () => undefined,
  contentData: [],
  refetchContentData: () => undefined,
});

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: recentContent, refetch: refetchRecentContent } =
    useUserRecentContentQuery({
      variables: { limit: 5 },
    });
  const { data: contentData, refetch: refetchCatalogData } =
    useUserContentItemsQuery();
  const { data: catalogData, refetch: refetchContentData } =
    useCatalogContentQuery({
      variables: {
        sortColumn: GlobalTypes.SortColumn.Title,
        sortDirection: GlobalTypes.SortDirection.Asc,
        page: 1,
        labels: [],
        values: [],
        contentTypes: "Course",
      },
    });

  return (
    <DataContext.Provider
      value={{
        recentContent: recentContent?.UserRecentContent,
        refetchRecentContent: refetchRecentContent,
        contentData: contentData?.UserContentItems,
        refetchContentData: refetchContentData,
        catalogData: catalogData?.CatalogContent.contentItems,
        refetchCatalogData: refetchCatalogData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

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
