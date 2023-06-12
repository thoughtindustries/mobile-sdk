import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type PagesCompletedByCourseQueryVariables = Types.Exact<{
  courseId: Types.Scalars["ID"];
}>;

export type PagesCompletedByCourseQuery = {
  __typename?: "Query";
  PagesCompletedByCourse: Array<
    | {
        __typename?: "ArticlePage";
        accessibilityAudioAsset?: string;
        accessibilityAudioAssetTitle?: string;
        accessibilityAudioAssetUrl?: string;
        catalogAsset?: string;
        clientId?: string;
        companyId: string;
        completionTimeSeconds?: number;
        contentDescription?: string;
        contentEstimate?: string;
        contentTime?: string;
        createdAt: string;
        editableByChildren?: boolean;
        id: string;
        indentationLevel?: number;
        lessonId: string;
        publishDate?: string;
        title?: string;
        type: Types.TopicType;
        updatedAt: string;
        videoAsset?: string;
      }
    | { __typename?: "AssignmentPage" }
    | { __typename?: "AudioPage" }
    | { __typename?: "FlipCardPage" }
    | { __typename?: "GeneralPage" }
    | { __typename?: "HighlightZonePage" }
    | { __typename?: "ListRollPage" }
    | { __typename?: "MatchPairPage" }
    | { __typename?: "MeetingPage" }
    | { __typename?: "NotebookPage" }
    | { __typename?: "PDFViewerPage" }
    | { __typename?: "PresentationPage" }
    | { __typename?: "QuizPage" }
    | { __typename?: "RecipePage" }
    | { __typename?: "ScormPage" }
    | { __typename?: "SlideshowPage" }
    | { __typename?: "SurveyPage" }
    | { __typename?: "TallyPage" }
    | { __typename?: "TestPage" }
    | {
        __typename?: "TextPage";
        accessibilityAudioAsset?: string;
        accessibilityAudioAssetTitle?: string;
        accessibilityAudioAssetUrl?: string;
        body?: string;
        catalogAsset?: string;
        clientId?: string;
        companyId: string;
        completionTimeSeconds?: number;
        contentDescription?: string;
        contentEstimate?: string;
        contentTime?: string;
        createdAt: string;
        editableByChildren?: boolean;
        id: string;
        indentationLevel?: number;
        lessonId: string;
        sidebarIsHidden: boolean;
        title?: string;
        type: Types.TopicType;
        updatedAt: string;
      }
    | { __typename?: "VideoPage" }
    | { __typename?: "WorkbookPage" }
  >;
};

export const PagesCompletedByCourseDocument = gql`
  query PagesCompletedByCourse($courseId: ID!) {
    PagesCompletedByCourse(courseId: $courseId) {
      ... on ArticlePage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        catalogAsset
        clientId
        companyId
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        createdAt
        editableByChildren
        id
        indentationLevel
        lessonId
        publishDate
        title
        type
        updatedAt
        videoAsset
      }
      ... on TextPage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        body
        catalogAsset
        clientId
        companyId
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        createdAt
        editableByChildren
        id
        indentationLevel
        lessonId
        sidebarIsHidden
        title
        type
        updatedAt
      }
    }
  }
`;

/**
 * __usePagesCompletedByCourseQuery__
 *
 * To run a query within a React component, call `usePagesCompletedByCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `usePagesCompletedByCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePagesCompletedByCourseQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *   },
 * });
 */
export function usePagesCompletedByCourseQuery(
  baseOptions: Apollo.QueryHookOptions<
    PagesCompletedByCourseQuery,
    PagesCompletedByCourseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    PagesCompletedByCourseQuery,
    PagesCompletedByCourseQueryVariables
  >(PagesCompletedByCourseDocument, options);
}
export function usePagesCompletedByCourseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PagesCompletedByCourseQuery,
    PagesCompletedByCourseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    PagesCompletedByCourseQuery,
    PagesCompletedByCourseQueryVariables
  >(PagesCompletedByCourseDocument, options);
}
export type PagesCompletedByCourseQueryHookResult = ReturnType<
  typeof usePagesCompletedByCourseQuery
>;
export type PagesCompletedByCourseLazyQueryHookResult = ReturnType<
  typeof usePagesCompletedByCourseLazyQuery
>;
export type PagesCompletedByCourseQueryResult = Apollo.QueryResult<
  PagesCompletedByCourseQuery,
  PagesCompletedByCourseQueryVariables
>;
