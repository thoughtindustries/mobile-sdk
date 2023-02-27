import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import _ from "lodash";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Loader, CourseQuiz } from "../components";
import { RootStackParamList } from "../../types";
import striptags from "striptags";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import tiGql from "../helpers/TIGraphQL";
import WebView from "react-native-webview";

type ExploreCourseProps = StackNavigationProp<
  RootStackParamList,
  "ExploreCourse"
>;

const ExploreCourse = () => {
  const navigation = useNavigation<ExploreCourseProps>();
  const [topicIndex, setTopicIndex] = useState<number>(0);
  const [loading, setLoading] = useState<Boolean>(false);
  const [topicData, setTopicData] = useState({});

  const route = useRoute();

  const fetchTopic = () => {
    const topic = _.get(route, `params.topics.${topicIndex}`, {
      id: "",
      type: "",
    });
    //console.log(topic);
    setLoading(true);
    tiGql
      .fetchTopicPage(topic.id, topic.type)
      .then(setTopicData)
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(fetchTopic, [topicIndex]);

  const renderPage = () =>
    ({
      video: renderVideo,
      text: renderText,
      quiz: renderQuiz,
    }[_.get(topicData, "type", "text")]());

  const renderVideo = () => {
    return (
      <>
        <Text style={styles.topicTitle}>{_.get(topicData, "title", "")}</Text>
        {_.get(topicData, "preTextBlock", "") != "" && (
          <Text style={styles.topicText}>
            {striptags(_.get(topicData, "preTextBlock", ""))}
          </Text>
        )}
        <WebView
          source={{
            uri: `https://fast.wistia.com/embed/medias/${_.get(
              topicData,
              "asset",
              ""
            )}`,
          }}
          style={{ marginTop: 20, height: 200 }}
        />

        {_.get(topicData, "body", "") != "" && (
          <>
            <Text style={styles.topicTitle}>Description</Text>
            <Text style={styles.topicText}>
              {striptags(_.get(topicData, "body", ""))}
            </Text>
          </>
        )}
      </>
    );
  };

  const renderText = () => (
    <>
      <Text style={styles.topicTitle}>{_.get(topicData, "title", "")}</Text>
      <Text style={styles.topicText}>
        {striptags(_.get(topicData, "body", ""))}
      </Text>
    </>
  );
  const renderQuiz = () => <CourseQuiz quiz={topicData} />;

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <View>
          <View style={{ ...styles.row, padding: 8, paddingTop: 40 }}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={36}
              color="#374151"
              onPress={() =>
                navigation.navigate("ContentDetails", {
                  cid: _.get(route, "params.cid", ""),
                  from: _.get(route, "params.from", ""),
                })
              }
            />
            <Text
              style={styles.backBtn}
              onPress={() =>
                navigation.navigate("ContentDetails", {
                  cid: _.get(route, "params.cid", ""),
                  from: _.get(route, "params.from", ""),
                })
              }
            >
              Back
            </Text>
          </View>

          <View style={styles.courseHeading}>
            <View style={{ ...styles.row, paddingTop: 0 }}>
              <Text style={styles.courseTitle}>
                {_.get(route, "params.course", "")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>
              {_.get(route, "params.section", "")} /
            </Text>
            <Text style={styles.lessonTitle}>
              {_.get(route, "params.lesson", "")}
            </Text>
          </View>
          <View style={styles.sectionProgress}>
            <Animated.View
              style={
                ([StyleSheet.absoluteFill],
                {
                  backgroundColor: "#3B1FA3",
                  width: `${_.get(route, "params.progress", 0)}%`,
                  borderRadius: 16,
                })
              }
            />
          </View>
          {loading && (
            <View style={styles.searching}>
              <Text style={styles.searchingText}>Loading data </Text>
              <Loader size={50} />
            </View>
          )}
          {!loading && <View style={styles.topicPage}>{renderPage()}</View>}
        </View>
      </ScrollView>
      {!loading && (
        <View
          style={{
            ...styles.row,
            ...styles.pagingBox,
            justifyContent: "space-between",
          }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={36}
            color={topicIndex === 0 ? "#FFFFFF" : "#3B1FA3"}
            style={topicIndex === 0 ? styles.pageBtnDisabled : styles.pageBtn}
            onPress={() => {
              if (topicIndex > 0) {
                setTopicIndex(topicIndex - 1);
              }
            }}
          />

          <MaterialCommunityIcons
            name="chevron-right"
            size={36}
            color={
              _.get(route, "params.topics.length", 1) - 1 > topicIndex
                ? "#3B1FA3"
                : "#FFFFFF"
            }
            style={
              _.get(route, "params.topics.length", 1) - 1 > topicIndex
                ? styles.pageBtn
                : styles.pageBtnDisabled
            }
            onPress={() => {
              if (_.get(route, "params.topics.length", 1) - 1 > topicIndex) {
                setTopicIndex(topicIndex + 1);
              }
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
  },
  backBtn: {
    paddingTop: 7,
    marginLeft: 0,
  },
  courseHeading: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  courseTitle: {
    color: "#3B1FA3",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    paddingLeft: 24,
    paddingRight: 24,
  },

  slide: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    padding: 24,
  },

  sectionTitle: {
    color: "#1F2937",
    fontFamily: "Inter_700Bold",
    fontSiz: 14,
    paddingRight: 5,
  },

  lessonTitle: {
    color: "#3B1FA3",
    fontFamily: "Inter_700Bold",
    fontSiz: 14,
  },

  sectionProgress: {
    marginTop: 15,
    marginBottom: 15,
    height: 8,
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    borderRadius: 16,
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

  topicPage: {
    padding: 8,
  },

  topicTitle: {
    color: "#1F2937",
    fontFamily: "Inter_700Bold",
    fontSiz: 14,
    paddingRight: 5,
  },

  topicText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
  },

  pagingBox: {
    backgroundColor: "#3B1FA3",
    padding: 24,
  },

  pageBtnDisabled: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    padding: 5,
  },

  pageBtn: {
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    padding: 5,
  },
});

export default ExploreCourse;