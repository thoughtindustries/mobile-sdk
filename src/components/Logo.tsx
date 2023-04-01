import React from "react";
import { Image, Dimensions, StyleSheet } from "react-native";

const Logo = () => (
  <Image source={require("../../assets/logo.png")} style={style.logo} />
);

const style = StyleSheet.create({
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: (Dimensions.get("window").height / 440) * 10,
    height: (Dimensions.get("window").width / 440) * 70,
    width: (Dimensions.get("window").width / 440) * 80,
  },
});

export default Logo;
