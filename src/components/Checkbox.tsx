import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface CheckboxProps {
  title: String;
  selected: Boolean;
  onPress(): void;
}

const Checkbox = ({ selected, title, onPress }: CheckboxProps) => (
  <View style={styles.row}>
    {selected && (
      <MaterialCommunityIcons
        name="check"
        size={30}
        color="#ffffff"
        style={styles.checked}
        onPress={onPress}
      />
    )}
    {!selected && <Pressable style={styles.unchecked} onPress={onPress} />}
    <Text style={styles.label} onPress={onPress}>
      {title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
  },
  checked: {
    backgroundColor: "#3B1FA3",
    width: 30,
    height: 30,
    borderRadius: 2,
  },
  unchecked: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    width: 30,
    height: 30,
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
    lineHeight: 28,
    marginLeft: 10,
  },
});

export default Checkbox;
