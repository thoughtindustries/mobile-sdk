import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { filtersType } from "../../types";
import { Searchbar, FilterControl, LoadingBanner } from "../components";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { GlobalTypes } from "../graphql";
import { FilterContext } from "../context";
import { useCatalogContentQuery } from "../graphql";
import { fonts, scaleDimension, theme, placeHolderImage } from "../utils";

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

  const CourseItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: item.displayCourse,
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
          <Image
            source={item.asset ? { uri: item.asset } : placeHolderImage}
            style={styles.courseImage}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={styles.title}>Explore The Catalog</Text>
      <View style={styles.searchboxContainer}>
        <View style={styles.searchBar}>
          <Searchbar searchText={search} setSearch={setSearch} />
        </View>
        <FilterContext.Provider value={{ filters, setFilters }}>
          <FilterControl />
        </FilterContext.Provider>
      </View>
      {loading && (
        <View style={styles.loader}>
          <LoadingBanner />
        </View>
      )}
      {!loading && (
        <Text style={styles.results}>
          {`Results (${filteredCourses().length})`}
        </Text>
      )}
      {!loading &&
        data?.CatalogContent?.contentItems &&
        data?.CatalogContent?.contentItems?.length > 0 && (
          <FlatList
            style={styles.contentList}
            data={filteredCourses()}
            showsVerticalScrollIndicator={false}
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
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: scaleDimension(30, false),
    marginBottom: scaleDimension(30, true),
    marginLeft: scaleDimension(30, true),
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  loader: {
    marginHorizontal: scaleDimension(30, true),
  },
  searchboxContainer: {
    height: scaleDimension(25, false),
    display: "flex",
    flexDirection: "row",
    marginHorizontal: scaleDimension(30, true),
  },
  courseRow: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: scaleDimension(30, true),
    paddingVertical: scaleDimension(8, false),
    borderBottomWidth: 1,
    paddingBottom: scaleDimension(5, false),
    borderBottomColor: theme.border["border-200"],
  },
  courseLeftBox: {
    flexGrow: 1,
  },
  courseTitle: {
    fontSize: scaleDimension(18, true),
    maxWidth: "80%",
    lineHeight: scaleDimension(12, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  courseAuthor: {
    fontSize: scaleDimension(14, true),
    fontFamily: fonts.inter.regular,
    color: theme.text["text-secondary"],
  },
  courseImage: {
    width: scaleDimension(75, true),
    height: scaleDimension(75, true),
    borderRadius: scaleDimension(16, true),
  },
  searching: {
    marginTop: scaleDimension(10, false),
    marginHorizontal: scaleDimension(20, true),
    backgroundColor: theme.brand["brand-primary"],
    borderRadius: scaleDimension(10, true),
    paddingBottom: scaleDimension(10, false),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  searchingText: {
    fontSize: scaleDimension(18, true),
    lineHeight: scaleDimension(12, false),
    textAlign: "center",
    color: theme.text["text-inverse"],
    fontFamily: fonts.poppins.bold,
    padding: scaleDimension(20, true),
  },
  noRecords: {
    paddingTop: scaleDimension(20, false),
    textAlign: "center",
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
    fontFamily: fonts.poppins.bold,
  },
  searchBar: {
    flexGrow: 1,
    marginRight: scaleDimension(3, true),
  },
  results: {
    fontSize: scaleDimension(20, true),
    maxWidth: "80%",
    lineHeight: scaleDimension(12, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
    marginTop: scaleDimension(10, false),
    marginLeft: scaleDimension(30, true),
    paddingBottom: scaleDimension(6, false),
  },
  contentList: {
    height:
      Dimensions.get("window").height > 667
        ? (Dimensions.get("window").height / 440) * 280
        : (Dimensions.get("window").height / 440) * 238,
  },
});

export default ExploreCatalog;
