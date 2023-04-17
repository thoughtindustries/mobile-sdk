import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";

import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType, filtersType } from "../../types";
import { Loader, Searchbar, FilterControl } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import GestureRecognizer from "react-native-swipe-gestures";

type ExploreCatalogProps = StackNavigationProp<RootStackParamList, "Explore">;

const ExploreCatalog = () => {
  const navigation = useNavigation<ExploreCatalogProps>();
  const route = useRoute();

  const onSwipe = (gestureName: string) => {
    switch (gestureName) {
      case "SWIPE_RIGHT":
        navigation.navigate("Home");
        break;
      case "SWIPE_LEFT":
        navigation.navigate("My Learning");
        break;
    }
  };

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
      <Pressable
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: _.get(props, "data.displayCourse", ""),
            from: "Explore",
          })
        }
      >
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
      </Pressable>
    );
  };

  return (
    <View>
      <Text style={styles.title}>Explore The Catalog</Text>

      <View style={styles.searchboxContainer}>
        <View style={{ flexGrow: 1, marginRight: 3 }}>
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
      {!pageVars.searching && (
        <Text
          style={{
            ...styles.courseTitle,
            marginTop: 15,
            marginLeft: 30,
            paddingBottom: 10,
          }}
        >
          Results (
          {filteredCourses().length > 0
            ? _.padStart(filteredCourses().length.toString(), 2, "0")
            : 0}
          )
        </Text>
      )}
      {!pageVars.searching && courses.length > 0 && (
        <FlatList
          style={{ height: Dimensions.get("window").height - 350 }}
          data={filteredCourses()}
          renderItem={({ item }) => <CourseItem data={item} />}
          onEndReached={fetchCourses}
          onEndReachedThreshold={0.5}
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
  title: {
    marginTop: 60,
    marginBottom: 30,
    marginLeft: 30,
    fontSize: 20,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },

  searchboxContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 30,
  },

  courseRow: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 15,
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
    marginTop: 20,
    marginHorizontal: 20,
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
