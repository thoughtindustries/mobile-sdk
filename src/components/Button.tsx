import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress(): void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
  },

  buttonText: {
    fontFamily: "Poppins-Light",
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default Button;
