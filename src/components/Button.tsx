import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  mode?: number;
  onPress(): void;
}

const Button = ({ title, onPress, mode }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={mode !== 2 ? styles.button : styles.button2}
      onPress={onPress}
    >
      <Text style={mode !== 2 ? styles.buttonText : styles.buttonText2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
  },

  buttonText: {
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },

  button2: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
