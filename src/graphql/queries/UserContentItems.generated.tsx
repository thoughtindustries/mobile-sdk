import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UserContentItemsQueryVariables = Types.Exact<{
  kind?: Types.InputMaybe<Array<Types.ContentKind> | Types.ContentKind>;
  query?: Types.InputMaybe<Types.Scalars["String"]>;
  sortColumn?: Types.InputMaybe<Types.SortColumn>;
  sortDirection?: Types.InputMaybe<Types.SortDirection>;
}>;

export type UserContentItemsQuery = {
  __typename?: "Query";
  UserContentItems?: Array<{
    __typename?: "Content";
    id: string;
    asset?: string;
    contentTypeLabel?: string;
    displayCourse?: string;
    title?: string;
    customFields?: {
      duration: string[];
      "level-of-difficulty": string[];
    };
  }>;
};

export const UserContentItemsDocument = gql`
  query UserContentItems(
    $kind: [ContentKind!]
    $query: String
    $sortColumn: SortColumn
    $sortDirection: SortDirection
  ) {
    UserContentItems(
      kind: $kind
      query: $query
      sortColumn: $sortColumn
      sortDirection: $sortDirection
    ) {
      id
      asset
      contentTypeLabel
      displayCourse
      title
      customFields
    }
  }
`;

/**
 * __useUserContentItemsQuery__
 *
 * To run a query within a React component, call `useUserContentItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserContentItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserContentItemsQuery({
 *   variables: {
 *      kind: // value for 'kind'
 *      query: // value for 'query'
 *      sortColumn: // value for 'sortColumn'
 *      sortDirection: // value for 'sortDirection'
 *   },
 * });
 */
export function useUserContentItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserContentItemsQuery, UserContentItemsQueryVariables>(
    UserContentItemsDocument,
    options
  );
}
export function useUserContentItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >(UserContentItemsDocument, options);
}
export type UserContentItemsQueryHookResult = ReturnType<
  typeof useUserContentItemsQuery
>;
export type UserContentItemsLazyQueryHookResult = ReturnType<
  typeof useUserContentItemsLazyQuery
>;
export type UserContentItemsQueryResult = Apollo.QueryResult<
  UserContentItemsQuery,
  UserContentItemsQueryVariables
>;
