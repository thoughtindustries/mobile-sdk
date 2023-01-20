export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Registration: undefined;
  Success: undefined;
  Offline: undefined;
  Home: undefined;
  MyLearning: undefined;
  TopCategories: undefined;
  Explore: undefined;
  Account: undefined;
  ProfileEdit: undefined;
};

export type UserDetailType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address1?: string;
  address2?: string;
  asset: string;
  roleKey: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  telephone?: string;
  externalCustomerId?: string;
  lang?: string;
  ref1?: string;
  ref2?: string;
  ref3?: string;
  ref4?: string;
  ref5?: string;
  ref6?: string;
  ref7?: string;
  ref8?: string;
  ref9?: string;
  ref10?: string;
};

export type courseListType = {
  id: string;
  asset: string;
  authors?: string[];
  title: string;
  displayCourse?: string;
  contentTypeLabel?: string;
};

export type filtersType = {
  sortBy: string;
  sortDir: string;
  duration: string;
  difficulty: string;
  tag: string;
};
