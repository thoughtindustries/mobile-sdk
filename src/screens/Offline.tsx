import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "../components";
import AppStyle from "../../AppStyle";

const Offline = () => {
  return (
    <View style={AppStyle.container}>
      <View style={styles.section1}>
        <Image
          source={require("../../assets/wifix.png")}
          style={styles.networkOff}
        />
        <Text style={styles.title}>You are currently offline</Text>
        <Text style={styles.subtitle}>Get all your offline files here.</Text>
      </View>
      <View style={styles.section2}>
        <Button title="Offline Mode" onPress={() => {}} />
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

  section1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },

  section2: {
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 22,
    marginRight: 22,
  },

  title: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6B7280",
  },

  networkOff: {
    textAlign: "center",
    fontWeight: "700",
    color: "#3B1FA3",
    paddingTop: 25,
  },
});

export default Offline;
