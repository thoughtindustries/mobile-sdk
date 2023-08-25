import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { fonts, scaleDimension, theme } from "../utils";

interface LinkProps {
  title: string;
  onPress(): void;
}

const Link = ({ title, onPress }: LinkProps) => {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress}>
      <Text style={styles.linkText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    justifyContent: "center",
    alignItems: "center",
    padding: scaleDimension(16, true),
  },

  linkText: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(18, true),
    color: theme.brand["brand-primary"],
  },
});

export default Link;
