import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
import { useCourseByIdQuery, usePagesCompletedByCourseQuery } from "../graphql";
import { useDataContext } from "../context";

type ContentDetailsScreenProps = StackNavigationProp<
  RootStackParamList,
  "ContentDetails"
>;

const ContentDetails = () => {
  const route = useRoute();
  const { catalogData } = useDataContext();
  const { cid } = route.params;
  const { data: courseData, loading: courseDataLoading } = useCourseByIdQuery({
    variables: {
      id: cid,
    },
  });
  const { data: pagesCompletedData, loading: pagesCompletedDataLoading } =
    usePagesCompletedByCourseQuery({
      variables: {
        courseId: cid,
      },
    });
  const [catalogCourse] = useState(
    catalogData?.find((course) => course.id === cid)
  );

  let backToRoute = get(route, "params.from", "Home");
  const navigation = useNavigation<ContentDetailsScreenProps>();
  const [content] = useState<contentListType>({
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
      <Text
        style={styles(courseData).courseSubTitle}
      >{`About this ${courseData?.CourseById?.courseGroup?.contentType?.label}`}</Text>
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
        style={{
          backgroundColor: "#3B1FA3",
          width: `${percent}%`,
          borderRadius: 16,
        }}
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

  const SectionView: FC<{ id: string; title: string; lessons: [] }> = ({
    id,
    title,
    lessons,
  }) => {
    const lessonsRead = getSectionProgress(lessons);
    const sectionProgress = (lessonsRead.length / lessons.length) * 100;

    return (
      <Collapse
        isExpanded={activeSection === id}
        onToggle={() => toggleSection(id)}
        style={styles(courseData).collapse}
      >
        <CollapseHeader>
          <View style={styles(courseData).sectionContainer}>
            <View style={{ width: "85%" }}>
              <Text style={styles(courseData).sectionTitle}>{title}</Text>
              {lessons.length > 0 && (
                <View>
                  {lessonsRead.length > 0 && (
                    <Text style={styles(courseData).sectionCount}>
                      {lessonsRead.length}/{lessons.length} Lessons started
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
            <MaterialCommunityIcons
              name={activeSection === id ? "chevron-up" : "chevron-down"}
              size={36}
              color="#374151"
            />
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

  const FloatingContainer: FC = () => {
    const sectionId = getLastViewedSection();
    let section: any = courseData?.CourseById.sections?.[0];
    if (sectionId != "") {
      section = courseData?.CourseById?.sections?.find(
        (s: { id: string }) => s.id === sectionId
      );
    }
    return (
      <View>
        {courseData && (
          <View style={styles(courseData).floatingFooter}>
            <View style={styles(courseData).FlotingText}>
              <Text style={styles(courseData).ftextItem}>UP NEXT</Text>
              <Text style={styles(courseData).fsection}>{section?.title}</Text>
              <Text style={styles(courseData).ftopic}>
                {section?.lessons?.[0]?.title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles(courseData).button}
              onPress={() => alert("This will go to section")}
              activeOpacity={0.7}
            >
              <Text style={styles(courseData).buttonText}>GO</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const Nav: FC = () => (
    <TouchableOpacity style={styles(courseData).row}>
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
      <Text
        style={styles(courseData).backBtn}
        onPress={() => navigation.goBack()}
      >
        Back
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {courseDataLoading || pagesCompletedDataLoading ? (
        <View style={styles(courseData).loader}>
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

const styles = (data: any) =>
  StyleSheet.create({
    sectionList: {
      flex: data ? 4 : 0,
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
      width: (Dimensions.get("window").width / 440) * 80,
      height: (Dimensions.get("window").width / 440) * 80,
      borderRadius: 8,
      margin: (Dimensions.get("window").width / 440) * 20,
      marginRight: 0,
    },
    aboutSection: {
      marginHorizontal: 30,
      flex: data ? 2 : 5,
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
