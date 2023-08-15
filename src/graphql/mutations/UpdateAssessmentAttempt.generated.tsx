import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UpdateAssessmentAttemptMutationVariables = Types.Exact<{
  assessmentAttempt?: Types.InputMaybe<Types.AssessmentAttemptInput>;
}>;

export type UpdateAssessmentAttemptMutation = {
  __typename?: "Mutation";
  UpdateAssessmentAttempt: {
    __typename?: "AssessmentAttempt";
    id: string;
    grade?: number;
    answeredQuestionsCount?: number;
    correctQuestionsCount?: number;
  };
};

export const UpdateAssessmentAttemptDocument = gql`
  mutation UpdateAssessmentAttempt($assessmentAttempt: AssessmentAttemptInput) {
    UpdateAssessmentAttempt(assessmentAttempt: $assessmentAttempt) {
      id
      grade
      answeredQuestionsCount
      correctQuestionsCount
    }
  }
`;
export type UpdateAssessmentAttemptMutationFn = Apollo.MutationFunction<
  UpdateAssessmentAttemptMutation,
  UpdateAssessmentAttemptMutationVariables
>;

/**
 * __useUpdateAssessmentAttemptMutation__
 *
 * To run a mutation, you first call `useUpdateAssessmentAttemptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAssessmentAttemptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAssessmentAttemptMutation, { data, loading, error }] = useUpdateAssessmentAttemptMutation({
 *   variables: {
 *      assessmentAttempt: // value for 'assessmentAttempt'
 *   },
 * });
 */
export function useUpdateAssessmentAttemptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateAssessmentAttemptMutation,
    UpdateAssessmentAttemptMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateAssessmentAttemptMutation,
    UpdateAssessmentAttemptMutationVariables
  >(UpdateAssessmentAttemptDocument, options);
}
export type UpdateAssessmentAttemptMutationHookResult = ReturnType<
  typeof useUpdateAssessmentAttemptMutation
>;
export type UpdateAssessmentAttemptMutationResult =
  Apollo.MutationResult<UpdateAssessmentAttemptMutation>;
export type UpdateAssessmentAttemptMutationOptions = Apollo.BaseMutationOptions<
  UpdateAssessmentAttemptMutation,
  UpdateAssessmentAttemptMutationVariables
>;
