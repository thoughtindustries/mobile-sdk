import React from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Search, XCircle } from "lucide-react-native";
import { isEmpty } from "lodash";
import { scaleDimension, theme } from "../utils";

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
        placeholder="Search by Title"
      />
      {isEmpty(searchText) && (
        <Pressable onPress={() => setSearch(searchText)} style={styles.magnify}>
          <Search color={theme.text["text-secondary"]} size={20} />
        </Pressable>
      )}
      {!isEmpty(searchText) && (
        <Pressable onPress={() => setSearch("")} style={styles.magnify}>
          <XCircle size={20} color={theme.text["text-secondary"]} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchboxContainer: {
    height: scaleDimension(26, false),
    display: "flex",
    flexDirection: "row",
  },
  searchbox: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.border["border-100"],
    padding: scaleDimension(10, true),
    borderRadius: scaleDimension(10, true),
    backgroundColor: theme.interface["ui-quaternary"],
    flexGrow: 1,
  },
  magnify: {
    right: scaleDimension(10, true),
    top: scaleDimension(8, false),
    position: "absolute",
  },
});

export default Searchbar;
