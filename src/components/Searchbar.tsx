import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { isEmpty } from "lodash";

interface SearchBarProps {
  searchText: string;
  setSearch(search: string): void;
}

const Searchbar = ({ searchText, setSearch }: SearchBarProps) => {
  return (
    <View style={styles.searchboxContainer}>
      <TextInput
        onChangeText={setSearch}
        value={searchText}
        defaultValue={""}
        style={styles.searchbox}
        placeholder="Search by Title, Instructor or Tag"
      />
      {isEmpty(searchText) && (
        <Pressable onPress={() => setSearch(searchText)} style={styles.magnify}>
          <MaterialCommunityIcons name="magnify" size={22} color="#232323" />
        </Pressable>
      )}
      {!isEmpty(searchText) && (
        <Pressable onPress={() => setSearch("")} style={styles.magnify}>
          <MaterialCommunityIcons
            name="close-circle-outline"
            size={22}
            color="#232323"
          />
        </Pressable>
      )}
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
