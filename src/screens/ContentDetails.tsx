import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import _ from "lodash";
import { Loader } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, contentListType } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";

import tiGql from "../helpers/TIGraphQL";
import { SafeAreaView } from "react-native-safe-area-context";

type ContentDetailsScreenProps = StackNavigationProp<
  RootStackParamList,
  "ContentDetails"
>;

const ContentDetails = () => {
  const cid = "090558e1-cad4-4a58-bc87-dbce45d4ec15"; //b9645873-39c6-455e-ba0b-7f15934245c7";
  const navigation = useNavigation<ContentDetailsScreenProps>();
  const [content, setContent] = React.useState<contentListType>({
    course: [],
    progress: [],
  });
  const [loading, setloading] = React.useState<boolean>(true);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const initialLayout = { width: Dimensions.get("window").width };

  const fetchContentDetails = () => {
    tiGql
      .fetchContentDetails(cid)
      .then(setContent)
      .catch(console.log)
      .finally(() => setloading(false));
  };

  React.useEffect(fetchContentDetails, [cid]);

  React.useEffect(() => {
    let asec = false;
    let secreads = _.get(content, "course.sections", []).filter(isSectionRead);
    if (secreads.length > 0) {
      setActiveSection(_.get(_.last(secreads), "id", ""));
    } else {
      setActiveSection(_.get(content, "course.sections[0].id", ""));
    }
  }, [content]);

  const CustomReport = () => (
    <View style={styles.reportRow}>
      <View style={styles.reportRightBox}>
        <Text style={styles.courseTitle}>
          {_.get(content, "course.title", "Course")}
        </Text>
        <Text style={styles.courseAuthor}>
          By {_.get(content, "course.courseGroup.authors", []).join(",")}
        </Text>
      </View>
      {_.get(content, "course.courseGroup.asset", "") !== "" && (
        <Image
          source={{ uri: _.get(content, "course.courseGroup.asset", "") }}
          style={styles.recentImage}
        />
      )}
    </View>
  );

  const AboutCourse = () => (
    <>
      <View style={styles.aboutSection}>
        <Text style={styles.courseSubTitle}>About this Course</Text>
        <Text style={styles.courseDesc}>
          {_.get(content, "course.courseGroup.description", "")}
        </Text>
      </View>
    </>
  );

  const toggleSection = (id: string) => {
    if (id !== activeSection) {
      setActiveSection(id);
    } else {
      setActiveSection("");
    }
  };

  const SectionProgress = (percent: Float) => (
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

  const LessonView = (lesson) => {
    const lessonRead =
      _.intersection(
        content.progress,
        lesson.topics.map((t: { id: String }) => t.id)
      ).length > 0;
    return (
      <View style={styles.lessonBox}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.lessonStatus}>
          {!lessonRead && (
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color="#000000"
            />
          )}
          {lessonRead && (
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color="#008463"
            />
          )}
        </View>
      </View>
    );
  };

  const isSectionRead = (sec) => {
    return sec.lessons.filter(
      (lesson: { topics: { id: String }[] }) =>
        _.intersection(
          content.progress,
          lesson.topics.map((t) => t.id)
        ).length > 0
    ).length;
  };

  const SectionView = (sec) => {
    const lessonsRead = isSectionRead(sec);

    return (
      <Collapse
        isExpanded={activeSection === sec.id}
        onToggle={() => toggleSection(sec.id)}
        style={styles.collapse}
      >
        <CollapseHeader>
          <View style={styles.sectionContainer}>
            <View style={{ width: "85%" }}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.lessons.length > 0 && (
                <>
                  <Text style={styles.sectionCount}>
                    {lessonsRead}/{sec.lessons.length} Lessons
                  </Text>
                  {SectionProgress((lessonsRead / sec.lessons.length) * 100)}
                </>
              )}
            </View>
            <MaterialCommunityIcons
              name={activeSection === sec.id ? "chevron-up" : "chevron-down"}
              size={36}
              color="#374151"
            />
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.lessonContainer}>
            {sec.lessons.map(LessonView)}
          </View>
        </CollapseBody>
      </Collapse>
    );
  };

  const SectionList = () => {
    return (
      <View style={styles.sectionList}>
        {_.get(content, "course.sections", []).map(SectionView)}
      </View>
    );
  };

  const clickHandler = () => {
    alert('Kya karna hai click pe!');
  };

  const FloatingContainer = () => {
    return ( <View style={styles.touchableOpacityStyle}>
    <View style={styles.FlotingText}>
      <Text style={styles.ftextItem}>UP NEXT</Text>
      <Text style={styles.fsection}>Section 1: Task Analysis</Text>
      <Text style={styles.ftopic}>Five Tips: Identifying a Task</Text>
    </View>
    <TouchableOpacity style={styles.button} onPress={clickHandler} activeOpacity={0.7}>
      <Text style={styles.buttonText}>GO</Text>
    </TouchableOpacity>
  </View>
    )
};

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.page}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color="#FFFFFF"
              style={styles.backIcon}
              onPress={() => navigation.navigate("Home")}
            />
            <Text
              style={styles.backBtn}
              onPress={() => navigation.navigate("Home")}
            >
              Back
            </Text>
          </View>
          {!loading && <CustomReport />}
          {!loading && <AboutCourse />}
         
        </View>

        {loading && (
          <View style={styles.searching}>
            <Text style={styles.searchingText}>Loading data </Text>
            <Loader size={50} />
          </View>
        )}

        {!loading && <SectionList />}
        
      </ScrollView>
      <FloatingContainer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionList: {
    marginTop: 20,
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
    width: "48.5%",
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
    marginTop: 50,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: "#F5F5F7",
  },
  row: {
    paddingTop: 0,
    display: "flex",
    flexDirection: "row",
  },
  backIcon: {
    backgroundColor: "#374151",
    borderRadius: 8,
    width: 32,
    height: 32,
  },
  backBtn: {
    paddingTop: 2,
    marginLeft: 10,
    fontSize: 20,
  },
  reportRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderBottomColor: "#D1D5DB",
    borderBottomWidth: 1,
    marginBottom: 20,
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
    paddingTop: 10,
  },
  courseSubTitle: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Inter_700Bold",
  },
  courseDesc: {
    fontSize: 15,
    lineHeight: 24,
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
  touchableOpacityStyle: {
    position: 'absolute',
    width: "92%",
    height: 120,
    alignItems: 'center',
    right: 16,
    left: 16,
    bottom: 30,
    backgroundColor:"#3B1FA3",
    borderColor: "#D1D5DB",
    borderRadius:8,
    borderWidth:1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  FlotingText: {
    color:"#ffffff",
    textAlign:"Center",
    alignContent:"flex-start",
    paddingLeft:20,
  },
  ftextItem: {
    color:"#D4D4D8",
    fontSize:10,
    lineHeight:12,
    fontFamily: "Inter_700Bold",
  },
  fsection: {
    fontSize:10,
    lineHeight:12,
    fontFamily: "Inter_700Bold",
    color:"#ffffff",
  },
  ftopic: {
    fontSize:16,
    lineHeight:24,
    color:"#ffffff",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    marginTop: 60,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    width:60,
    height:60,
  },
  buttonText: {
    fontFamily: "Inter_700Bold",
    fontSize:14,
  },
  floatingBox: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default ContentDetails;
