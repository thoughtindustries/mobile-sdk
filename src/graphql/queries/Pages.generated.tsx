import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type PagesQueryVariables = Types.Exact<{
  identifiers: Array<Types.Scalars["String"]>;
}>;

export type PagesQuery = {
  __typename?: "Query";
  Pages: {
    __typename?: "Pages";
    videoAsset: string;
    languages: Array<{
      __typename?: "Languages";
      language: string;
      label: string;
      title: string;
      subtitle: string;
      body: string;
      copyright: string;
      allowAudioDownload: boolean;
      audioAsset: string;
      audioAssetUrl: string;
      externalUrl: string;
      externalUrlCallToAction: string;
      pdfAsset: string;
      pdfAssetSecondary: string;
      pdfAssetSecondaryUrl: string;
      pdfAssetTitle: string;
      pdfAssetTitleSecondary: string;
      pdfAssetUrl: string;
    }>;
  };
};

export const PagesDocument = gql`
  query Pages($identifiers: [String!]!) {
    Pages(identifiers: $identifiers) {
      ... on ArticlePage {
        videoAsset
        languages {
          language
          label
          title
          subtitle
          body
          copyright
          allowAudioDownload
          audioAsset
          audioAssetUrl
          externalUrl
          externalUrlCallToAction
          pdfAsset
          pdfAssetSecondary
          pdfAssetSecondaryUrl
          pdfAssetTitle
          pdfAssetTitleSecondary
          pdfAssetUrl
        }
      }
    }
  }
`;

/**
 * __usePagesQuery__
 *
 * To run a query within a React component, call `usePagesQuery` and pass it any options that fit your needs.
 * When your component renders, `usePagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePagesQuery({
 *   variables: {
 *      identifiers: // value for 'identifiers'
 *   },
 * });
 */
export function usePagesQuery(
  baseOptions: Apollo.QueryHookOptions<PagesQuery, PagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PagesQuery, PagesQueryVariables>(
    PagesDocument,
    options
  );
}
export function usePagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PagesQuery, PagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PagesQuery, PagesQueryVariables>(
    PagesDocument,
    options
  );
}
export type PagesQueryHookResult = ReturnType<typeof usePagesQuery>;
export type PagesLazyQueryHookResult = ReturnType<typeof usePagesLazyQuery>;
export type PagesQueryResult = Apollo.QueryResult<
  PagesQuery,
  PagesQueryVariables
>;
