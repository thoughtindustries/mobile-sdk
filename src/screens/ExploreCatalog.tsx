import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType } from "../../types";

const ExploreCatalog = () => {
  const [filters, setFilters] = useState({
    search: "",
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

  return (
    <View>
      <View>
        <Text style={styles.title}>Explore The Catalog</Text>
      </View>
      <SearchBar />
      {filters.searching && <Text>Loading</Text>}
      {courses.length > 0 && (
        <FlatList
          data={courses}
          renderItem={({ item }) => <CourseItem data={item} />}
          onEndReached={fetchCourses}
          onEndReachedThreshold={0.5}
          style={{ marginBottom: 130 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  title: {
    fontSize: 20,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    marginTop: 20,
    fontFamily: "Poppins_700Bold",
  },

  searchboxContainer: {
    marginTop: 10,
    marginBottom: 10,
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
});

export default ExploreCatalog;
