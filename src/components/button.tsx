import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { scaleDimension, theme, fonts } from "../utils";

interface ButtonProps {
  title: string;
  mode?: number;
  onPress(): void;
  disabled?: boolean;
}

const Button = ({ title, onPress, mode, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={mode !== 2 ? styles.button : styles.button2}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={mode !== 2 ? styles.buttonText : styles.buttonText2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: scaleDimension(10, false),
    backgroundColor: theme.brand["brand-primary"],
    borderRadius: scaleDimension(2, false),
  },
  buttonText: {
    fontFamily: fonts.inter.bold,
    color: theme.text["text-inverse"],
    fontSize: scaleDimension(20, true),
  },
  button2: {
    marginTop: scaleDimension(30, false),
    marginBottom: scaleDimension(16, false),
    justifyContent: "center",
    alignItems: "center",
    padding: scaleDimension(10, false),
    backgroundColor: theme.surface["surface-200"],
    borderColor: theme.border["border-200"],
    borderWidth: scaleDimension(1, false),
    borderRadius: scaleDimension(2, false),
  },
  buttonText2: {
    fontFamily: fonts.inter.bold,
    color: theme.text["text-primary"],
  },
});

export default Button;
