import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = {} as const;
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A valid absolute (starting with either a valid protocol or a leading www) or relative (with a leading slash) URL string */
  AbsoluteOrRelativeURL: string;
  /** Date scalar type */
  Date: string;
  /** Hex Color scalar type */
  HexColor: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A valid relative URL string with a leading slash (/) */
  RelativeURL: string;
  /** Slug scalar type */
  Slug: string;
  /** A valid absolute URL string starting with either a valid protocol or a leading www */
  URL: string;
};

export enum SortColumn {
  CourseStartDate = "courseStartDate",
  CreatedAt = "createdAt",
  DisplayDate = "displayDate",
  Label = "label",
  LastActiveAt = "lastActiveAt",
  Name = "name",
  ParentName = "parentName",
  PublishDate = "publishDate",
  Relevance = "relevance",
  Title = "title",
  UpdatedAt = "updatedAt",
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export enum ContentItemDisplayType {
  Calendar = "calendar",
  Grid = "grid",
  List = "list",
}

export type LoginMutationVariables = Exact<{
  email: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation"; Login: string };

export type CatalogContentQueryVariables = Exact<{
  contentTypes?: InputMaybe<Array<Scalars["String"]> | Scalars["String"]>;
  labels?: InputMaybe<Array<Scalars["String"]> | Scalars["String"]>;
  page: Scalars["Int"];
  query?: InputMaybe<Scalars["String"]>;
  resultsDisplayType?: InputMaybe<ContentItemDisplayType>;
  sortColumn?: InputMaybe<SortColumn>;
  sortDirection?: InputMaybe<SortDirection>;
  token?: InputMaybe<Scalars["String"]>;
  values?: InputMaybe<Array<Scalars["String"]> | Scalars["String"]>;
}>;

export type CatalogContentQuery = {
  __typename?: "Query";
  CatalogContent: {
    __typename?: "CatalogContent";
    contentItems?: Array<{
      __typename?: "Content";
      id: string;
      asset?: string;
      authors?: Array<string>;
      title?: string;
      displayCourse?: string;
      contentTypeLabel?: string;
    }>;
  };
};

export type CourseByIdQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export enum TopicType {
  Ad = "ad",
  Article = "article",
  Assignment = "assignment",
  Audio = "audio",
  Bongo = "bongo",
  DiscussionBoard = "discussionBoard",
  Embed = "embed",
  FlipCardSet = "flipCardSet",
  HighlightZoneQuiz = "highlightZoneQuiz",
  HighlightZoneSet = "highlightZoneSet",
  Image = "image",
  InPersonEvent = "inPersonEvent",
  ListRoll = "listRoll",
  Lti = "lti",
  MatchPairSet = "matchPairSet",
  MeetingInfo = "meetingInfo",
  Notebook = "notebook",
  PdfViewer = "pdfViewer",
  Presentation = "presentation",
  Quiz = "quiz",
  Recipe = "recipe",
  ShareableContentObject = "shareableContentObject",
  Slideshow = "slideshow",
  SocialShareCardSet = "socialShareCardSet",
  Survey = "survey",
  SurveyGizmo = "surveyGizmo",
  Tally = "tally",
  Test = "test",
  Text = "text",
  Video = "video",
  Workbook = "workbook",
  XApiObject = "xApiObject",
}

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
          | { __typename?: "ArticlePage"; id: string; type: TopicType }
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
          | { __typename?: "QuizPage"; id: string; type: TopicType }
          | { __typename?: "RecipePage" }
          | { __typename?: "ScormPage" }
          | { __typename?: "SlideshowPage" }
          | { __typename?: "SurveyPage" }
          | { __typename?: "TallyPage" }
          | { __typename?: "TestPage" }
          | { __typename?: "TextPage"; id: string; type: TopicType }
          | { __typename?: "VideoPage"; id: string; type: TopicType }
          | { __typename?: "WorkbookPage" }
        >;
      }>;
    }>;
  };
};

enum AssessmentAttemptStatus {
  started,
  finished,
  pending,
}

enum AssessmentTopicType {
  quiz,
  test,
  survey,
  tally,
  workbook,
}

export type LoadAssessmentAttemptWithQuestionsQueryVariables = Exact<{
  assessmentAttemptId?: InputMaybe<Scalars["ID"]>;
  courseId?: InputMaybe<Scalars["ID"]>;
  id: Scalars["ID"];
  instructorAssessmentUserId?: InputMaybe<Scalars["ID"]>;
  linkedWorkbookId?: InputMaybe<Scalars["ID"]>;
  shouldShuffleAndSubset?: InputMaybe<Scalars["Boolean"]>;
  topicType: AssessmentTopicType;
}>;

