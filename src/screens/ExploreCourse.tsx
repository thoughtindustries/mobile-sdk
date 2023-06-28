import React, { useState, FC, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { get } from "lodash";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CourseQuiz, LoadingBanner } from "../components";
import { RootStackParamList } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView } from "react-native-webview";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { usePagesQuery } from "../graphql";

type ExploreCourseProps = StackNavigationProp<
  RootStackParamList,
  "ExploreCourse"
>;

const ExploreCourse = () => {
  const navigation = useNavigation<ExploreCourseProps>();
  const [topicIndex, setTopicIndex] = useState<number>(0);

  const route = useRoute<RouteProp<RootStackParamList, "ExploreCourse">>();
  const params = route.params;
  const { cid, course, section, topics, lesson, progress } = params;

  const { data: pagesData, loading: pageDataLoading } = usePagesQuery({
    variables: {
      identifiers: [topics?.[topicIndex]?.id],
    },
  });

  const TextPage: FC = () => (
    <View
      style={styles(progress, topicIndex, topics.length).videoPageContainer}
    >
      <Text style={styles(progress, topicIndex, topics.length).topicTitle}>
        {pagesData?.Pages?.[0]?.title}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles(progress, topicIndex, topics.length).topicText}>
          {pagesData?.Pages?.[0]?.body?.replace(/(<([^>]+)>)/gi, "")}
        </Text>
      </ScrollView>
    </View>
  );

  const VideoPage: FC = () => {
    const [videoLoading, setVideoLoading] = useState<boolean>(false);
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        {pagesData?.Pages?.[0]?.title && (
          <Text style={styles(progress, topicIndex, topics.length).topicTitle}>
            {pagesData.Pages[0].title}
          </Text>
        )}
        {pagesData?.Pages?.[0]?.preTextBlock && (
          <Text style={styles(progress, topicIndex, topics.length).topicText}>
            {pagesData.Pages[0].preTextBlock.replace(/(<([^>]+)>)/gi, "")}
          </Text>
        )}
        <View style={styles(progress, topicIndex, topics.length).video}>
          {videoLoading && <LoadingBanner />}
          <WebView
            onLoadStart={() => setVideoLoading(true)}
            onLoad={() => setVideoLoading(false)}
            javaScriptEnabled={true}
            source={{
              uri: `https://fast.wistia.com/embed/medias/${pagesData?.Pages?.[0]?.asset}`,
            }}
          />
        </View>
        <View>
          {pagesData?.Pages?.[0]?.body && (
            <View>
              <Text
                style={styles(progress, topicIndex, topics.length).topicTitle}
              >
                Description
              </Text>
              <Text
                style={styles(progress, topicIndex, topics.length).topicText}
              >
                {pagesData.Pages[0].body.replace(/(<([^>]+)>)/gi, "")}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const PageNav: FC = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles(progress, topicIndex, topics.length).pageNav}
    >
      <MaterialCommunityIcons
        name="chevron-left"
        size={36}
        color="#374151"
        onPress={() => navigation.goBack()}
      />
      <Text style={styles(progress, topicIndex, topics.length).pageNavButton}>
        Back
      </Text>
    </TouchableOpacity>
  );

  const CourseHeading: FC = () => (
    <View style={styles(progress, topicIndex, topics.length).courseHeading}>
      <View style={styles(progress, topicIndex, topics.length).row}>
        <Text style={styles(progress, topicIndex, topics.length).courseTitle}>
          {course}
        </Text>
      </View>
    </View>
  );

  const CourseDetails: FC = () => (
    <View style={styles(progress, topicIndex, topics.length).slide}>
      <View style={styles(progress, topicIndex, topics.length).row}>
        <Text style={styles(progress, topicIndex, topics.length).sectionTitle}>
          {section} /
        </Text>
        <Text style={styles(progress, topicIndex, topics.length).lessonTitle}>
          {lesson}
        </Text>
      </View>
      <View style={styles(progress, topicIndex, topics.length).sectionProgress}>
        <View style={styles(progress, topicIndex, topics.length).progressBar} />
      </View>
      <View style={styles(progress, topicIndex, topics.length).topicPage}>
        {pagesData?.Pages?.[0]?.type === "text" ? (
          <TextPage />
        ) : pagesData?.Pages?.[0]?.type === "video" ? (
          <VideoPage />
        ) : (
          <CourseQuiz quiz={pagesData?.Pages?.[0]} courseid={cid} />
        )}
      </View>
    </View>
  );

  const CourseNav: FC = () => (
    <View style={styles(progress, topicIndex, topics.length).courseNav}>
      <TouchableOpacity
        disabled={topicIndex === 0}
        style={styles(progress, topicIndex, topics.length).topicBackButton}
        onPress={() => {
          if (topicIndex > 0) {
            setTopicIndex(topicIndex - 1);
          }
        }}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={36}
          color={topicIndex === 0 ? "#3B1FA3" : "#FFFFFF"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={topicIndex === topics.length - 1}
        style={styles(progress, topicIndex, topics.length).topicForwardButton}
        onPress={() => {
          if (get(route, "params.topics.length", 1) - 1 > topicIndex) {
            setTopicIndex(topicIndex + 1);
          }
        }}
      >
        <MaterialCommunityIcons
          name="chevron-right"
          size={36}
          color={"#3B1FA3"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles(progress, topicIndex, topics.length).container}>
      {pageDataLoading ? (
        <View style={styles(progress, topicIndex, topics.length).loader}>
          <LoadingBanner />
        </View>
      ) : (
        <View
          style={styles(progress, topicIndex, topics.length).courseContainer}
        >
          <PageNav />
          <CourseHeading />
          <CourseDetails />
        </View>
      )}
      {topics.length > 1 && <CourseNav />}
    </View>
  );
};

const styles = (progress: number, topicIndex: number, topics: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    courseContainer: {
      flex: 1,
    },
    row: {
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "row",
    },
    pageNav: {
      backgroundColor: "#FFFFFF",
      display: "flex",
      flexDirection: "row",
      padding: 8,
      paddingTop: 40,
      alignItems: "center",
    },
    pageNavButton: {
      fontSize: 16,
      fontFamily: "Poppins_400Regular",
    },
    courseNav: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#3B1FA3",
      padding: 24,
      justifyContent: "space-between",
    },
    progressBar: {
      backgroundColor: "#3B1FA3",
      width: `${progress}%`,
      borderRadius: 16,
    },
    loader: {
      marginTop: 30,
      marginHorizontal: 30,
      flex: 1,
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
      flex: 1,
      marginTop: 16,
      backgroundColor: "#FFFFFF",
      padding: 24,
    },
    sectionTitle: {
      color: "#1F2937",
      fontFamily: "Inter_700Bold",
      fontSize: 14,
      paddingRight: 5,
    },
    lessonTitle: {
      color: "#3B1FA3",
      fontFamily: "Inter_700Bold",
      fontSize: 14,
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
    topicPage: {
      padding: 8,
      flex: 1,
    },
    topicTitle: {
      color: "#1F2937",
      fontFamily: "Inter_700Bold",
      fontSize: 14,
      paddingRight: 5,
      marginBottom: 16,
    },
    topicText: {
      fontFamily: "Inter_400Regular",
      fontSize: 16,
      lineHeight: 24,
      color: "#6B7280",
    },
    topicBackButton: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: topicIndex === 0 ? "#3B1FA3" : "#FFFFFF",
      backgroundColor: "#3B1FA3",
      padding: 5,
    },
    topicForwardButton: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: topicIndex === topics - 1 ? "#3B1FA3" : "#FFFFFF",
      backgroundColor: topicIndex === topics - 1 ? "#3B1FA3" : "#FFFFFF",
      padding: 5,
    },
    videoPageContainer: {
      flex: 1,
    },
    video: {
      height: "40%",
    },
  });

export default ExploreCourse;
