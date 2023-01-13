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
import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType } from "../../types";
import { Checkbox, Loader } from "../components";
import Utils from "../helpers/Utils";

const ExploreCatalog = () => {
  const [filters, setFilters] = useState({
    sortBy: "asc",
    duration: "",
    difficulty: "",
    tag: "",
  });

  const txtRef = useRef<TextInput | null>(null);

  const [courses, setCourses] = useState<courseListType[]>([]);
  const [pageVars, setPageVars] = useState({
    search: "",
    page: 0,
    searching: false,
    showFilter: false,
  });
  const [fetchAgain, setFetchAgain] = useState(1);

  const fetchCourses = (
    isPaginated: Boolean = true,
    page: number = pageVars.page + 1
  ) => {
    if (isPaginated && courses.length < 40) {
      return;
    }

    setPageVars({
      ...pageVars,
      searching: true,
      showFilter: false,
      page: page,
    });
    tiGql
      .fetchCourses({
        sortBy: filters.sortBy,
        duration: filters.duration,
        difficulty: filters.difficulty,
        tag: filters.tag,
        page: page,
      })
      .then((data) => {
        setCourses(isPaginated ? [...courses, ...data] : data);
      })
      .catch(console.log)
      .finally(() =>
        setPageVars({ ...pageVars, showFilter: false, searching: false })
      );
  };

  useEffect(() => fetchCourses(false, 1), [fetchAgain]);

  const applyFilter = () => {
    setCourses([]);
    setFetchAgain(fetchAgain + 1);
  };

  const filteredCourses = () => {
    let data = courses.filter(
      (c) =>
        c.title.includes(pageVars.search) ||
        c.authors.join(",").includes(pageVars.search)
    );
    return data;
  };

  let searchText = "";

  const saveSearchText = (txt) => {
    searchText = txt;
  };

  const clearFilter = () => {
    setFilters({
      ...filters,
      duration: "",
      difficulty: "",
      tag: "",
      sortBy: "asc",
    });
    setFetchAgain(fetchAgain + 1);
  };

  const SearchBar = () => {
    return (
      <View style={styles.searchboxContainer}>
        <TextInput
          onChangeText={saveSearchText}
          defaultValue={pageVars.search}
          style={styles.searchbox}
          placeholder="Search by Title, Instructor or Tag"
        />
        <Pressable
          onPress={() => setPageVars({ ...pageVars, search: searchText })}
          style={styles.magnify}
        >
          <MaterialCommunityIcons name="magnify" size={22} color="#232323" />
        </Pressable>
        <Pressable
          style={styles.filterbtn}
          onPress={() => setPageVars({ ...pageVars, showFilter: true })}
        >
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
      <Modal transparent={false} visible={true}>
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeading}>Filters</Text>

          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Sort By</Text>
            <View style={styles.row}>
              <Text
                style={
                  filters.sortBy === "asc"
                    ? styles.sortBySelected
                    : styles.sortBy
                }
                onPress={() => setFilters({ ...filters, sortBy: "asc" })}
              >
                A-Z
              </Text>
              <Text
                style={
                  filters.sortBy === "desc"
                    ? styles.sortBySelected
                    : styles.sortBy
                }
                onPress={() => setFilters({ ...filters, sortBy: "desc" })}
              >
                Z-A
              </Text>
            </View>
          </View>

          <ScrollView>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Duration</Text>
              {Utils.filterValues.duration.map((dur, idx) => (
                <Checkbox
                  key={idx}
                  title={dur}
                  selected={filters.duration === dur}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      duration: filters.duration === dur ? "" : dur,
                    })
                  }
                />
              ))}
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Difficulty Level</Text>
              {Utils.filterValues.difficulty.map((dif, idx) => (
                <Checkbox
                  key={idx}
                  title={dif}
                  selected={filters.difficulty === dif}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      difficulty: filters.difficulty === dif ? "" : dif,
                    })
                  }
                />
              ))}
            </View>
            <View style={styles.filterBox}>
              <Text style={styles.filterTitle}>Tags</Text>
              {Utils.filterValues.tags.map((tag, idx) => (
                <Checkbox
                  key={idx}
                  title={tag}
                  selected={filters.tag === tag}
                  onPress={() =>
                    setFilters({
                      ...filters,
                      tag: filters.tag === tag ? "" : tag,
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.row}>
            <Pressable style={styles.clearbtn} onPress={clearFilter}>
              <Text style={styles.clearbtntxt}>Clear All</Text>
            </Pressable>

            <Pressable style={styles.applybtn} onPress={applyFilter}>
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
      {pageVars.searching && (
        <View style={styles.searching}>
          <Text style={styles.searchingText}>Loading data </Text>
          <Loader size={50} />
        </View>
      )}
      {!pageVars.searching && courses.length > 0 && (
        <FlatList
          data={filteredCourses()}
          renderItem={({ item }) => <CourseItem data={item} />}
          onEndReached={fetchCourses}
          onEndReachedThreshold={0.5}
          style={styles.listStyle}
          ListEmptyComponent={
            <Text style={styles.noRecords}>
              No records found, try using other filters.
            </Text>
          }
        />
      )}
      {pageVars.showFilter && <CourseFilter />}
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
    height: "99%",
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
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 0,
    borderBottomColor: "#D1D5DB",
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
    marginRight: 15,
  },

  applybtntxt: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  sortBy: {
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
  },
  sortBySelected: {
    fontSize: 14,
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
    backgroundColor: "#3B1FA3",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    borderRadius: 5,
  },

  searching: {
    backgroundColor: "#3B1FA3",
    borderRadius: 10,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  searchingText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Poppins_700Bold",
    padding: 20,
  },

  noRecords: {
    paddingTop: 40,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    fontFamily: "Poppins_700Bold",
  },
});

export default ExploreCatalog;
