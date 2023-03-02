import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Animated,
  Permission,
  Pressable,
} from "react-native";

import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType, filtersType } from "../../types";
import { Loader, Searchbar, FilterControl } from "../components";
import Utils from "../helpers/Utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import dbObj from "../helpers/Db";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

type MyLearningScreenProps = StackNavigationProp<
  RootStackParamList,
  "MyLearning"
>;

const MyLearnings = () => {
  const navigation = useNavigation<MyLearningScreenProps>();
  const [filters, setFilters] = useState<{
    sortBy: string;
    sortDir: string;
    tag: string;
  }>({
    sortBy: "title",
    sortDir: "asc",
    tag: "",
  });

  const [tab, setTab] = useState<string>("All");
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

  const saveAsset = (asset: string) => {
    // download code for asset
    let path: string[] = asset.split("/");
    const file_name: string = path[path.length - 1];
    let fileUri: string = FileSystem.documentDirectory + file_name;
    return FileSystem.downloadAsync(asset, fileUri)
      .then(() => seekPermission(fileUri))
      .then(() => {
        console.log("Downloaded file is ", file_name);
        return file_name;
      })
      .catch((error) => {
        console.error(error);
        return "";
      });
  };

  const deleteAsset = (file_name: string) => {
    return new Promise((resolve, reject) => {
      let fileUri: string = FileSystem.documentDirectory + file_name;
      Permissions.askAsync(Permissions.MEDIA_LIBRARY).then((permissions) => {
        if (!permissions.granted) {
          throw "Permission denied";
        } else {
          MediaLibrary.createAssetAsync(fileUri).then((asset) => {
            MediaLibrary.deleteAssetsAsync(asset).then(() => {
              console.log("deleted........", asset);
            });
          });
        }
      });
      resolve(true);
    });
  };
  const getOfflineMedia = (file_name: string) => {
    let fileUri: string = FileSystem.documentDirectory + file_name;
    return MediaLibrary.createAssetAsync(fileUri).then((asset) => asset.uri);
  };
  const seekPermission = (fileUri: string) => {
    let fname = "";
    return Permissions.askAsync(Permissions.MEDIA_LIBRARY).then(
      (permissions) => {
        if (!permissions.granted) {
          throw "Permission denied";
        } else {
          MediaLibrary.createAssetAsync(fileUri).then((asset) => {
            MediaLibrary.createAlbumAsync("Helium", asset, false).then(() => {
              console.log("downloaded........", asset);
            });
          });
        }
      }
    );
  };

  const offlineData = (course: courseListType, mode: boolean) => {
    let user_id: number;
    Utils.fetch("user_dbid")
      .then(({ id }) => (user_id = id))
      .then(() => {
        if (mode) {
          return saveAsset(course.asset).then(
            (asset) => (course.asset = asset)
          );
        } else {
          return dbObj.fetchAsset(user_id, course.id).then(deleteAsset);
        }
      })
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

  const markOfflineStatus = (items: courseListType[]) => {
    return new Promise<courseListType[]>((resolve, reject) => {
      Utils.fetch("user_dbid")
        .then(({ id }) => dbObj.fetchOfflineCourses(id, false))
        .then((courses: { cid: string }[]) => {
          const cids = courses.map((c) => c.cid);
          if (cids.length > 0) {
            items = items.map((c) => {
              c.isOffline = cids.includes(c.id);
              return c;
            });
          }
          resolve(items);
        })
        .catch(() => resolve(items));
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

  const fetchCourseProgresses = (items: courseListType[]) => {
    return new Promise<courseListType[]>((resolve, reject) => {
      const cids = items
        .filter((c) => c.contentTypeLabel === "Course")
        .map((c) => c.id);
      let idx: number = -1;
      const fetchCourseProgress = () => {
        if (cids.length <= ++idx) {
          resolve(items);
        } else {
          tiGql
            .courseProgress(cids[idx])
            .then((cp) => {
              items = items.map((c) => {
                if (c.id === cids[idx]) {
                  _.set(c, "progress", cp);
                }
                return c;
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
    if (Utils.isOffline()) {
      Utils.fetch("user_dbid")
        .then(({ id }) => dbObj.fetchOfflineCourses(id, true))
        .then((items) => {
          console.log(items);
          setContent({
            ...content,
            items: items.map((i) => ({
              id: i.cid,
              title: i.title,
              contentTypeLabel: i.contentTypeLabel,
              progress: parseFloat(i.percentComplete + ""),
              asset: i.courseThumbnail,
              isOffline: true,
            })),
          });
        });
    } else {
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
          if (data.recent.length === 0) {
            return fetchCourses(false, 1);
          } else {
            return fetchCourseProgresses(data.items)
              .then((items) => (data.items = items))
              .then(() => markOfflineStatus(data.items))
              .then((items) => (data.items = items))
              .then(() => setContent(data));
          }
        })
        .catch(console.log)
        .finally(() =>
          setPageVars({ ...pageVars, showFilter: false, searching: false })
        );
    }
  };
  useEffect(() => fetchMyLearnings(), [fetchAgain]);

  const onFilter = (flts: filtersType) => {
    setFilters({ ...filters, ...flts });
    setCourses([]);
    setFetchAgain(fetchAgain + 1);
  };

  const filteredContents = () => {
    if (tab === "Offline" || Utils.isOffline()) {
      return content.items.filter(
        (c) => c.title.includes(pageVars.search) && c.isOffline
      );
    } else {
      return content.items.filter((c) => c.title.includes(pageVars.search));
    }
  };

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
    <View>
      <View style={styles.progressBar}></View>
      <View style={{ ...styles.progressStrip, width: `${props.percent}%` }} />
    </View>
  );

  const ContentItem = (props: { data: courseListType }) => {
    let imgurl = props.data.isOffline
      ? getOfflineMedia(props.data.asset)
      : props.data.asset;

    return (
      <View style={styles.contentRow}>
        {imgurl && (
          <Image source={{ uri: imgurl }} style={styles.contentImage} />
        )}
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text
              style={{
                ...styles.contentTag,
                ..._.get(
                  styles,
                  _.get(props, "data.contentTypeLabel", "Course"),
                  {}
                ),
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
          <Text
            style={styles.courseTitle}
            onPress={() => {
              console.log(props.data.id);
              navigation.navigate("CourseDetails", {
                cid: props.data.id,
                title: props.data.title,
                asset: props.data.asset,
                contentTypeLabel: props.data.contentTypeLabel,
              });
            }}
          >
            {props.data.title}
          </Text>
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
        <Pressable key={idx} onPress={() => setTab(cat)}>
          <View
            style={{
              ...styles.catBox,
              ...(tab === cat ? styles.catBoxSelected : styles.catBoxNormal),
            }}
          >
            <Text
              style={{
                ...styles.catTitle,
                ...(tab === cat
                  ? styles.catTitleSelected
                  : styles.catTitleNormal),
              }}
            >
              {cat}
            </Text>
          </View>
        </Pressable>
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
      style={
        Utils.isOffline()
          ? styles.contentListStyleOffline
          : styles.contentListStyle
      }
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

      {Utils.isOffline() === true && <ContentList />}

      {Utils.isOffline() !== true && (
        <>
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
    borderRadius: 8,
    alignItems: "center",
    minWidth: 104,
    margin: 4,
  },

  catBoxSelected: {
    backgroundColor: "#3B1FA3",
  },

  catBoxNormal: {
    backgroundColor: "#f9fafv",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d1d5db",
  },

  catTitle: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 24,
    padding: 8,
  },

  catTitleSelected: {
    color: "#ffffff",
  },

  catTitleNormal: {
    color: "#1f2937",
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

  contentListStyleOffline: {
    height: "90%",
    marginBottom: 170,
  },

  contentRow: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E7EB",
    backgroundColor: "#F5F5F7",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  contentRightBox: {
    flexGrow: 1,
    minHeight: 100,
    margin: 20,
    marginRight: 20,
    maxWidth: "70%",
  },

  cTypeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  contentTag: {
    marginLeft: -5,
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

  Video: {
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
    marginTop: 20,
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
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
  },

  progressStrip: {
    position: "absolute",
    height: 20,
    backgroundColor: "#3B1FA3",
    borderRadius: 10,
  },
});

export default MyLearnings;