export type LoadAssessmentAttemptWithQuestionsQuery = {
  __typename?: "Query";
  LoadAssessmentAttemptWithQuestions: {
    __typename?: "AssessmentAttempt";
    id: string;
    status: AssessmentAttemptStatus;
    grade?: number;
  };
};

export type PagesQueryVariables = Exact<{
  identifiers: Array<Scalars["String"]> | Scalars["String"];
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
    | { __typename?: "TextPage" }
    | { __typename?: "VideoPage" }
    | { __typename?: "WorkbookPage" }
  >;
};

export type PagesCompletedByCourseQueryVariables = Exact<{
  courseId: Scalars["ID"];
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
        type: TopicType;
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
        type: TopicType;
        updatedAt: string;
      }
    | { __typename?: "VideoPage" }
    | { __typename?: "WorkbookPage" }
  >;
};

export enum ContentKind {
  Article = "article",
  Bundle = "bundle",
  Course = "course",
  CourseGroup = "courseGroup",
  DiscountGroup = "discountGroup",
  InPersonEvent = "inPersonEvent",
  InPersonEventCourse = "inPersonEventCourse",
  LearningPath = "learningPath",
  MicroCourse = "microCourse",
  PickableGroup = "pickableGroup",
  Product = "product",
  Sellable = "sellable",
  ShareableContentObject = "shareableContentObject",
  Video = "video",
  Webinar = "webinar",
  WebinarCourse = "webinarCourse",
  XApiObject = "xApiObject",
}

export type UserContentItemsQueryVariables = Exact<{
  kind?: InputMaybe<Array<ContentKind> | ContentKind>;
  query?: InputMaybe<Scalars["String"]>;
  sortColumn?: InputMaybe<SortColumn>;
  sortDirection?: InputMaybe<SortDirection>;
}>;

export type UserContentItemsQuery = {
  __typename?: "Query";
  UserContentItems?: Array<{
    __typename?: "Content";
    id: string;
    asset?: string;
    contentTypeLabel?: string;
    displayCourse?: string;
    title?: string;
  }>;
};

export type UserCourseProgressQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type UserCourseProgressQuery = {
  __typename?: "Query";
  UserCourseProgress?: {
    __typename?: "UserProgress";
    totalViews?: number;
    totalTime?: number;
    percentComplete?: number;
  };
};

export type UserRecentContentQueryVariables = Exact<{
  limit?: InputMaybe<Scalars["Int"]>;
}>;

export type UserRecentContentQuery = {
  __typename?: "Query";
  UserRecentContent: Array<{
    __typename?: "Content";
    title?: string;
    description?: string;
    asset?: string;
  }>;
};

export const LoginDocument = gql`
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password)
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const CatalogContentDocument = gql`
  query CatalogContent(
    $contentTypes: [String!]
    $labels: [String!]
    $page: Int!
    $query: String
    $resultsDisplayType: ContentItemDisplayType
    $sortColumn: SortColumn
    $sortDirection: SortDirection
    $token: String
    $values: [String!]
  ) {
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
export function useCatalogContentQuery(
  baseOptions: Apollo.QueryHookOptions<
    CatalogContentQuery,
    CatalogContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CatalogContentQuery, CatalogContentQueryVariables>(
    CatalogContentDocument,
    options
  );
}
export function useCatalogContentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CatalogContentQuery,
    CatalogContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CatalogContentQuery, CatalogContentQueryVariables>(
    CatalogContentDocument,
    options
  );
}
export type CatalogContentQueryHookResult = ReturnType<
  typeof useCatalogContentQuery
>;
export type CatalogContentLazyQueryHookResult = ReturnType<
  typeof useCatalogContentLazyQuery
>;
export type CatalogContentQueryResult = Apollo.QueryResult<
  CatalogContentQuery,
  CatalogContentQueryVariables
