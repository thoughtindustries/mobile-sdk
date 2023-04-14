import * as Types from '../global-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LoadAssessmentAttemptWithQuestionsQueryVariables = Types.Exact<{
  assessmentAttemptId?: Types.InputMaybe<Types.Scalars['ID']>;
  courseId?: Types.InputMaybe<Types.Scalars['ID']>;
  id: Types.Scalars['ID'];
  instructorAssessmentUserId?: Types.InputMaybe<Types.Scalars['ID']>;
  linkedWorkbookId?: Types.InputMaybe<Types.Scalars['ID']>;
  shouldShuffleAndSubset?: Types.InputMaybe<Types.Scalars['Boolean']>;
  topicType: Types.AssessmentTopicType;
}>;


export type LoadAssessmentAttemptWithQuestionsQuery = { __typename?: 'Query', LoadAssessmentAttemptWithQuestions: { __typename?: 'AssessmentAttempt', id: string, status: Types.AssessmentAttemptStatus, grade?: number } };


export const LoadAssessmentAttemptWithQuestionsDocument = gql`
    query LoadAssessmentAttemptWithQuestions($assessmentAttemptId: ID, $courseId: ID, $id: ID!, $instructorAssessmentUserId: ID, $linkedWorkbookId: ID, $shouldShuffleAndSubset: Boolean, $topicType: AssessmentTopicType!) {
  LoadAssessmentAttemptWithQuestions(
    assessmentAttemptId: $assessmentAttemptId
    courseId: $courseId
    id: $id
    instructorAssessmentUserId: $instructorAssessmentUserId
    linkedWorkbookId: $linkedWorkbookId
    shouldShuffleAndSubset: $shouldShuffleAndSubset
    topicType: $topicType
  ) {
    id
    status
    grade
  }
}
    `;

/**
 * __useLoadAssessmentAttemptWithQuestionsQuery__
 *
 * To run a query within a React component, call `useLoadAssessmentAttemptWithQuestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoadAssessmentAttemptWithQuestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoadAssessmentAttemptWithQuestionsQuery({
 *   variables: {
 *      assessmentAttemptId: // value for 'assessmentAttemptId'
 *      courseId: // value for 'courseId'
 *      id: // value for 'id'
 *      instructorAssessmentUserId: // value for 'instructorAssessmentUserId'
 *      linkedWorkbookId: // value for 'linkedWorkbookId'
 *      shouldShuffleAndSubset: // value for 'shouldShuffleAndSubset'
 *      topicType: // value for 'topicType'
 *   },
 * });
 */
export function useLoadAssessmentAttemptWithQuestionsQuery(baseOptions: Apollo.QueryHookOptions<LoadAssessmentAttemptWithQuestionsQuery, LoadAssessmentAttemptWithQuestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoadAssessmentAttemptWithQuestionsQuery, LoadAssessmentAttemptWithQuestionsQueryVariables>(LoadAssessmentAttemptWithQuestionsDocument, options);
      }
export function useLoadAssessmentAttemptWithQuestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoadAssessmentAttemptWithQuestionsQuery, LoadAssessmentAttemptWithQuestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoadAssessmentAttemptWithQuestionsQuery, LoadAssessmentAttemptWithQuestionsQueryVariables>(LoadAssessmentAttemptWithQuestionsDocument, options);
        }
export type LoadAssessmentAttemptWithQuestionsQueryHookResult = ReturnType<typeof useLoadAssessmentAttemptWithQuestionsQuery>;
export type LoadAssessmentAttemptWithQuestionsLazyQueryHookResult = ReturnType<typeof useLoadAssessmentAttemptWithQuestionsLazyQuery>;
export type LoadAssessmentAttemptWithQuestionsQueryResult = Apollo.QueryResult<LoadAssessmentAttemptWithQuestionsQuery, LoadAssessmentAttemptWithQuestionsQueryVariables>;