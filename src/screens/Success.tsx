import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Loader } from "../components";

interface SuccessProps {
  title: string;
  message: string;
}

const Success = ({ title, message }: SuccessProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.section1}>
        <Image
          source={require("../../assets/logo-white.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>{title}</Text>
        {message.split("\n").map((msg, index) => (
          <Text key={index} style={styles.message}>
            {msg}
          </Text>
        ))}
      </View>
      <View style={styles.section2}>
        <Loader size={50} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#3B1FA3",
  },

  section1: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
    marginBottom: 100,
  },

  section2: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 22,
    marginRight: 22,
  },

  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 10,
  },

  message: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#ffffff",
    margin: 60,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Success;
