import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Loader from "./loader";
import { fonts, scaleDimension, theme } from "../utils";

const LoadingBanner = () => {
  return (
    <View style={styles.banner}>
      <Text style={styles.prompt}>Loading Data</Text>
      <Loader size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginVertical: scaleDimension(30, true),
    backgroundColor: theme.brand["brand-primary"],
    borderRadius: scaleDimension(10, true),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scaleDimension(24, true),
  },
  prompt: {
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(12, false),
    textAlign: "center",
    color: theme.text["text-inverse"],
    fontFamily: fonts.poppins.bold,
    marginBottom: scaleDimension(24, true),
  },
});

export default LoadingBanner;
