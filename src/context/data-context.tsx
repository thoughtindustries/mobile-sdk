import { createContext, FC, ReactNode, useContext, useState } from "react";
import { courseListType } from "../../types";
import { GlobalTypes } from "../graphql";
import {
  useUserRecentContentQuery,
  useUserContentItemsQuery,
  useCatalogContentQuery,
} from "../graphql";
import { FetchPolicy } from "@apollo/client";

type RefetchFunction<data = any, variables = any> = (
  variables?: variables,
  fetchPolicy?: FetchPolicy
) => Promise<data>;

interface DataContextProps {
  recentContent: courseListType[] | undefined;
  refetchRecentContent: () => Promise<any>;
  catalogData: courseListType[] | undefined;
  refetchCatalogData: RefetchFunction;
  contentData: courseListType[] | undefined;
  refetchContentData: RefetchFunction;
  setInitialState: (initialState: boolean) => void;
  initialState: boolean;
}
const DataContext = createContext<DataContextProps>({
  recentContent: [],
  refetchRecentContent: () => new Promise<any>(() => {}),
  catalogData: [],
  refetchCatalogData: () => new Promise<any>(() => {}),
  contentData: [],
  refetchContentData: () => new Promise<any>(() => {}),
  setInitialState: () => undefined,
  initialState: false,
});

export const useDataContext = () => useContext(DataContext);

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [initialState, setInitialState] = useState<boolean>(false);

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
      },
    });

  return (
    <DataContext.Provider
      value={{
        recentContent: !initialState
          ? recentContent?.UserRecentContent
          : undefined,
        refetchRecentContent: refetchRecentContent,
        contentData: !initialState ? contentData?.UserContentItems : undefined,
        refetchContentData: refetchContentData,
        catalogData: catalogData?.CatalogContent.contentItems,
        refetchCatalogData: refetchCatalogData,
        setInitialState: setInitialState,
        initialState: initialState,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};