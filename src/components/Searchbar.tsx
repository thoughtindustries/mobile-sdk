import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchBarProps {
  searchText: string;
  onSearch(str: string): void;
}

const Searchbar = ({ searchText, onSearch }: SearchBarProps) => {
  const saveSearchText = (txt: string) => {
    searchText = txt;
  };

  return (
    <View style={styles.searchboxContainer}>
      <TextInput
        onChangeText={saveSearchText}
        defaultValue={searchText}
        style={styles.searchbox}
        placeholder="Search by Title, Instructor or Tag"
      />
      <Pressable onPress={() => onSearch(searchText)} style={styles.magnify}>
        <MaterialCommunityIcons name="magnify" size={22} color="#232323" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  searchboxContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
  },
  searchbox: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  magnify: {
    right: 10,
    top: 15,
    position: "absolute",
  },
});

export default Searchbar;
