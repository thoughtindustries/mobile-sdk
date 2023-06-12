import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { get, last } from "lodash";
import { LoadingBanner } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, contentListType } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useCourseByIdQuery, usePagesCompletedByCourseQuery } from "../graphql";

type ContentDetailsScreenProps = StackNavigationProp<
  RootStackParamList,
  "ContentDetails"
>;

const ContentDetails = () => {
  const route = useRoute();
  const { cid } = route.params;
  const { data: courseData, loading: courseDataLoading } = useCourseByIdQuery({
    variables: {
      id: cid || "",
    },
  });
  const { data: pagesCompletedData, loading: pagesCompletedDataLoading } =
    usePagesCompletedByCourseQuery({
      variables: {
        courseId: cid || "",
      },
    });

  let backToRoute = get(route, "params.from", "Home");
  const navigation = useNavigation<ContentDetailsScreenProps>();
  const [content, setContent] = useState<contentListType>({
    course: [],
    progress: [],
  });
  const [activeSection, setActiveSection] = useState<string>("");

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

  useEffect(() => {
    const lastId = getLastViewedSection();
    setActiveSection(
      lastId !== "" ? lastId : courseData?.CourseById?.sections?.[0]?.id || ""
    );
  }, [content]);

  const CustomReport = () => (
    <View style={styles.reportRow}>
      <View style={styles.reportRightBox}>
        <Text style={styles.courseTitle}>{courseData?.CourseById.title}</Text>
        <Text style={styles.courseAuthor}>
          By{" "}
          {courseData?.CourseById?.courseGroup?.authors?.join(", ") ||
            "Anonymous"}
        </Text>
      </View>
      {courseData?.CourseById.courseGroup?.asset !== "" && (
        <Image
          source={{ uri: courseData?.CourseById.courseGroup?.asset }}
          style={styles.recentImage}
        />
      )}
    </View>
  );

  const AboutCourse = () => (
    <View style={styles.aboutSection}>
      <Text style={styles.courseSubTitle}>About this Course</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.courseDesc}>
          {courseData?.CourseById.courseGroup?.description}
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

  const SectionProgress = ({ percent }: { percent: number }) => (
    <View style={styles.sectionProgress}>
      <Animated.View
        style={
          ([StyleSheet.absoluteFill],
          {
            backgroundColor: "#3B1FA3",
            width: `${percent}%`,
            borderRadius: 16,
          })
        }
      />
    </View>
  );

  const LessonView = ({
    idx,
    lesson,
    lessonsRead,
    section,
    secProgress,
  }: {
    idx: number;
    lesson: { topics: []; title: string };
    lessonsRead: string[];
    section: string;
    secProgress: number;
  }) => {
    const lessonRead = lesson.topics.some((topic: any) =>
      lessonsRead.includes(topic.id)
    );

    return (
      <TouchableOpacity
        key={idx}
        onPress={() =>
          navigation.navigate("ExploreCourse", {
            cid: cid,
            course: courseData?.CourseById.title || "",
            section: section,
            lesson: lesson.title,
            progress: secProgress,
            topics: lesson.topics,
            from: backToRoute,
          })
        }
      >
        <View style={styles.lessonBox}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonStatus}>
            <MaterialCommunityIcons
              name={`${lessonRead ? "check-circle-outline" : "lock-outline"}`}
              size={20}
              color={`${lessonRead ? "#008463" : "#000000"}`}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionView = ({
    id,
    title,
    lessons,
  }: {
    id: string;
    title: string;
    lessons: [];
  }) => {
    const lessonsRead = getSectionProgress(lessons);
    const sectionProgress = (lessonsRead.length / lessons.length) * 100;

    return (
      <Collapse
        isExpanded={activeSection === id}
        onToggle={() => toggleSection(id)}
        style={styles.collapse}
      >
        <CollapseHeader>
          <View style={styles.sectionContainer}>
            <View style={{ width: "85%" }}>
              <Text style={styles.sectionTitle}>{title}</Text>
              {lessons.length > 0 && (
                <View>
                  {lessonsRead.length > 0 && (
                    <Text style={styles.sectionCount}>
                      {lessonsRead.length}/{lessons.length} Lessons started
                    </Text>
                  )}
                  {lessonsRead.length === 0 && (
                    <Text style={styles.sectionCount}>No Lessons Started</Text>
                  )}
                  <SectionProgress percent={sectionProgress} />
                </View>
              )}
            </View>
            <MaterialCommunityIcons
              name={activeSection === id ? "chevron-up" : "chevron-down"}
              size={36}
              color="#374151"
            />
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.lessonContainer}>
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

  const SectionList = () => (
    <View style={styles.sectionList}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {courseData?.CourseById.sections?.map((section, idx) => (
          <SectionView
            key={idx}
            id={section.id}
            title={section?.title || ""}
            lessons={section.lessons as []}
          />
        ))}
      </ScrollView>
    </View>
  );

  const FloatingContainer = () => {
    const sectionId = getLastViewedSection();
    let section: any = courseData?.CourseById.sections?.[0];
    if (sectionId != "") {
      section = courseData?.CourseById?.sections?.find(
        (s: { id: string }) => s.id === sectionId
      );
    }
    return (
      <View style={styles.floatingFooter}>
        <View style={styles.FlotingText}>
          <Text style={styles.ftextItem}>UP NEXT</Text>
          <Text style={styles.fsection}>{section?.title}</Text>
          <Text style={styles.ftopic}>{section?.lessons?.[0]?.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("This will go to section")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>GO</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const Nav = () => (
    <TouchableOpacity style={styles.row}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#374151",
          borderRadius: 8,
          width: 36,
          height: 36,
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={32}
          color="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
      </View>
      <Text style={styles.backBtn} onPress={() => navigation.goBack()}>
        Back
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {courseDataLoading || pagesCompletedDataLoading ? (
        <View style={styles.loader}>
          <LoadingBanner />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Nav />
          <CustomReport />
          <AboutCourse />
          <SectionList />
          <FloatingContainer />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionList: {
    flex: 4,
  },
  loader: {
    marginHorizontal: 30,
    marginTop: 60,
  },
  collapse: {
    backgroundColor: "#FAFAFA",
  },
  sectionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    padding: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
  sectionCount: {
    color: "#6B7280",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    paddingVertical: 4,
  },
  sectionProgress: {
    height: 8,
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    borderRadius: 16,
  },
  lessonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingLeft: 32,
    paddingRight: 32,
  },
  lessonBox: {
    minWidth: "48.5%",
    borderColor: "#E5E7EB",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    minHeight: 70,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  lessonTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  lessonStatus: {
    alignItems: "flex-end",
  },
  page: {
    marginTop: 32,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: "#F5F5F7",
  },
  row: {
    marginTop: 60,
    marginLeft: 30,
    marginBottom: 30,
    alignItems: "center",
    paddingTop: 0,
    display: "flex",
    flexDirection: "row",
  },
  backBtn: {
    paddingTop: 2,
    marginLeft: 10,
    fontSize: 20,
  },
  reportRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottomColor: "#D1D5DB",
    borderBottomWidth: 1,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  reportRightBox: {
    flexGrow: 0,
    paddingTop: 30,
    paddingBottom: 30,
    width: "70%",
  },
  courseTitle: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  courseAuthor: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: "left",
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  recentImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    margin: 20,
    marginRight: 0,
  },
  aboutSection: {
    marginHorizontal: 30,
    flex: 2,
  },
  courseSubTitle: {
    fontSize: 12,
    paddingBottom: 12,
    lineHeight: 15,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Inter_700Bold",
  },
  courseDesc: {
    fontSize: 15,
    lineHeight: 24,
    paddingBottom: 20,
    textAlign: "left",
    paddingTop: 10,
    color: "#6B7280",
    fontFamily: "Poppins_400Regular",
  },

  searching: {
    margin: 32,
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
  floatingFooter: {
    position: "absolute",
    height: 120,
    alignItems: "center",
    right: 16,
    left: 16,
    bottom: 30,
    backgroundColor: "#3B1FA3",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  FlotingText: {
    color: "#ffffff",
    textAlign: "Center",
    alignContent: "flex-start",
    paddingLeft: 20,
  },
  ftextItem: {
    color: "#D4D4D8",
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "Inter_700Bold",
  },
  fsection: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "Inter_700Bold",
    color: "#ffffff",
  },
  ftopic: {
    fontSize: 16,
    lineHeight: 24,
    color: "#ffffff",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    marginTop: 60,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    width: 60,
    height: 60,
  },
  buttonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  floatingBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default ContentDetails;
