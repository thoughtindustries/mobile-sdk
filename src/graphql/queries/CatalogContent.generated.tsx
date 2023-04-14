import * as Types from '../global-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CatalogContentQueryVariables = Types.Exact<{
  contentTypes?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  labels?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
  page: Types.Scalars['Int'];
  query?: Types.InputMaybe<Types.Scalars['String']>;
  resultsDisplayType?: Types.InputMaybe<Types.ContentItemDisplayType>;
  sortColumn?: Types.InputMaybe<Types.SortColumn>;
  sortDirection?: Types.InputMaybe<Types.SortDirection>;
  token?: Types.InputMaybe<Types.Scalars['String']>;
  values?: Types.InputMaybe<Array<Types.Scalars['String']> | Types.Scalars['String']>;
}>;


export type CatalogContentQuery = { __typename?: 'Query', CatalogContent: { __typename?: 'CatalogContent', contentItems?: Array<{ __typename?: 'Content', id: string, asset?: string, authors?: Array<string>, title?: string, displayCourse?: string, contentTypeLabel?: string }> } };


export const CatalogContentDocument = gql`
    query CatalogContent($contentTypes: [String!], $labels: [String!], $page: Int!, $query: String, $resultsDisplayType: ContentItemDisplayType, $sortColumn: SortColumn, $sortDirection: SortDirection, $token: String, $values: [String!]) {
  CatalogContent(
    contentTypes: $contentTypes
    labels: $labels
    page: $page
    query: $query
    resultsDisplayType: $resultsDisplayType
    sortColumn: $sortColumn
    sortDirection: $sortDirection
    token: $token
    values: $values
  ) {
    contentItems {
      id
      asset
      authors
      title
      displayCourse
      contentTypeLabel
    }
  }
}
    `;

/**
 * __useCatalogContentQuery__
 *
 * To run a query within a React component, call `useCatalogContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useCatalogContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCatalogContentQuery({
 *   variables: {
 *      contentTypes: // value for 'contentTypes'
 *      labels: // value for 'labels'
 *      page: // value for 'page'
 *      query: // value for 'query'
 *      resultsDisplayType: // value for 'resultsDisplayType'
 *      sortColumn: // value for 'sortColumn'
 *      sortDirection: // value for 'sortDirection'
 *      token: // value for 'token'
 *      values: // value for 'values'
 *   },
 * });
 */
export function useCatalogContentQuery(baseOptions: Apollo.QueryHookOptions<CatalogContentQuery, CatalogContentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CatalogContentQuery, CatalogContentQueryVariables>(CatalogContentDocument, options);
      }
export function useCatalogContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CatalogContentQuery, CatalogContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CatalogContentQuery, CatalogContentQueryVariables>(CatalogContentDocument, options);
        }
export type CatalogContentQueryHookResult = ReturnType<typeof useCatalogContentQuery>;
export type CatalogContentLazyQueryHookResult = ReturnType<typeof useCatalogContentLazyQuery>;
export type CatalogContentQueryResult = Apollo.QueryResult<CatalogContentQuery, CatalogContentQueryVariables>;