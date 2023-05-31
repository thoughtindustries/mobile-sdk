import { View, StyleSheet, ViewStyle } from "react-native";
import { PageWrapperProps } from "./types";
import { FC } from "react";

const PageWrapper: FC<PageWrapperProps> = ({ children, styles }) => (
  <View style={pageWrapperStyles(styles).container}>{children}</View>
);

const pageWrapperStyles = (styles: ViewStyle) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      fontFamily: "Poppins_400Regular",
      ...styles,
    },
  });

export default PageWrapper;
