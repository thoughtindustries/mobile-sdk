import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { GlobalTypes } from "./src/graphql";

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Registration: undefined;
  Success: undefined;
  Offline: undefined;
  HomeScreen: undefined;
  MyLearning: undefined;
  CourseDetails: {
    cid: string;
    title: string;
    asset: string;
    contentTypeLabel?: string;
    description?: string;
  };
  TopCategories: undefined;
  Explore: undefined;
  Account: undefined;
  Home: undefined;
  ContentDetails: {
    cid: string;
    from: string;
  };
  ProfileEdit: undefined;
  ExploreCourse: {
    cid: string;
    course: string;
    section: string;
    lesson: string;
    progress: number;
    topics: topicType[];
    from: string;
  };
};

export type UserDetailType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  asset: string;
};

export type courseListType = {
  id: string;
  asset?: string;
  authors?: string[];
  title?: string;
  displayCourse?: string;
  contentTypeLabel?: string;
  progress?: Float;
  description?: string;
  customFields?: {
    duration: string[];
    "level-of-difficulty": string[];
  };
  kind?: string;
};

export type topicType = {
  id: string;
  language?: null | string;
  label: string;
  title?: string;
  subtitle?: string;
  body?: string;
  copyright?: string;
  asset?: string;
  videoAsset?: string;
  externalUrlCallToAction?: string;
};

export type pageType = {
  languages: topicType[];
  videoAsset?: string;
};

export type filtersType = {
  sortBy?: GlobalTypes.SortColumn;
  sortDir: GlobalTypes.SortDirection;
  labels: string[];
  values: string[];
};

export type contentListType = {
  course: pageType[];
  progress: String[];
};

export type userRecentContentType = {
  id: string;
  title: string;
  asset: string;
  description: string;
};

export type QuestionChoice = {
  altText?: string;
  asset?: string;
  choiceId?: string;
  correct?: boolean;
  points?: number;
  response?: string;
  value: string;
};

export type ErrorMessageType = {
  title: string;
  message: string;
};

export enum Screens {
  ContentDetails = "ContentDetails",
  Home = "Home",
}
