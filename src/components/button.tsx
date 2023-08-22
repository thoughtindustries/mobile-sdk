import React from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

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
    padding: (Dimensions.get("window").height / 440) * 10,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
  },

  buttonText: {
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
    fontSize: (Dimensions.get("window").width / 440) * 20,
  },

  button2: {
    marginTop: (Dimensions.get("window").height / 440) * 30,
    marginBottom: (Dimensions.get("window").height / 440) * 16,
    justifyContent: "center",
    alignItems: "center",
    padding: (Dimensions.get("window").height / 440) * 10,
    backgroundColor: "#FAFAFA",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 4,
  },

  buttonText2: {
    fontFamily: "Inter_700Bold",
    color: "#1F2937",
  },
});

export default Button;
