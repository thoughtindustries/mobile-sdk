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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import {
  useUserContentItemsQuery,
  useCatalogContentQuery,
  GlobalTypes,
  useUserCourseProgressQuery,
} from "../graphql";
import { FilterContext } from "../context";
import { saveContent, getContent, removeContent } from "../db/db";
import { ContentKind } from "../graphql/global-types";
import { Download, XCircle } from "lucide-react-native";
import { fonts, scaleDimension, theme, placeHolderImage } from "../utils";

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

  const filteredItems = (items: courseListType[] | undefined) => {
    const filteredItems: courseListType[] = [];

    items?.forEach((item: courseListType) => {
      if (
        filters.labels.includes("Duration") &&
        filters.labels.includes("Level of Difficulty")
      ) {
        item.customFields?.duration?.some((value: string) =>
          filters.values.includes(value)
        ) &&
        item.customFields?.["level-of-difficulty"]?.some((value: string) =>
          filters.values.includes(value)
        )
          ? filteredItems.push(item)
          : null;
      } else if (
        filters.labels.includes("Duration") &&
        !filters.labels.includes("Level of Difficulty")
      ) {
        item.customFields?.duration?.some((value: string) =>
          filters.values.includes(value)
        )
          ? filteredItems.push(item)
          : null;
      } else if (
        !filters.labels.includes("Duration") &&
        filters.labels.includes("Level of Difficulty")
      ) {
        item.customFields?.["level-of-difficulty"]?.some((value: string) =>
          filters.values.includes(value)
        )
          ? filteredItems.push(item)
          : null;
      } else {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  };

  const filteredContent = () => {
    const filteredContent = filteredItems(contentItemData?.UserContentItems);

    return tab === "All"
      ? filteredContent.filter((item: courseListType) =>
          item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : filteredContent.filter(
          (item: courseListType) =>
            item?.title
              ?.toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) &&
            offlineContent?.some((content) => content.id === item.id)
        );
  };

  const filteredCourses = () => {
    const filteredCourses = filteredItems(
      catalogData?.CatalogContent.contentItems
    );

    return filteredCourses?.filter((item: courseListType) =>
      item?.title?.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
  };

  const ProgressBar = ({ percent }: { percent: Float }) => (
    <View>
      <View style={styles.progressBar}></View>
      <View style={[styles.progressStrip, { width: `${percent}%` }]} />
    </View>
  );

  const CourseItem = ({ data }: { data: courseListType }) => {
    const contentLabelStyle =
      data.kind === ContentKind.Article
        ? styles.articleTag
        : data.kind === ContentKind.CourseGroup
        ? styles.courseTag
        : styles.videoTag;

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
        <Image
          source={data.asset ? { uri: data.asset } : placeHolderImage}
          style={styles.contentImage}
        />
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text style={[styles.contentTag, { ...contentLabelStyle }]}>
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
    const kind: string | undefined = data?.kind;
    const { data: percentCompleteData } = useUserCourseProgressQuery({
      variables: {
        id: data.id,
      },
    });
    const percentCompleted =
      Number(percentCompleteData?.UserCourseProgress?.percentComplete) || 0;
    const contentLabelStyle =
      kind === ContentKind.Article
        ? styles.articleTag
        : kind === ContentKind.CourseGroup
        ? styles.courseTag
        : styles.videoTag;

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
        <Image
          source={
            data.asset
              ? {
                  uri: data.asset,
                }
              : placeHolderImage
          }
          style={styles.contentImage}
        />
        <View style={styles.contentRightBox}>
          <View style={styles.cTypeRow}>
            <Text style={[styles.contentTag, { ...contentLabelStyle }]}>
              {data.contentTypeLabel}
            </Text>
            {kind === ContentKind.Article && (
              <TouchableOpacity
                onPress={() =>
                  data.id !== offlineContent?.[index]?.id
                    ? downloadContent(data)
                    : deleteContent(data)
                }
              >
                {data.id !== offlineContent?.[index]?.id ? (
                  <Download
                    size={scaleDimension(24, true)}
                    color={theme.text["text-primary"]}
                  />
                ) : (
                  <XCircle
                    size={scaleDimension(24, true)}
                    color={theme.text["text-primary"]}
                  />
                )}
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
              style={[
                styles.catBox,
                {
                  ...(tab === item
                    ? styles.catBoxSelected
                    : styles.catBoxNormal),
                },
              ]}
            >
              <Text
                style={[
                  styles.catTitle,
                  {
                    ...(tab === item
                      ? styles.catTitleSelected
                      : styles.catTitleNormal),
                  },
                ]}
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
        <Text style={styles.emptyRecList}>
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
          style={styles.recList}
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
      style={styles.contentList}
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
      <View>
        <View style={styles.searchboxContainer}>
          <View style={styles.searchBar}>
            <Searchbar searchText={search} setSearch={setSearch} />
          </View>
          <FilterContext.Provider value={{ filters, setFilters }}>
            <FilterControl />
          </FilterContext.Provider>
        </View>
        {contentItemDataLoading ? (
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
                          cid: contentItemData?.UserContentItems?.[0]?.id || "",
                          from: "My Learnings",
                        })
                      }
                      style={styles.recentContent}
                    >
                      <Text style={styles.courseTitle}>
                        {contentItemData?.UserContentItems?.[0].title}
                      </Text>
                      <Image
                        source={
                          contentItemData?.UserContentItems?.[0].asset
                            ? {
                                uri: contentItemData?.UserContentItems?.[0]
                                  .asset,
                              }
                            : placeHolderImage
                        }
                        style={styles.recentImage}
                      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: scaleDimension(30, true),
  },
  title: {
    marginVertical: scaleDimension(16, false),
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  latestTitle: {
    marginVertical: scaleDimension(5, false),
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  searchboxContainer: {
    height: scaleDimension(25, false),
    display: "flex",
    flexDirection: "row",
  },
  catContainer: {
    display: "flex",
    flexDirection: "row",
    height: scaleDimension(30, false),
    marginTop: scaleDimension(10, false),
  },
  catBox: {
    borderRadius: scaleDimension(8, true),
    alignItems: "center",
    minWidth: scaleDimension(100, true),
    margin: scaleDimension(4, true),
  },
  catBoxSelected: {
    backgroundColor: theme.brand["brand-primary"],
  },
  catBoxNormal: {
    backgroundColor: theme.surface["surface-100"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.border["border-200"],
  },
  catTitle: {
    fontFamily: fonts.inter.regular,
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    padding: scaleDimension(4, true),
  },
  catTitleSelected: {
    color: theme.text["text-inverse"],
  },
  catTitleNormal: {
    color: theme.text["text-primary"],
  },
  courseTitle: {
    fontSize: scaleDimension(20, true),
    maxWidth: "60%",
    lineHeight: scaleDimension(12, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  recentContent: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: scaleDimension(8, true),
    borderColor: theme.border["border-100"],
    backgroundColor: theme.surface["surface-100"],
    justifyContent: "space-between",
    padding: scaleDimension(20, true),
  },
  contentRow: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: scaleDimension(8, true),
    borderColor: theme.border["border-100"],
    backgroundColor: theme.surface["surface-200"],
    justifyContent: "space-between",
    marginBottom: scaleDimension(5, false),
  },
  contentRightBox: {
    flexGrow: 1,
    minHeight: scaleDimension(50, false),
    margin: scaleDimension(20, true),
    marginRight: scaleDimension(20, true),
  },
  cTypeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentTag: {
    marginLeft: scaleDimension(-5, true),
    borderRadius: scaleDimension(16, true),
    fontSize: scaleDimension(14, true),
    padding: scaleDimension(6, true),
    paddingHorizontal: scaleDimension(16, true),
    flexGrow: 0,
    fontFamily: fonts.inter.regular,
    backgroundColor: theme.surface["surface-200"],
    marginBottom: scaleDimension(6, false),
  },
  courseTag: {
    backgroundColor: theme.surface["surface-yellow"],
  },
  blogTag: {
    backgroundColor: theme.surface["surface-green"],
  },
  articleTag: {
    backgroundColor: theme.surface["surface-green"],
  },
  videoTag: {
    backgroundColor: theme.surface["surface-200"],
  },
  contentImage: {
    width: scaleDimension(100, true),
    height: "100%",
    borderTopLeftRadius: scaleDimension(8, true),
    borderBottomLeftRadius: scaleDimension(8, true),
  },
  recentImage: {
    width: scaleDimension(100, true),
    borderRadius: scaleDimension(8, true),
    height: scaleDimension(100, true),
  },
  noRecords: {
    paddingTop: scaleDimension(20, false),
    textAlign: "center",
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
    fontFamily: fonts.poppins.bold,
  },
  note: {
    padding: scaleDimension(16, true),
    paddingBottom: 0,
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
    fontSize: scaleDimension(14, true),
    fontFamily: fonts.inter.regular,
  },
  progressBar: {
    height: scaleDimension(10, false),
    flexDirection: "row",
    backgroundColor: theme.border["border-200"],
    borderRadius: scaleDimension(10, true),
  },
  progressStrip: {
    position: "absolute",
    height: scaleDimension(10, false),
    backgroundColor: theme.brand["brand-primary"],
    borderRadius: scaleDimension(10, true),
  },
  emptyRecList: {
    padding: scaleDimension(16, true),
    paddingBottom: 0,
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
    fontSize: scaleDimension(14, true),
    fontFamily: fonts.inter.regular,
    paddingTop: scaleDimension(16, false),
  },
  recList: {
    height:
      Dimensions.get("window").height > 667
        ? scaleDimension(185, false)
        : scaleDimension(125, false),
  },
  contentList: {
    height:
      Dimensions.get("window").height > 667
        ? scaleDimension(150, false)
        : scaleDimension(215, false),
  },
  searchBar: {
    flexGrow: 1,
    marginRight: scaleDimension(3, true),
  },
});

export default MyLearnings;
