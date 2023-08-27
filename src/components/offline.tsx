import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { WifiOff } from "lucide-react-native";
import { scaleDimension, theme, fonts } from "../utils";

const Offline = () => (
  <View style={styles.page}>
    <View style={styles.prompt}>
      <WifiOff
        size={scaleDimension(96, true)}
        color={theme.text["text-secondary"]}
      />
      <Text style={styles.title}>You are currently offline</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  page: {
    marginHorizontal: scaleDimension(30, true),
    height: "100%",
  },
  prompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(28, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    marginVertical: scaleDimension(6, false),
  },
  subtitle: {
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(12, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    fontFamily: fonts.poppins.regular,
  },
});

export default Offline;
