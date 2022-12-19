import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

interface LinkProps {
  title: string;
  onPress(): void;
}

const Link = ({title, onPress}: LinkProps) => {
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
    padding: 16,
  },

  linkText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#3B1FA3",
  },
});

export default Link;



