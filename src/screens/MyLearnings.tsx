import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { courseListType, filtersType, RootStackParamList } from "../../types";
import { Searchbar, FilterControl, LoadingBanner } from "../components";
import Utils from "../helpers/Utils";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import {
  useUserRecentContentQuery,
  useUserContentItemsQuery,
  useCatalogContentQuery,
  GlobalTypes,
  useUserCourseProgressQuery,
} from "../graphql";
import { FilterContext } from "../context";
import { saveContent, getContent, removeContent } from "../db/db";

type MyLearningScreenProps = StackNavigationProp<
  RootStackParamList,
  "MyLearning"
>;

const MyLearnings = () => {
  const navigation = useNavigation<MyLearningScreenProps>();
  const [offlineContent, setOfflineContent] = useState<courseListType[]>();
  const [search, setSearch] = useState<string>("");
  const [tab, setTab] = useState<string>("All");
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

  const { data: catalogData } = useCatalogContentQuery({
    variables: {
      sortColumn: filters.sortBy,
      sortDirection: filters.sortDir,
      page: 1,
      labels: filters.labels,
      values: filters.values,
    },
  });

  useEffect(() => {
    (async () => {
      const downloadedContent = await getContent();
      setOfflineContent(downloadedContent as courseListType[]);
    })();
  }, []);

  const downloadContent = async (data: courseListType) => {
    try {
      await saveContent(data);
      const downloadedContent = await getContent();
      setOfflineContent(downloadedContent as courseListType[]);
    } catch (error) {
      console.log("Download Content Error: ", error);
    }
  };

  const deleteContent = async (data: courseListType) => {
    try {
      await removeContent(data);
      const downloadedContent = await getContent();
      setOfflineContent(downloadedContent as courseListType[]);
    } catch (error) {
      console.log("Remove Content Error: ", error);
    }
  };

  const filteredContent = () => {
    if (tab === "All") {
      return contentItemData?.UserContentItems?.filter((item: courseListType) =>
        item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      );
    } else {
      return contentItemData?.UserContentItems?.filter(
        (item: courseListType, idx: number) =>
          item?.title
            ?.toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) &&
          offlineContent?.some((content) => content.id === item.id)
      );
    }
  };

  const filteredCourses = () => {
    return catalogData?.CatalogContent?.contentItems?.filter(
      (item: courseListType) =>
        item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  };

  const ProgressBar = ({ percent }: { percent: Float }) => (
    <View>
      <View style={styles.progressBar}></View>
      <View style={{ ...styles.progressStrip, width: `${percent}%` }} />
    </View>
  );

  const CourseItem = ({ data }: { data: courseListType }) => {
    const contentLabelStyle =
      data.contentTypeLabel === "Article"
        ? styles.Article
        : data.contentTypeLabel === "Course"
        ? styles.Course
        : data.contentTypeLabel === "Blog"
        ? styles.Blog
        : styles.Video;

    return (
      <TouchableOpacity
        style={styles.contentRow}
        onPress={() => {
          navigation.navigate("CourseDetails", {
            cid: data.id,
            title: data.title || "",
            asset: data.asset || "",
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
                ...contentLabelStyle,
              }}
            >
              {data.contentTypeLabel}
            </Text>
          </View>
          <Text style={styles.courseTitle}>{data.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ContentItem = ({ data }: { data: courseListType }) => {
    const index: number =
      offlineContent?.findIndex((item) => item.id === data.id) || 0;
    const contentLabel: string | undefined = data?.contentTypeLabel;
    const { data: percentCompleteData } = useUserCourseProgressQuery({
      variables: {
        id: data.id,
      },
    });
    const percentCompleted =
      Number(percentCompleteData?.UserCourseProgress?.percentComplete) || 0;
    const contentLabelStyle =
      contentLabel === "Article"
        ? styles.Article
        : contentLabel === "Course"
        ? styles.Course
        : contentLabel === "Blog"
        ? styles.Blog
        : styles.Video;

    return (
      <TouchableOpacity
        style={styles.contentRow}
        onPress={() => {
          navigation.navigate("CourseDetails", {
            cid: data.id,
            title: data.title || "",
            asset: data.asset || "",
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
                ...contentLabelStyle,
              }}
            >
              {data.contentTypeLabel}
            </Text>
            {(contentLabel === "Article" || contentLabel === "Blog") && (
              <TouchableOpacity
                onPress={() =>
                  data.id !== offlineContent?.[index]?.id
                    ? downloadContent(data)
                    : deleteContent(data)
                }
              >
                <MaterialCommunityIcons
                  name={
                    data.id !== offlineContent?.[index]?.id
                      ? "download"
                      : "close-circle-outline"
                  }
                  size={22}
                  color="#232323"
                />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.courseTitle}>{data.title}</Text>
          {data.contentTypeLabel === "Course" && (
            <View>
              <View style={styles.cTypeRow}>
                <Text style={styles.note}>Progress</Text>
                <Text style={styles.note}>{percentCompleted}%</Text>
              </View>
              <ProgressBar percent={percentCompleted} />
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
          <TouchableOpacity key={idx} onPress={() => setTab(item)}>
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const RecommendedList = () => {
    return (
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
  };

  const ContentList = () => (
    <FlatList
      data={filteredContent()}
      renderItem={({ item }) => <ContentItem data={item} />}
      style={{
        height:
          Dimensions.get("window").height > 667
            ? (Dimensions.get("window").height / 440) * 150
            : (Dimensions.get("window").height / 440) * 215,
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
              {contentItemData?.UserContentItems &&
              contentItemData?.UserContentItems.length !== 0 ? (
                <View>
                  {Dimensions.get("window").height > 667 && (
                    <View>
                      <Text style={styles.latestTitle}>Latest Active</Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ContentDetails", {
                            cid:
                              contentItemData?.UserContentItems?.[0]?.id || "",
                            from: "My Learnings",
                          })
                        }
                      >
                        <View
                          style={{
                            ...styles.recentContent,
                            backgroundColor: "#fff",
                          }}
                        >
                          <View style={styles.contentRightBox}>
                            <Text style={styles.courseTitle}>
                              {contentItemData?.UserContentItems?.[0].title}
                            </Text>
                          </View>
                          <Image
                            source={{
                              uri: contentItemData?.UserContentItems?.[0].asset,
                            }}
                            style={styles.recentImage}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

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
    marginTop: 20,
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
  recentContent: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E5E7EB",
    backgroundColor: "#F5F5F7",
    justifyContent: "space-between",
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
    backgroundColor: "#DDD6FE",
    marginBottom: 10,
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