>;
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
export const LoadAssessmentAttemptWithQuestionsDocument = gql`
  query LoadAssessmentAttemptWithQuestions(
    $assessmentAttemptId: ID
    $courseId: ID
    $id: ID!
    $instructorAssessmentUserId: ID
    $linkedWorkbookId: ID
    $shouldShuffleAndSubset: Boolean
    $topicType: AssessmentTopicType!
  ) {
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
export function useLoadAssessmentAttemptWithQuestionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    LoadAssessmentAttemptWithQuestionsQuery,
    LoadAssessmentAttemptWithQuestionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    LoadAssessmentAttemptWithQuestionsQuery,
    LoadAssessmentAttemptWithQuestionsQueryVariables
  >(LoadAssessmentAttemptWithQuestionsDocument, options);
}
export function useLoadAssessmentAttemptWithQuestionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    LoadAssessmentAttemptWithQuestionsQuery,
    LoadAssessmentAttemptWithQuestionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    LoadAssessmentAttemptWithQuestionsQuery,
    LoadAssessmentAttemptWithQuestionsQueryVariables
  >(LoadAssessmentAttemptWithQuestionsDocument, options);
}
export type LoadAssessmentAttemptWithQuestionsQueryHookResult = ReturnType<
  typeof useLoadAssessmentAttemptWithQuestionsQuery
>;
export type LoadAssessmentAttemptWithQuestionsLazyQueryHookResult = ReturnType<
  typeof useLoadAssessmentAttemptWithQuestionsLazyQuery
>;
export type LoadAssessmentAttemptWithQuestionsQueryResult = Apollo.QueryResult<
  LoadAssessmentAttemptWithQuestionsQuery,
  LoadAssessmentAttemptWithQuestionsQueryVariables
>;
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
export const UserContentItemsDocument = gql`
  query UserContentItems(
    $kind: [ContentKind!]
    $query: String
    $sortColumn: SortColumn
    $sortDirection: SortDirection
  ) {
    UserContentItems(
      kind: $kind
      query: $query
      sortColumn: $sortColumn
      sortDirection: $sortDirection
    ) {
      id
      asset
      contentTypeLabel
      displayCourse
      title
    }
  }
`;

/**
 * __useUserContentItemsQuery__
 *
 * To run a query within a React component, call `useUserContentItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserContentItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserContentItemsQuery({
 *   variables: {
 *      kind: // value for 'kind'
 *      query: // value for 'query'
 *      sortColumn: // value for 'sortColumn'
 *      sortDirection: // value for 'sortDirection'
 *   },
 * });
 */
export function useUserContentItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserContentItemsQuery, UserContentItemsQueryVariables>(
    UserContentItemsDocument,
    options
  );
}
export function useUserContentItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserContentItemsQuery,
    UserContentItemsQueryVariables
  >(UserContentItemsDocument, options);
}
export type UserContentItemsQueryHookResult = ReturnType<
  typeof useUserContentItemsQuery
>;
export type UserContentItemsLazyQueryHookResult = ReturnType<
  typeof useUserContentItemsLazyQuery
>;
export type UserContentItemsQueryResult = Apollo.QueryResult<
  UserContentItemsQuery,
  UserContentItemsQueryVariables
>;
export const UserCourseProgressDocument = gql`
  query UserCourseProgress($id: ID!) {
    UserCourseProgress(id: $id) {
      totalViews
      totalTime
      percentComplete
    }
  }
`;

/**
 * __useUserCourseProgressQuery__
 *
 * To run a query within a React component, call `useUserCourseProgressQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserCourseProgressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserCourseProgressQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserCourseProgressQuery(
  baseOptions: Apollo.QueryHookOptions<
    UserCourseProgressQuery,
    UserCourseProgressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    UserCourseProgressQuery,
    UserCourseProgressQueryVariables
  >(UserCourseProgressDocument, options);
}
export function useUserCourseProgressLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserCourseProgressQuery,
    UserCourseProgressQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserCourseProgressQuery,
    UserCourseProgressQueryVariables
  >(UserCourseProgressDocument, options);
}
export type UserCourseProgressQueryHookResult = ReturnType<
  typeof useUserCourseProgressQuery
>;
export type UserCourseProgressLazyQueryHookResult = ReturnType<
  typeof useUserCourseProgressLazyQuery
>;
export type UserCourseProgressQueryResult = Apollo.QueryResult<
  UserCourseProgressQuery,
  UserCourseProgressQueryVariables
>;
export const UserRecentContentDocument = gql`
  query UserRecentContent($limit: Int) {
    UserRecentContent(limit: $limit) {
      title
      description
      asset
    }
  }
`;

/**
 * __useUserRecentContentQuery__
 *
 * To run a query within a React component, call `useUserRecentContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserRecentContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserRecentContentQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useUserRecentContentQuery(
  baseOptions?: Apollo.QueryHookOptions<
    UserRecentContentQuery,
    UserRecentContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    UserRecentContentQuery,
    UserRecentContentQueryVariables
  >(UserRecentContentDocument, options);
}
export function useUserRecentContentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserRecentContentQuery,
    UserRecentContentQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    UserRecentContentQuery,
    UserRecentContentQueryVariables
  >(UserRecentContentDocument, options);
}
export type UserRecentContentQueryHookResult = ReturnType<
  typeof useUserRecentContentQuery
>;
export type UserRecentContentLazyQueryHookResult = ReturnType<
  typeof useUserRecentContentLazyQuery
>;
export type UserRecentContentQueryResult = Apollo.QueryResult<
  UserRecentContentQuery,
  UserRecentContentQueryVariables
>;
