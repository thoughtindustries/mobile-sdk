import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type CreateAssessmentAttemptMutationVariables = Types.Exact<{
  courseId: Types.Scalars["ID"];
  questions: Array<Types.QuestionInput> | Types.QuestionInput;
  topicId: Types.Scalars["ID"];
}>;

export type CreateAssessmentAttemptMutation = {
  __typename?: "Mutation";
  CreateAssessmentAttempt: { __typename?: "AssessmentAttempt"; id: string };
};

export const CreateAssessmentAttemptDocument = gql`
  mutation CreateAssessmentAttempt(
    $courseId: ID!
    $questions: [QuestionInput!]!
    $topicId: ID!
  ) {
    CreateAssessmentAttempt(
      courseId: $courseId
      questions: $questions
      topicId: $topicId
    ) {
      id
    }
  }
`;
export type CreateAssessmentAttemptMutationFn = Apollo.MutationFunction<
  CreateAssessmentAttemptMutation,
  CreateAssessmentAttemptMutationVariables
>;

/**
 * __useCreateAssessmentAttemptMutation__
 *
 * To run a mutation, you first call `useCreateAssessmentAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAssessmentAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAssessmentAttemptMutation, { data, loading, error }] = useCreateAssessmentAttemptMutation({
 *   variables: {
 *      courseId: // value for 'courseId'
 *      questions: // value for 'questions'
 *      topicId: // value for 'topicId'
 *   },
 * });
 */
export function useCreateAssessmentAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateAssessmentAttemptMutation,
    CreateAssessmentAttemptMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateAssessmentAttemptMutation,
    CreateAssessmentAttemptMutationVariables
  >(CreateAssessmentAttemptDocument, options);
}
export type CreateAssessmentAttemptMutationHookResult = ReturnType<
  typeof useCreateAssessmentAttemptMutation
>;
export type CreateAssessmentAttemptMutationResult =
  Apollo.MutationResult<CreateAssessmentAttemptMutation>;
export type CreateAssessmentAttemptMutationOptions = Apollo.BaseMutationOptions<
  CreateAssessmentAttemptMutation,
  CreateAssessmentAttemptMutationVariables
>;
