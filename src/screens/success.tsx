import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Loader } from "../components";
import { scaleDimension, theme } from "../utils";

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
    backgroundColor: theme.brand["brand-primary"],
  },

  section1: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: scaleDimension(50, false),
  },

  section2: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: scaleDimension(22, true),
  },

  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scaleDimension(10, false),
  },

  title: {
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-inverse"],
    marginBottom: scaleDimension(6, false),
  },

  message: {
    textAlign: "center",
    fontSize: scaleDimension(18, true),
    lineHeight: scaleDimension(14, false),
    color: theme.text["text-inverse"],
    margin: scaleDimension(60, true),
    marginVertical: scaleDimension(6, false),
  },
});

export default Success;
