import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import Loader from "./loader";

interface LoadingBannerProps {}

const LoadingBanner: FC<LoadingBannerProps> = () => {
  return (
    <View style={styles.searching}>
      <Text style={styles.searchingText}>Loading Data</Text>
      <Loader size={50} />
    </View>
  );
};

const styles = StyleSheet.create({
  searching: {
    marginVertical: 30,
    backgroundColor: "#3B1FA3",
    borderRadius: 10,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  searchingText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Poppins_700Bold",
    padding: 20,
  },
});

export default LoadingBanner;
