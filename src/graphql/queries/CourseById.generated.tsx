import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type CourseByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["ID"];
}>;

export type CourseByIdQuery = {
  __typename?: "Query";
  CourseById: {
    __typename?: "Course";
    id: string;
    title?: string;
    courseGroup?: {
      __typename?: "CourseGroup";
      description?: string;
      authors?: Array<string>;
      asset?: string;
    };
    sections?: Array<{
      __typename?: "Section";
      id: string;
      title?: string;
      lessons?: Array<{
        __typename?: "Lesson";
        id: string;
        title?: string;
        topics: Array<
          | { __typename?: "ArticlePage"; id: string; type: Types.TopicType }
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
          | { __typename?: "QuizPage"; id: string; type: Types.TopicType }
          | { __typename?: "RecipePage" }
          | { __typename?: "ScormPage" }
          | { __typename?: "SlideshowPage" }
          | { __typename?: "SurveyPage" }
          | { __typename?: "TallyPage" }
          | { __typename?: "TestPage" }
          | { __typename?: "TextPage"; id: string; type: Types.TopicType }
          | { __typename?: "VideoPage"; id: string; type: Types.TopicType }
          | { __typename?: "WorkbookPage" }
        >;
      }>;
    }>;
  };
};

export const CourseByIdDocument = gql`
  query CourseById($id: ID!) {
    CourseById(id: $id) {
      id
      title
      courseGroup {
        description
        authors
        asset
      }
      sections {
        id
        title
        lessons {
          id
          title
          topics {
            ... on TextPage {
              id
              type
            }
            ... on ArticlePage {
              id
              type
            }
            ... on QuizPage {
              id
              type
            }
            ... on VideoPage {
              id
              type
            }
          }
        }
      }
    }
  }
`;

/**
 * __useCourseByIdQuery__
 *
 * To run a query within a React component, call `useCourseByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCourseByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    CourseByIdQuery,
    CourseByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CourseByIdQuery, CourseByIdQueryVariables>(
    CourseByIdDocument,
    options
  );
}
export function useCourseByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CourseByIdQuery,
    CourseByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CourseByIdQuery, CourseByIdQueryVariables>(
    CourseByIdDocument,
    options
  );
}
export type CourseByIdQueryHookResult = ReturnType<typeof useCourseByIdQuery>;
export type CourseByIdLazyQueryHookResult = ReturnType<
  typeof useCourseByIdLazyQuery
>;
export type CourseByIdQueryResult = Apollo.QueryResult<
  CourseByIdQuery,
  CourseByIdQueryVariables
>;
