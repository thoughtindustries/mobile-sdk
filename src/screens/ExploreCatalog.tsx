import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { filtersType } from "../../types";
import { Loader, Searchbar, FilterControl } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { GlobalTypes } from "../graphql";
import { ExploreCatalogContext } from "../context";
import { useCatalogContentQuery } from "../graphql";

type ExploreCatalogProps = StackNavigationProp<RootStackParamList, "Explore">;

const ExploreCatalog = () => {
  const navigation = useNavigation<ExploreCatalogProps>();
  const [filters, setFilters] = useState<filtersType>({
    sortBy: GlobalTypes.SortColumn.Title,
    sortDir: GlobalTypes.SortDirection.Asc,
    labels: [],
    values: [],
  });
  const [search, setSearch] = useState<string>("");

  const { data, loading } = useCatalogContentQuery({
    variables: {
      sortColumn: filters.sortBy,
      sortDirection: filters.sortDir,
      page: 1,
      labels: filters.labels,
      values: filters.values,
      contentTypes: "Course",
    },
  });

  const filteredCourses = () => {
    const filteredCourses = data?.CatalogContent?.contentItems?.filter(
      (course) =>
        course?.title?.includes(search) ||
        course?.authors?.join(", ").includes(search)
    );

    return filteredCourses || [];
  };

  const CourseItem = ({ item }: { item: GlobalTypes.Content }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: item?.displayCourse || "",
            from: "Explore",
          })
        }
      >
        <View style={styles.courseRow}>
          <View style={styles.courseLeftBox}>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseAuthor}>
              By {item.authors?.join(", ") || "Anonymous"}
            </Text>
          </View>
          {item.asset !== "na" && (
            <Image source={{ uri: item.asset }} style={styles.courseImage} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View>
      <ExploreCatalogContext.Provider value={{ setFilters, filters }}>
        <Text style={styles.title}>Explore The Catalog</Text>
        <View style={styles.searchboxContainer}>
          <View style={{ flexGrow: 1, marginRight: 3 }}>
            <Searchbar searchText={search} setSearch={setSearch} />
          </View>
          <FilterControl />
        </View>
        {loading && (
          <View style={styles.searching}>
            <Text style={styles.searchingText}>Loading data </Text>
            <Loader size={50} />
          </View>
        )}
        {!loading && (
          <Text
            style={{
              ...styles.courseTitle,
              marginTop: 15,
              marginLeft: 30,
              paddingBottom: 10,
            }}
          >
            {`Results (${filteredCourses().length})`}
          </Text>
        )}
        {!loading &&
          data?.CatalogContent?.contentItems &&
          data?.CatalogContent?.contentItems?.length > 0 && (
            <FlatList
              style={{
                marginBottom:
                  ((data?.CatalogContent?.contentItems?.length *
                    Dimensions.get("window").width) /
                    440) *
                  32,
              }}
              data={filteredCourses()}
              scrollEnabled={true}
              renderItem={({ item }) => <CourseItem item={item} />}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <Text style={styles.noRecords}>
                  No records found, try using other filters.
                </Text>
              }
            />
          )}
      </ExploreCatalogContext.Provider>
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
    width: (Dimensions.get("window").width / 400) * 75,
    height: (Dimensions.get("window").width / 400) * 75,
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
