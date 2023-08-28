import React from "react";
import { Image, StyleSheet } from "react-native";
import { scaleDimension } from "../utils";

const Logo = () => (
  <Image source={require("../../assets/logo.png")} style={style.logo} />
);

const style = StyleSheet.create({
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scaleDimension(10, true),
    height: scaleDimension(70, true),
    width: scaleDimension(80, true),
  },
});

export default Logo;
