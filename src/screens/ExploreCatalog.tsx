import React, { useState, useEffect } from "react";
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
} from "react-native";

import CheckBox from "@react-native-community/checkbox";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType } from "../../types";

const ExploreCatalog = () => {
  const [filters, setFilters] = useState({
    search: "",
    duration: "",
    difficulty: "",
    tags: "",
    page: 0,
    searching: false,
  });
  const [courses, setCourses] = useState<courseListType[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const fetchCourses = () => {
    setFilters({ ...filters, page: filters.page + 1 });
    tiGql
      .fetchCourses({ page: filters.page })
      .then((data) => setCourses([...courses, ...data]))
      .then(() => console.log("page : ", filters.page))
      .catch(console.log);
  };

  useEffect(() => console.log(courses), [courses]);

  useEffect(fetchCourses, []);

  const goSearch = () => {
    console.log(filters.search);
  };

  const SearchBar = () => {
    return (
      <View style={styles.searchboxContainer}>
        <TextInput
          onChangeText={(text) => setFilters({ ...filters, search: text })}
          defaultValue={filters.search}
          style={styles.searchbox}
          placeholder="Search by Title, Instructor or Tag"
        />
        <Pressable onPress={() => goSearch()} style={styles.magnify}>
          <MaterialCommunityIcons name="magnify" size={22} color="#232323" />
        </Pressable>
        <Pressable style={styles.filterbtn} onPress={() => setShowFilter(true)}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={25}
            color="#232323"
          />
        </Pressable>
      </View>
    );
  };

  const CourseItem = (props: { data: courseListType }) => {
    return (
      <View style={styles.courseRow}>
        <View style={styles.courseLeftBox}>
          <Text style={styles.courseTitle}>{props.data.title}</Text>
          {props.data.authors.length > 0 && (
            <Text style={styles.courseAuthor}>
              By {props.data.authors.join(",")}
            </Text>
          )}
        </View>
        <Image source={{ uri: props.data.asset }} style={styles.courseImage} />
      </View>
    );
  };

  const CourseFilter = () => {
    return (
      <Modal animationType="slide" transparent={true} visible={showFilter}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeading}>Filters</Text>

          <ScrollView>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Duration</Text>
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Difficulty Level</Text>
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Tags</Text>
            </View>
          </ScrollView>

          <View style={styles.row}>
            <Pressable
              style={styles.clearbtn}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.clearbtntxt}>Clear All</Text>
            </Pressable>

            <Pressable
              style={styles.applybtn}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.applybtntxt}>Apply Filter</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Explore The Catalog</Text>

      <SearchBar />
      {filters.searching && <Text>Loading</Text>}
      {courses.length > 0 && (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseItem data={item} />}
          onEndReached={fetchCourses}
          onEndReachedThreshold={0.5}
          style={styles.listStyle}
        />
      )}
      <CourseFilter />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    margin: 10,
    marginBottom: 10,
  },

  title: {
    paddingTop: 10,
    fontSize: 20,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    marginTop: 20,
    fontFamily: "Poppins_700Bold",
  },

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
    right: 70,
    top: 15,
    position: "absolute",
  },

  filterbtn: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
    width: 50,
    height: 50,
    marginLeft: 5,
    alignSelf: "center",
  },

  courseRow: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: "#ccc",
  },

  courseLeftBox: {
    flexGrow: 1,
  },

  courseTitle: {
    fontSize: 16,
    maxWidth: "80%",
    lineHeight: 24,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },

  courseAuthor: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "#6B7280",
  },

  courseImage: {
    width: 75,
    height: 75,
    borderRadius: 15,
  },

  filterContainer: {
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 10,
    borderRadius: 20,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  filterHeading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },

  filterBox: {
    borderTopWidth: 1,
    padding: 10,
    borderTopColor: "#D1D5DB",
  },

  filterTitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 16,
    color: "#1F2937",
    fontFamily: "Poppins_400Regular",
  },

  clearbtn: {
    flexGrow: 1,
    margin: 2,
  },

  clearbtntxt: {
    color: "#3B1FA3",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  applybtn: {
    flexGrow: 1,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
    margin: 2,
  },

  applybtntxt: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },
});

export default ExploreCatalog;
