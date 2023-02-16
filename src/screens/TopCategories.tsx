import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AppStyle from "../../AppStyle";

const TopCategories = () => {
  return (
    <View style={AppStyle.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Top Categories</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
  },

  section: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 10,
  },
});

export default TopCategories;
