import { View, StyleSheet } from "react-native";
import { PageWrapperProps } from "./types";
import { FC } from "react";

const PageWrapper: FC<PageWrapperProps> = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F3F4F6",
    fontFamily: "Poppins_400Regular",
  },
});

export default PageWrapper;
