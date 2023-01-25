import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";

import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType, filtersType } from "../../types";
import { Loader, Searchbar, FilterControl } from "../components";
import Utils from "../helpers/Utils";

import dbObj from "../helpers/Db";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

const MyLearnings = () => {
  const [filters, setFilters] = useState<{
    sortBy: string;
    sortDir: string;
    tag: string;
  }>({
    sortBy: "title",
    sortDir: "asc",
    tag: "",
  });

  const [courses, setCourses] = useState<courseListType[]>([]);
  const [content, setContent] = useState<{
    items: courseListType[];
    recent: courseListType[];
  }>({ items: [], recent: [] });
  const [pageVars, setPageVars] = useState({
    search: "",
    page: 0,
    searching: false,
    showFilter: false,
  });
  const [fetchAgain, setFetchAgain] = useState(1);

  const offlineData = (course: courseListType, mode: boolean) => {
    let user_id: number;
    Utils.fetch("user_dbid")
      .then(({ id }) => (user_id = id))
      .then(() => saveAsset(course.asset))
      .then((asset) => (course.asset = asset))
      .then(() => dbObj.saveCourse(user_id, course, mode))
      .then(() =>
        setContent({
          ...content,
          items: content.items.map((c) => {
            if (c.id === course.id) {
              c.isOffline = mode;
            }
            return c;
          }),
        })
      );
  };

  const markOfflineStatus = () => {
    Utils.fetch("user_dbid")
      .then(({ id }) => dbObj.fetchOfflineCourses(id, false))
      .then((courses: { cid: string }[]) => {
        const cids = courses.map((c) => c.cid);
        setContent({
          ...content,
          items: content.items.map((c) => {
            c.isOffline = cids.includes(c.id);
            return c;
          }),
        });
      });
  };

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
        duration: "",
        difficulty: "",
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

  const fetchCourseProgresses = () => {
    return new Promise<void>((resolve, reject) => {
      const cids = content.items
        .filter((c) => c.contentTypeLabel === "Course")
        .map((c) => c.id);
      let idx: number = -1;
      const fetchCourseProgress = () => {
        if (cids.length <= ++idx) {
          resolve();
        } else {
          tiGql
            .courseProgress(cids[idx])
            .then((cp) => {
              setContent({
                ...content,
                items: content.items.map((c) => {
                  if (c.id === cids[idx]) {
                    _.set(c, "progress", cp);
                  }
                  return c;
                }),
              });
            })
            .then(fetchCourseProgress)
            .catch(fetchCourseProgress);
        }
      };

      fetchCourseProgress();
    });
  };

  const fetchMyLearnings = () => {
    setPageVars({
      ...pageVars,
      searching: true,
      showFilter: false,
    });

    tiGql
      .myLearnings({
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        tag: filters.tag,
      })
      .then((data) => {
        setContent(data);
        //console.log(data.recent.length);
        if (data.recent.length === 0) {
          fetchCourses(false, 1);
        }
      })
      .then(fetchCourseProgresses)
      .then(markOfflineStatus)
      .catch(console.log)
      .finally(() =>
        setPageVars({ ...pageVars, showFilter: false, searching: false })
      );
  };
  useEffect(() => fetchMyLearnings(), [fetchAgain]);

  const onFilter = (flts: filtersType) => {
    setFilters({ ...filters, ...flts });
    setCourses([]);
    setFetchAgain(fetchAgain + 1);
  };

  const filteredContents = () =>
    content.items.filter((c) => c.title.includes(pageVars.search));

  const filteredCourses = () => {
    let data = courses.filter(
      (c) =>
        c.title.includes(pageVars.search) ||
        c.authors.join(",").includes(pageVars.search)
    );
    return data;
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

  const ProgressBar = (props: { percent: Float }) => (
    <View style={styles.progressBar}>
      <Animated.View
        style={
          ([StyleSheet.absoluteFill],
          {
            backgroundColor: "#3B1FA3",
            width: `${props.percent}%`,
            borderRadius: 16,
          })
        }
      />
    </View>
  );

  const ContentItem = (props: { data: courseListType }) => {
    return (
      <View style={styles.contentRow}>
        <Image source={{ uri: props.data.asset }} style={styles.contentImage} />
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text
              style={{
                ...styles.contentTag,
                ..._.get(styles, props.data.contentTypeLabel, {}),
              }}
            >
              {props.data.contentTypeLabel}
            </Text>
            {props.data.isOffline !== true && (
              <MaterialCommunityIcons
                name="download"
                size={22}
                color="#232323"
                onPress={() => offlineData(props.data, true)}
              />
            )}
            {props.data.isOffline == true && (
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={22}
                color="#232323"
                onPress={() => offlineData(props.data, false)}
              />
            )}
          </View>
          <Text style={styles.courseTitle}>{props.data.title}</Text>
          {props.data.contentTypeLabel === "Course" && (
            <View style={{ flex: 0 }}>
              <View style={styles.cTypeRow}>
                <Text style={styles.note}>Progress</Text>
                <Text style={styles.note}>
                  {_.get(props, "data.progress", 0)}%
                </Text>
              </View>
              <ProgressBar percent={_.get(props, "data.progress", 0)} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const CategoryFilter = () => (
    <ScrollView horizontal={true} style={styles.catContainer}>
      {Utils.filterValues.myLearningsEvent.map((cat, idx) => (
        <View key={idx} style={styles.catBox}>
          <Text style={styles.catTitle}>{cat}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const LatestActive = () => (
    <>
      <Text style={styles.title}>Latest Active</Text>
      <View style={{ ...styles.contentRow, backgroundColor: "#fff" }}>
        <View style={styles.contentRightBox}>
          <Text style={styles.courseTitle}>{content.recent[0].title}</Text>
        </View>
        <Image
          source={{ uri: content.recent[0].asset }}
          style={styles.recentImage}
        />
      </View>
    </>
  );

  const RecommendedList = () => (
    <>
      <Text style={{ ...styles.note, paddingTop: 30 }}>
        It's looking a bit empty right now, we know. But this is where you'll
        find your most recent activity, Events, Completed Courses,
        Certifications and Offline Downloaded Courses.{" "}
      </Text>
      <Text style={styles.title}>Recommended Learning</Text>
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
    </>
  );

  const ContentList = () => (
    <FlatList
      data={filteredContents()}
      renderItem={({ item }) => <ContentItem data={item} />}
      style={styles.contentListStyle}
      ListEmptyComponent={
        <Text style={styles.noRecords}>
          No records found, try using other filters.
        </Text>
      }
    />
  );

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Learning</Text>

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
      {!pageVars.searching && (
        <>
          {content.recent.length > 0 && (
            <>
              <LatestActive />
              <CategoryFilter />
              <ContentList />
            </>
          )}

          {content.recent.length === 0 && <RecommendedList />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: "#fff",
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

  catContainer: {
    display: "flex",
    flexDirection: "row",
    height: 60,
    marginTop: 10,
    marginBottom: 10,
  },

  catBox: {
    backgroundColor: "#f9fafv",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    minWidth: 104,
    margin: 4,
  },

  catTitle: {
    color: "#1f2937",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 24,
    padding: 10,
  },

  listStyle: {
    marginBottom: 170,
    marginLeft: -10,
    marginRight: -10,
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

  contentListStyle: {
    height: "45%",
    marginBottom: 170,
  },

  contentRow: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E7EB",
    backgroundColor: "#F5F5F7",
    marginBottom: 10,
  },

  contentRightBox: {
    flexGrow: 1,
    padding: 20,
    paddingRight: 10,
  },

  cTypeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  contentTag: {
    borderRadius: 15,
    fontSize: 12,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,
    flexGrow: 0,
    fontFamily: "Inter_400Regular",
  },

  Course: {
    backgroundColor: "#FDE68A",
  },

  Blog: {
    backgroundColor: "#A7F3D0",
  },

  Article: {
    backgroundColor: "#A7F3D0",
  },

  "Learning Path": {
    backgroundColor: "#DDD6FE",
  },

  contentImage: {
    width: 100,
    height: "100%",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  recentImage: {
    width: 70,
    borderRadius: 8,
    margin: 20,
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

  note: {
    padding: 15,
    paddingBottom: 0,
    lineHeight: 24,
    color: "#6B7280",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  progressBar: {
    height: 20,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#D1D5DB",
    borderRadius: 16,
  },
});

export default MyLearnings;
