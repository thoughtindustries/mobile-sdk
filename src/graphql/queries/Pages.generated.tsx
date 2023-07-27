import * as Types from "../global-types";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type PagesQueryVariables = Types.Exact<{
  identifiers: Array<Types.Scalars["String"]> | Types.Scalars["String"];
}>;

export type PagesQuery = {
  __typename?: "Query";
  Pages: Array<
    | {
        __typename?: "ArticlePage";
        videoAsset?: string;
        languages: Array<{
          __typename?: "ArticlePageLanguage";
          language?: string;
          label?: string;
          title?: string;
          subtitle?: string;
          body?: string;
          copyright?: string;
          allowAudioDownload?: boolean;
          audioAsset?: string;
          audioAssetUrl?: string;
          externalUrl?: string;
          externalUrlCallToAction?: string;
          pdfAsset?: string;
          pdfAssetSecondary?: string;
          pdfAssetSecondaryUrl?: string;
          pdfAssetTitle?: string;
          pdfAssetTitleSecondary?: string;
          pdfAssetUrl?: string;
        }>;
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
    | { __typename?: "TextPage"; title?: string }
    | { __typename?: "VideoPage" }
    | { __typename?: "WorkbookPage" }
  >;
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
      ... on TextPage {
        title
        body
        type
      }
      ... on VideoPage {
        title
        asset
        body
        preTextBlock
        type
      }
      ... on QuizPage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        allowToResume
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        continueAfterTimerExpires
        displayAllHints
        displayAttemptNumbers
        editableByChildren
        failMessage
        hintControlEnabled
        id
        indentationLevel
        instructorAssessment
        isGraded
        maxAttempts
        minPassingPercent
        navigationDisabled
        questions {
          additionalContent
          body
          choices {
            altText
            asset
            choiceId
            correct
            points
            response
            value
          }
          fileSubmissionAsset
          gradedAsCorrect
          hasChoices
          isBooleanChoice
          isEssay
          isFileSubmission
          isImageComparison
          isLikert
          isMultipleChoice
          isOpenEnded
          isSelectBoxes
          isTable
          mustSelectAllCorrectChoices
          openEndedResponse
          parentQuestion
          placeholder
          postText
          postText2
          preText
          preText2
          preselectedChoices {
            choiceId
          }
          questionId
          questionCategoryId
          questionType
          required
          response
          selectedChoice {
            choiceId
          }
          shouldCheckAnswers
          shouldDisplayOnResults
          table {
            headers {
              locked
              value
              weight
            }
            rows {
              locked
              value
              weight
            }
          }
          tableResponse {
            headers {
              locked
              value
              weight
            }
            rows {
              locked
              value
              weight
            }
          }
          type
        }
        passMessage
        preventProgression
        questionSkipEnabled
        showAnswerAfterPass
        startMessage
        timeLimitInSeconds
        timePerQuestionInSeconds
        timerEnabled
        title
        type
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
