import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import { courseListType, filtersType, RootStackParamList } from "../../types";
import { Searchbar, FilterControl, LoadingBanner } from "../components";
import Utils from "../helpers/Utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import dbObj from "../helpers/Db";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";
import {
  useUserRecentContentQuery,
  useUserContentItemsQuery,
  useCatalogContentQuery,
  GlobalTypes,
} from "../graphql";
import { FilterContext } from "../context";

type MyLearningScreenProps = StackNavigationProp<
  RootStackParamList,
  "MyLearning"
>;

const MyLearnings = () => {
  const navigation = useNavigation<MyLearningScreenProps>();

  const [filters, setFilters] = useState<filtersType>({
    sortBy: GlobalTypes.SortColumn.Title,
    sortDir: GlobalTypes.SortDirection.Asc,
    labels: [],
    values: [],
  });

  const { data: recentContentData, loading: recentContentDataLoading } =
    useUserRecentContentQuery({
      variables: { limit: 5 },
    });

  const { data: contentItemData, loading: contentItemDataLoading } =
    useUserContentItemsQuery({
      variables: {
        sortColumn: filters.sortBy,
        sortDirection: filters.sortDir,
      },
    });

  const { data: catalogData, loading: catalogDataLoading } =
    useCatalogContentQuery({
      variables: {
        sortColumn: filters.sortBy,
        sortDirection: filters.sortDir,
        page: 1,
        labels: filters.labels,
        values: filters.values,
        contentTypes: "Course",
      },
    });

  const [search, setSearch] = useState<string>("");

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
    console.log(fileUri);
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
      )
      .catch((error) => console.log(error));
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

  const filteredContent = () => {
    if (tab === "Offline" || Utils.isOffline()) {
      return contentItemData?.UserContentItems?.filter((item) =>
        item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    } else {
      return contentItemData?.UserContentItems?.filter((item) =>
        item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    }
  };

  const filteredCourses = () => {
    return catalogData?.CatalogContent?.contentItems?.filter((item) =>
      item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  };

  const CourseItem = ({ data }: { data: courseListType }) => {
    return (
      <TouchableOpacity
        style={styles.contentRow}
        onPress={() => {
          navigation.navigate("CourseDetails", {
            cid: data.id,
            title: data.title,
            asset: data.asset,
            contentTypeLabel: data.contentTypeLabel,
          });
        }}
      >
        <Image source={{ uri: data.asset }} style={styles.contentImage} />
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text style={styles.contentTag}>{data.contentTypeLabel}</Text>
          </View>
          <Text style={styles.courseTitle}>{data.title}</Text>
          {data.contentTypeLabel === "Course" && (
            <View style={{ flex: 0 }}>
              <View style={styles.cTypeRow}>
                <Text style={styles.note}>Progress</Text>
                <Text style={styles.note}>{_.get(data, "progress", 0)}%</Text>
              </View>
              <ProgressBar percent={_.get(data, "progress", 0)} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const ProgressBar = (props: { percent: Float }) => (
    <View>
      <View style={styles.progressBar}></View>
      <View style={{ ...styles.progressStrip, width: `${props.percent}%` }} />
    </View>
  );

  const ContentItem = ({ data }: { data: courseListType }) => {
    getOfflineMedia(data.asset);
    return (
      <TouchableOpacity
        style={styles.contentRow}
        onPress={() => {
          navigation.navigate("CourseDetails", {
            cid: data.id,
            title: data.title,
            asset: data.asset,
            contentTypeLabel: data.contentTypeLabel,
          });
        }}
      >
        <Image source={{ uri: data.asset }} style={styles.contentImage} />
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text
              style={{
                ...styles.contentTag,
                ..._.get(styles, _.get(data, "contentTypeLabel", "Course"), {}),
              }}
            >
              {data.contentTypeLabel}
            </Text>
            <MaterialCommunityIcons
              name={`${data.isOffline ? "download" : "close-circle-outline"}`}
              size={22}
              color="#232323"
              onPress={() => offlineData(data, data.isOffline ? false : true)}
            />
          </View>
          <Text style={styles.courseTitle}>{data.title}</Text>
          {data.contentTypeLabel === "Course" && (
            <View style={{ flex: 0 }}>
              <View style={styles.cTypeRow}>
                <Text style={styles.note}>Progress</Text>
                <Text style={styles.note}>{_.get(data, "progress", 0)}%</Text>
              </View>
              <ProgressBar percent={_.get(data, "progress", 0)} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const CategoryFilter = () => {
    const events: string[] = ["All", "Offline"];
    return (
      <ScrollView horizontal={true} style={styles.catContainer}>
        {events.map((item, idx) => (
          <Pressable key={idx} onPress={() => setTab(item)}>
            <View
              style={{
                ...styles.catBox,
                ...(tab === item ? styles.catBoxSelected : styles.catBoxNormal),
              }}
            >
              <Text
                style={{
                  ...styles.catTitle,
                  ...(tab === item
                    ? styles.catTitleSelected
                    : styles.catTitleNormal),
                }}
              >
                {item}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  const RecommendedList = () => (
    <View>
      <Text style={{ ...styles.note, paddingTop: 30 }}>
        It's looking a bit empty right now, we know. But this is where you'll
        find your most recent activity, Events, Completed Courses,
        Certifications and Offline Downloaded Courses.{" "}
      </Text>
      <Text style={styles.title}>Recommended Learning</Text>
      <FlatList
        data={filteredCourses()}
        renderItem={({ item }) => <CourseItem data={item} />}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        style={{
          height: (Dimensions.get("window").height / 440) * 200,
        }}
        ListEmptyComponent={
          <Text style={styles.noRecords}>
            No records found, try using other filters.
          </Text>
        }
      />
    </View>
  );

  const ContentList = () => (
    <FlatList
      data={filteredContent()}
      renderItem={({ item }) => <ContentItem data={item} />}
      style={{
        height: (Dimensions.get("window").height / 440) * 175,
      }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
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
        <View>
          <View style={styles.searchboxContainer}>
            <View style={{ flexGrow: 1, marginRight: 3 }}>
              <Searchbar searchText={search} setSearch={setSearch} />
            </View>
            <FilterContext.Provider value={{ filters, setFilters }}>
              <FilterControl />
            </FilterContext.Provider>
          </View>
          {recentContentDataLoading || contentItemDataLoading ? (
            <LoadingBanner />
          ) : (
            <View>
              {recentContentData?.UserRecentContent &&
              recentContentData.UserRecentContent.length > 0 ? (
                <View>
                  <View>
                    <Text style={styles.latestTitle}>Latest Active</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ContentDetails", {
                          cid:
                            recentContentData?.UserRecentContent[0]?.id || "",
                          from: "My Learnings",
                        })
                      }
                    >
                      <View
                        style={{
                          ...styles.contentRow,
                          backgroundColor: "#fff",
                        }}
                      >
                        <View style={styles.contentRightBox}>
                          <Text style={styles.courseTitle}>
                            {recentContentData?.UserRecentContent[0].title}
                          </Text>
                        </View>
                        <Image
                          source={{
                            uri: recentContentData?.UserRecentContent[0].asset,
                          }}
                          style={styles.recentImage}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <CategoryFilter />
                  <ContentList />
                </View>
              ) : (
                <RecommendedList />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    marginVertical: 30,
    fontSize: 20,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  latestTitle: {
    marginVertical: 10,
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
    padding: 4,
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
    height: 200,
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
