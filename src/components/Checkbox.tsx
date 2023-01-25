import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface CheckboxProps {
  title: String;
  selected: Boolean;
  onPress(): void;
}

const Checkbox = (props: CheckboxProps) => (
  <View style={styles.row}>
    {props.selected && (
      <MaterialCommunityIcons
        name="check"
        size={30}
        color="#ffffff"
        style={styles.checked}
        onPress={props.onPress}
      />
    )}
    {!props.selected && (
      <Pressable style={styles.unchecked} onPress={props.onPress} />
    )}
    <Text style={styles.label} onPress={props.onPress}>
      {props.title}
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
