import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { fonts, scaleDimension, theme } from "../utils";

interface CheckboxProps {
  title: String;
  selected: Boolean;
  onPress(): void;
}

const Checkbox = ({ selected, title, onPress }: CheckboxProps) => (
  <View style={styles.row}>
    <TouchableOpacity
      style={selected ? styles.checked : styles.unchecked}
      onPress={onPress}
    >
      <Check size={30} color={theme.text["text-inverse"]} />
    </TouchableOpacity>
    <Text style={styles.label} onPress={onPress}>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    marginTop: scaleDimension(6, false),
  },
  checked: {
    backgroundColor: theme.brand["brand-primary"],
    width: scaleDimension(16, false),
    height: scaleDimension(16, false),
    borderRadius: scaleDimension(2, false),
  },
  unchecked: {
    borderWidth: 1,
    borderColor: theme.border["border-200"],
    width: scaleDimension(16, false),
    height: scaleDimension(16, false),
    borderRadius: scaleDimension(2, false),
  },
  label: {
    fontSize: scaleDimension(8, false),
    fontFamily: fonts.inter.regular,
    color: theme.text["text-primary"],
    lineHeight: scaleDimension(16, false),
    marginLeft: scaleDimension(12, true),
  },
});

export default Checkbox;
