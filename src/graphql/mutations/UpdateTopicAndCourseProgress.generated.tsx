import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type UpdateTopicAndCourseProgressMutationVariables = Types.Exact<{
  progress: Types.Scalars["Int"];
  topicId: Types.Scalars["ID"];
}>;

export type UpdateTopicAndCourseProgressMutation = {
  __typename?: "Mutation";
  UpdateTopicAndCourseProgress: boolean;
};

export const UpdateTopicAndCourseProgressDocument = gql`
  mutation UpdateTopicAndCourseProgress($progress: Int!, $topicId: ID!) {
    UpdateTopicAndCourseProgress(progress: $progress, topicId: $topicId)
  }
`;
export type UpdateTopicAndCourseProgressMutationFn = Apollo.MutationFunction<
  UpdateTopicAndCourseProgressMutation,
  UpdateTopicAndCourseProgressMutationVariables
>;

/**
 * __useUpdateTopicAndCourseProgressMutation__
 *
 * To run a mutation, you first call `useUpdateTopicAndCourseProgressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTopicAndCourseProgressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTopicAndCourseProgressMutation, { data, loading, error }] = useUpdateTopicAndCourseProgressMutation({
 *   variables: {
 *      progress: // value for 'progress'
 *      topicId: // value for 'topicId'
 *   },
 * });
 */
export function useUpdateTopicAndCourseProgressMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateTopicAndCourseProgressMutation,
    UpdateTopicAndCourseProgressMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateTopicAndCourseProgressMutation,
    UpdateTopicAndCourseProgressMutationVariables
  >(UpdateTopicAndCourseProgressDocument, options);
}
export type UpdateTopicAndCourseProgressMutationHookResult = ReturnType<
  typeof useUpdateTopicAndCourseProgressMutation
>;
export type UpdateTopicAndCourseProgressMutationResult =
  Apollo.MutationResult<UpdateTopicAndCourseProgressMutation>;
export type UpdateTopicAndCourseProgressMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateTopicAndCourseProgressMutation,
    UpdateTopicAndCourseProgressMutationVariables
  >;
