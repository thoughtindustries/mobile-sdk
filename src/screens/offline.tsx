import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../components";
import { WifiOff } from "lucide-react-native";
import { fonts, scaleDimension, theme } from "../utils";

const Offline = () => {
  return (
    <View style={styles.container}>
      <View style={styles.prompt}>
        <WifiOff
          size={scaleDimension(96, true)}
          color={theme.text["text-secondary"]}
        />
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
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: scaleDimension(16, false),
    paddingTop: scaleDimension(30, false),
  },
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
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(28, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    marginBottom: scaleDimension(6, false),
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
