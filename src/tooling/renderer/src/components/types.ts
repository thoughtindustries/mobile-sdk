import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export type StackNavigationProps = {
  children: ReactNode;
  styles: ViewStyle;
};

export type PageWrapperProps = {
  children: ReactNode;
};
