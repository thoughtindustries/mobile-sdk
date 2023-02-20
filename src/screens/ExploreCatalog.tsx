import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";

import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType, filtersType } from "../../types";
import { Loader, Searchbar, FilterControl } from "../components";

const ExploreCatalog = () => {
  const [filters, setFilters] = useState<filtersType>({
    sortBy: "title",
    sortDir: "asc",
    duration: "",
    difficulty: "",
    tag: "",
  });

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
        sortDir: filters.sortDir,
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

  const onFilter = (flts: filtersType) => {
    setFilters({ ...filters, ...flts });
    setCourses([]);
    setFetchAgain(fetchAgain + 1);
  };

  const filteredCourses = () => {
    let data = courses.filter(
      (c) =>
        c.title.includes(pageVars.search) ||
        _.get(c, "authors", []).join(",").includes(pageVars.search)
    );
    return data;
  };

  const CourseItem = (props: { data: courseListType }) => {
    return (
      <View style={styles.courseRow}>
        <View style={styles.courseLeftBox}>
          <Text style={styles.courseTitle}>{props.data.title}</Text>
          {_.get(props, "data.authors.length", 0) > 0 && (
            <Text style={styles.courseAuthor}>
              By {_.get(props, "data.authors", []).join(",")}
            </Text>
          )}
        </View>
        {_.get(props, "data.asset", "na") !== "na" && (
          <Image
            source={{ uri: props.data.asset }}
            style={styles.courseImage}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Explore The Catalog</Text>

      <View style={styles.searchboxContainer}>
        <View style={{ flexGrow: 1 }}>
          <Searchbar
            searchText={pageVars.search}
            onSearch={(str: string) =>
              setPageVars({ ...pageVars, search: str })
            }
          />
        </View>
        <FilterControl onFilter={onFilter} />
      </View>

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
