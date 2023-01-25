import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
  TextInputProps,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Searchbar = (props: {
  searchText: string;
  onSearch(str: string): void;
}) => {
  let searchText = props.searchText;

  const saveSearchText = (txt: string) => {
    searchText = txt;
  };

  return (
    <View style={styles.searchboxContainer}>
      <TextInput
        onChangeText={saveSearchText}
        defaultValue={props.searchText}
        style={styles.searchbox}
        placeholder="Search by Title, Instructor or Tag"
      />
      <Pressable
        onPress={() => props.onSearch(searchText)}
        style={styles.magnify}
      >
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

  listStyle: {
    marginBottom: 120,
    marginLeft: -10,
    marginRight: -10,
  },

  magnify: {
    right: 10,
    top: 15,
    position: "absolute",
  },
});

export default Searchbar;
