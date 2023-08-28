import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type LoadAssessmentAttemptsByTopicOrCourseQueryVariables = Types.Exact<{
  courseId?: Types.InputMaybe<Types.Scalars["ID"]>;
  topicId?: Types.InputMaybe<Types.Scalars["ID"]>;
}>;

export type LoadAssessmentAttemptsByTopicOrCourseQuery = {
  __typename?: "Query";
  LoadAssessmentAttemptsByTopicOrCourse: Array<{
    __typename?: "AssessmentAttempt";
    id: string;
    status: Types.AssessmentAttemptStatus;
    answeredQuestionsCount?: number;
    grade?: number;
    correctQuestionsCount?: number;
  }>;
};

export const LoadAssessmentAttemptsByTopicOrCourseDocument = gql`
  query LoadAssessmentAttemptsByTopicOrCourse($courseId: ID, $topicId: ID) {
    LoadAssessmentAttemptsByTopicOrCourse(
      courseId: $courseId
      topicId: $topicId
    ) {
      id
      status
      grade
      answeredQuestionsCount
      correctQuestionsCount
    }
  }
`;

/**
 * __useLoadAssessmentAttemptsByTopicOrCourseQuery__
 *
 * To run a query within a React component, call `useLoadAssessmentAttemptsByTopicOrCourseQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadAssessmentAttemptsByTopicOrCourseQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadAssessmentAttemptsByTopicOrCourseQuery({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      topicId: // value for 'topicId'
 *   },
 * });
 */
export function useLoadAssessmentAttemptsByTopicOrCourseQuery(
  baseOptions?: Apollo.QueryHookOptions<
    LoadAssessmentAttemptsByTopicOrCourseQuery,
    LoadAssessmentAttemptsByTopicOrCourseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    LoadAssessmentAttemptsByTopicOrCourseQuery,
    LoadAssessmentAttemptsByTopicOrCourseQueryVariables
  >(LoadAssessmentAttemptsByTopicOrCourseDocument, options);
}
export function useLoadAssessmentAttemptsByTopicOrCourseLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoadAssessmentAttemptsByTopicOrCourseQuery,
    LoadAssessmentAttemptsByTopicOrCourseQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoadAssessmentAttemptsByTopicOrCourseQuery,
    LoadAssessmentAttemptsByTopicOrCourseQueryVariables
  >(LoadAssessmentAttemptsByTopicOrCourseDocument, options);
}
export type LoadAssessmentAttemptsByTopicOrCourseQueryHookResult = ReturnType<
  typeof useLoadAssessmentAttemptsByTopicOrCourseQuery
>;
export type LoadAssessmentAttemptsByTopicOrCourseLazyQueryHookResult =
  ReturnType<typeof useLoadAssessmentAttemptsByTopicOrCourseLazyQuery>;
export type LoadAssessmentAttemptsByTopicOrCourseQueryResult =
  Apollo.QueryResult<
    LoadAssessmentAttemptsByTopicOrCourseQuery,
    LoadAssessmentAttemptsByTopicOrCourseQueryVariables
  >;
