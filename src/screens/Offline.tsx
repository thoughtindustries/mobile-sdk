import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../components";
import AppStyle from "../../AppStyle";
import { WifiOff } from "lucide-react-native";

const Offline = () => {
  return (
    <View style={AppStyle.container}>
      <View style={styles.prompt}>
        <WifiOff size={96} color="#6B7280" />
        <Text style={styles.title}>You are currently offline</Text>
        <Text style={styles.subtitle}>Get all your offline files here.</Text>
      </View>
      <View style={styles.offlineButton}>
        <Button title="Offline Mode" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  prompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  offlineButton: {
    width: "100%",
    marginBottom: "45%",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "Poppins_400Regular",
  },
  networkOff: {
    textAlign: "center",
    fontWeight: "700",
    color: "#3B1FA3",
    paddingTop: 25,
  },
});

export default Offline;
