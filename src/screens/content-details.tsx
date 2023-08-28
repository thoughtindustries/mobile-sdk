import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { get, last } from "lodash";
import { LoadingBanner } from "../components";
import {
  useNavigation,
  useRoute,
  useIsFocused,
  RouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, contentListType } from "../../types";
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
} from "lucide-react-native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { useCourseByIdQuery, usePagesCompletedByCourseQuery } from "../graphql";
import { useDataContext } from "../context";
import { fonts, scaleDimension, theme } from "../utils";

type ContentDetailsScreenProps = StackNavigationProp<
  RootStackParamList,
  "ContentDetails"
>;

const ContentDetails = () => {
  const route = useRoute<RouteProp<RootStackParamList, "ContentDetails">>();
  const { catalogData } = useDataContext();
  const isFocused = useIsFocused();
  const { cid, from } = route.params;
  const {
    data: courseData,
    loading: courseDataLoading,
    refetch: refetchCourseData,
  } = useCourseByIdQuery({
    variables: {
      id: cid,
    },
  });
  const {
    data: pagesCompletedData,
    loading: pagesCompletedDataLoading,
    refetch: refetchPagesCompleted,
  } = usePagesCompletedByCourseQuery({
    variables: {
      courseId: cid,
    },
  });
  const [catalogCourse] = useState(
    catalogData?.find((course) => course.displayCourse === cid)
  );
  const [loading, setLoading] = useState<boolean>(false);

  let backToRoute = get(route, "params.from", "Home");
  const navigation = useNavigation<ContentDetailsScreenProps>();
  const [content] = useState<contentListType>({
    course: [],
    progress: [],
  });
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (isFocused && from === "ExploreCourse") {
        try {
          setLoading(true);

          await refetchPagesCompleted();
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("ERROR: ", error);
        }
      }
      await refetchCourseData();
    })();
  }, [isFocused]);

  const getLastViewedSection = () => {
    let secreads = get(content, "course.sections", []).filter(
      getSectionProgress
    );
    return get(last(secreads), "id", "");
  };

  const getSectionProgress = (lessons: []) => {
    let pagesCompletedIds: string[] = [];
    let topicIds: string[] = [];

    pagesCompletedData?.PagesCompletedByCourse.map((completedPage: any) => {
      pagesCompletedIds.push(completedPage.id);
    });

    lessons.map((lesson: any) => {
      lesson.topics.filter((topic: any) => {
        topicIds.push(topic.id);
      });
    });

    const lessonsRead = pagesCompletedIds.filter((completedPageId: string) =>
      topicIds.includes(completedPageId)
    );

    return lessonsRead;
  };

  const getCourseKind = (kind: string | undefined) => {
    if (typeof kind !== "string" || kind.length === 0) {
      return kind;
    }
    return kind.charAt(0).toUpperCase() + kind.slice(1);
  };

  useEffect(() => {
    const lastId = getLastViewedSection();
    setActiveSection(
      lastId !== "" ? lastId : courseData?.CourseById?.sections?.[0]?.id || ""
    );
  }, [content]);

  const CustomReport: FC = () => (
    <View style={styles(courseData).reportRow}>
      <View style={styles(courseData).reportRightBox}>
        <Text style={styles(courseData).courseTitle}>
          {courseData?.CourseById.title || catalogCourse?.title}
        </Text>
        <Text style={styles(courseData).courseAuthor}>
          By{" "}
          {courseData?.CourseById?.courseGroup?.authors?.join(", ") ||
            catalogCourse?.authors?.join(", ") ||
            "Anonymous"}
        </Text>
      </View>
      <Image
        source={{
          uri:
            courseData?.CourseById.courseGroup?.asset || catalogCourse?.asset,
        }}
        style={styles(courseData).recentImage}
      />
    </View>
  );

  const AboutCourse: FC = () => (
    <View style={styles(courseData).aboutSection}>
      <Text style={styles(courseData).courseSubTitle}>{`About this ${
        courseData?.CourseById?.courseGroup?.contentType?.label ||
        getCourseKind(catalogCourse?.kind)
      }`}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles(courseData).courseDesc}>
          {courseData?.CourseById.courseGroup?.description ||
            catalogCourse?.description}
        </Text>
      </ScrollView>
    </View>
  );

  const toggleSection = (id: string) => {
    if (id !== activeSection) {
      setActiveSection(id);
    } else {
      setActiveSection("");
    }
  };

  const SectionProgress: FC<{ percent: number }> = ({ percent }) => (
    <View style={styles(courseData).sectionProgress}>
      <Animated.View
        style={[styles(courseData).progressBar, { width: `${percent}%` }]}
      />
    </View>
  );

  const LessonView: FC<{
    idx: number;
    lesson: { topics: []; title: string };
    lessonsRead: string[];
    section: string;
    secProgress: number;
  }> = ({ idx, lesson, lessonsRead, section, secProgress }) => {
    const lessonRead = lesson.topics.some((topic: any) =>
      lessonsRead.includes(topic.id)
    );

    return (
      <TouchableOpacity
        key={idx}
        onPress={() =>
          navigation.navigate("ExploreCourse", {
            cid: cid,
            course: courseData?.CourseById.title || catalogCourse?.title || "",
            section: section,
            lesson: lesson.title,
            progress: secProgress,
            topics: lesson.topics,
            from: backToRoute,
          })
        }
      >
        <View style={styles(courseData).lessonBox}>
          <Text style={styles(courseData).lessonTitle}>{lesson.title}</Text>
          <View style={styles(courseData).lessonStatus}>
            {lessonRead ? (
              <CheckCircle2
                size={scaleDimension(24, true)}
                color={theme.border["border-success"]}
              />
            ) : (
              <Lock
                size={scaleDimension(24, true)}
                color={theme.border["border-primary"]}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionView: FC<{ id: string; title: string; lessons: [] }> = ({
    id,
    title,
    lessons,
  }) => {
    const lessonsRead = getSectionProgress(lessons);
    const sectionProgress =
      ((lessonsRead.length < lessons.length
        ? lessonsRead.length
        : lessons.length) /
        lessons.length) *
      100;

    return (
      <Collapse
        isExpanded={activeSection === id}
        onToggle={() => toggleSection(id)}
        style={styles(courseData).collapse}
      >
        <CollapseHeader>
          <View style={styles(courseData).sectionContainer}>
            <View style={styles(courseData).sectionHeader}>
              <Text style={styles(courseData).sectionTitle}>{title}</Text>
              {lessons.length > 0 && (
                <View>
                  {lessonsRead.length > 0 && (
                    <Text style={styles(courseData).sectionCount}>
                      {lessonsRead.length < lessons.length
                        ? lessonsRead.length
                        : lessons.length}
                      /{lessons.length} Lessons started
                    </Text>
                  )}
                  {lessonsRead.length === 0 && (
                    <Text style={styles(courseData).sectionCount}>
                      No Lessons Started
                    </Text>
                  )}
                  <SectionProgress percent={sectionProgress} />
                </View>
              )}
            </View>
            {activeSection === id ? (
              <ChevronUp
                size={scaleDimension(36, true)}
                color={theme.border["border-primary"]}
              />
            ) : (
              <ChevronDown
                size={scaleDimension(36, true)}
                color={theme.border["border-primary"]}
              />
            )}
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles(courseData).lessonContainer}>
            {lessons.map((lesson, idx) => (
              <LessonView
                key={idx}
                idx={idx}
                lesson={lesson}
                lessonsRead={lessonsRead}
                section={title}
                secProgress={sectionProgress}
              />
            ))}
          </View>
        </CollapseBody>
      </Collapse>
    );
  };

  const SectionList: FC = () => (
    <View style={styles(courseData).sectionList}>
      {courseData?.CourseById && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {courseData.CourseById.sections?.map((section, idx) => (
            <SectionView
              key={idx}
              id={section.id}
              title={section?.title || ""}
              lessons={section.lessons as []}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  const Nav: FC = () => (
    <TouchableOpacity
      style={styles(courseData).backButtonContainer}
      onPress={() => navigation.goBack()}
    >
      <View style={styles(courseData).backButton}>
        <ChevronLeft
          size={scaleDimension(32, true)}
          color={theme.text["text-inverse"]}
        />
      </View>
      <Text
        style={styles(courseData).backBtn}
        onPress={() => navigation.goBack()}
      >
        Back
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles(courseData).container}>
      {courseDataLoading || pagesCompletedDataLoading || loading ? (
        <View style={styles(courseData).loader}>
          <LoadingBanner />
        </View>
      ) : (
        <View style={styles(courseData).container}>
          <Nav />
          <CustomReport />
          <AboutCourse />
          <SectionList />
        </View>
      )}
    </View>
  );
};

const styles = (data: any) =>
  StyleSheet.create({
    sectionList: {
      flex: data ? 4 : 0,
    },
    container: {
      flex: 1,
    },
    loader: {
      marginHorizontal: scaleDimension(30, true),
      marginTop: scaleDimension(30, false),
    },
    collapse: {
      backgroundColor: theme.surface["surface-200"],
    },
    sectionContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.border["border-200"],
      padding: scaleDimension(16, true),
      paddingLeft: scaleDimension(32, true),
      paddingRight: scaleDimension(32, true),
    },
    sectionTitle: {
      fontSize: scaleDimension(16, true),
      fontFamily: fonts.poppins.bold,
    },
    sectionCount: {
      color: theme.text["text-secondary"],
      fontSize: scaleDimension(12, true),
      fontFamily: fonts.inter.regular,
      paddingBottom: scaleDimension(6, true),
    },
    sectionProgress: {
      height: scaleDimension(4, false),
      flexDirection: "row",
      borderRadius: scaleDimension(16, true),
      backgroundColor: theme.border["border-200"],
    },
    lessonContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      flexWrap: "wrap",
      backgroundColor: theme.surface["surface-100"],
      paddingTop: scaleDimension(16, true),
      paddingLeft: scaleDimension(32, true),
      paddingRight: scaleDimension(32, true),
    },
    lessonBox: {
      width: scaleDimension(180, true),
      borderColor: theme.border["border-100"],
      backgroundColor: theme.surface["surface-200"],
      borderWidth: 1,
      padding: scaleDimension(10, true),
      marginBottom: scaleDimension(10, true),
      borderRadius: scaleDimension(4, true),
      minHeight: scaleDimension(35, false),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    lessonTitle: {
      fontSize: scaleDimension(16, true),
      fontFamily: fonts.inter.bold,
    },
    lessonStatus: {
      alignItems: "flex-end",
    },
    row: {
      marginTop: scaleDimension(30, false),
      marginLeft: scaleDimension(30, true),
      marginBottom: scaleDimension(30, true),
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
    },
    backButtonContainer: {
      marginTop: scaleDimension(30, false),
      marginLeft: scaleDimension(30, true),
      marginBottom: scaleDimension(30, true),
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      maxWidth: "33%",
    },
    backBtn: {
      paddingTop: 2,
      marginLeft: scaleDimension(10, true),
      fontSize: scaleDimension(24, true),
      fontFamily: fonts.inter.regular,
    },
    reportRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      borderBottomColor: theme.border["border-200"],
      borderBottomWidth: 1,
      marginBottom: scaleDimension(10, false),
      marginHorizontal: scaleDimension(30, true),
    },
    reportRightBox: {
      paddingTop: scaleDimension(16, false),
      paddingBottom: scaleDimension(16, false),
      width: "70%",
    },
    courseTitle: {
      fontSize: scaleDimension(24, true),
      lineHeight: scaleDimension(12, false),
      textAlign: "left",
      color: theme.text["text-primary"],
      fontFamily: fonts.poppins.bold,
    },
    courseAuthor: {
      fontSize: scaleDimension(14, true),
      lineHeight: scaleDimension(8, false),
      textAlign: "left",
      color: theme.text["text-secondary"],
      fontFamily: fonts.inter.regular,
    },
    recentImage: {
      width: scaleDimension(80, true),
      height: scaleDimension(80, true),
      borderRadius: scaleDimension(8, true),
      margin: scaleDimension(20, true),
      marginRight: 0,
    },
    aboutSection: {
      marginHorizontal: scaleDimension(30, true),
      flex: data ? 2 : 5,
    },
    courseSubTitle: {
      fontSize: scaleDimension(16, true),
      paddingBottom: scaleDimension(6, false),
      lineHeight: scaleDimension(8, false),
      textAlign: "left",
      color: theme.text["text-primary"],
      fontFamily: fonts.inter.bold,
    },
    courseDesc: {
      fontSize: scaleDimension(16, true),
      lineHeight: scaleDimension(12, false),
      paddingBottom: scaleDimension(10, false),
      textAlign: "left",
      paddingTop: scaleDimension(5, false),
      color: theme.text["text-secondary"],
      fontFamily: fonts.poppins.regular,
    },
    button: {
      marginTop: scaleDimension(30, false),
      marginRight: scaleDimension(20, true),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface["surface-100"],
      borderRadius: scaleDimension(4, true),
      width: scaleDimension(60, true),
      height: scaleDimension(60, true),
    },
    progressBar: {
      backgroundColor: theme.brand["brand-primary"],
      borderRadius: scaleDimension(16, true),
    },
    sectionHeader: {
      width: "85%",
    },
    backButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface["surface-500"],
      borderRadius: scaleDimension(8, true),
      width: scaleDimension(36, true),
      height: scaleDimension(36, true),
    },
  });

export default ContentDetails;
