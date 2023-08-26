import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fonts, scaleDimension, theme } from "../utils";

const TopCategories = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Top Categories</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: scaleDimension(16, false),
    paddingTop: scaleDimension(30, false),
  },
  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },

  title: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    marginBottom: scaleDimension(6, false),
  },
});

export default TopCategories;
