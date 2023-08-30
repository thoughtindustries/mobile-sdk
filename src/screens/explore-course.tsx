import React, { useState, FC } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { CourseQuiz, LoadingBanner } from "../components";
import { RootStackParamList } from "../../types";
import { WebView } from "react-native-webview";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  usePagesQuery,
  useUpdateTopicAndCourseProgressMutation,
} from "../graphql";
import RenderHtml from "react-native-render-html";
import { QuizProvider } from "../context";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { fonts, scaleDimension, theme } from "../utils";

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

  const TextPage: FC = () => {
    const { width } = useWindowDimensions();
    const html =
      pagesData?.Pages?.[0].body || pagesData?.Pages?.[0]?.languages?.[0]?.body;

    return (
      <View
        style={styles(progress, topicIndex, topics.length).videoPageContainer}
      >
        <Text style={styles(progress, topicIndex, topics.length).topicTitle}>
          {pagesData?.Pages?.[0]?.title}
        </Text>
        {html && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <RenderHtml source={{ html }} contentWidth={width} />
          </ScrollView>
        )}
      </View>
    );
  };

  const VideoPage: FC = () => {
    const [videoLoading, setVideoLoading] = useState<boolean>(false);
    return (
      <View style={styles(progress, topicIndex, topics.length).container}>
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
      <ChevronLeft
        size={scaleDimension(36, true)}
        color={theme.text["text-primary"]}
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
        {(pagesData?.Pages?.[0]?.type === "text" ||
          pagesData?.Pages?.[0]?.type === undefined) && <TextPage />}
        {pagesData?.Pages?.[0]?.type === "video" && <VideoPage />}
        {pagesData?.Pages?.[0].type === "quiz" && (
          <QuizProvider>
            <CourseQuiz quiz={pagesData?.Pages?.[0]} courseid={cid} />
          </QuizProvider>
        )}
      </View>
    </View>
  );

  const CourseNav: FC = () => {
    const [updateTopicAndCourseProgressMutation] =
      useUpdateTopicAndCourseProgressMutation({});

    const handleNext = () => {
      updateTopicAndCourseProgressMutation({
        variables: {
          topicId: topics[topicIndex].id,
          progress: 100,
        },
      });

      if (topics.length - 1 > topicIndex) {
        setTopicIndex(topicIndex + 1);
      } else {
        navigation.navigate("ContentDetails", {
          cid: cid,
          from: "ExploreCourse",
        });
      }
    };

    const handlePrevious = () => {
      topicIndex > 0 ? setTopicIndex(topicIndex - 1) : navigation.goBack();
    };

    return (
      <View style={styles(progress, topicIndex, topics.length).courseNav}>
        <TouchableOpacity
          style={styles(progress, topicIndex, topics.length).topicBackButton}
          onPress={() => handlePrevious()}
        >
          <ChevronLeft
            size={scaleDimension(36, true)}
            color={theme.text["text-inverse"]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles(progress, topicIndex, topics.length).topicForwardButton}
          onPress={() => handleNext()}
        >
          <ChevronRight
            size={scaleDimension(36, true)}
            color={theme.brand["brand-primary"]}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
      <CourseNav />
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
      backgroundColor: theme.surface["surface-100"],
      display: "flex",
      flexDirection: "row",
    },
    pageNav: {
      backgroundColor: theme.surface["surface-100"],
      display: "flex",
      flexDirection: "row",
      padding: scaleDimension(8, true),
      paddingTop: scaleDimension(24, false),
      alignItems: "center",
    },
    pageNavButton: {
      fontSize: scaleDimension(20, true),
      fontFamily: fonts.poppins.regular,
    },
    courseNav: {
      display: "flex",
      flexDirection: "row",
      backgroundColor: theme.brand["brand-primary"],
      padding: scaleDimension(24, true),
      justifyContent: "space-between",
    },
    progressBar: {
      backgroundColor: theme.brand["brand-primary"],
      width: `${progress}%`,
      borderRadius: scaleDimension(16, true),
    },
    loader: {
      marginTop: scaleDimension(16, false),
      marginHorizontal: scaleDimension(30, true),
      flex: 1,
    },
    courseHeading: {
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: theme.border["border-100"],
      backgroundColor: theme.surface["surface-100"],
    },
    courseTitle: {
      color: theme.brand["brand-primary"],
      fontFamily: fonts.poppins.bold,
      fontSize: scaleDimension(20, true),
      lineHeight: scaleDimension(12, false),
      padding: scaleDimension(16, true),
      paddingLeft: scaleDimension(24, true),
      paddingRight: scaleDimension(24, true),
    },
    slide: {
      flex: 1,
      marginTop: scaleDimension(8, false),
      backgroundColor: theme.surface["surface-100"],
      padding: scaleDimension(24, true),
    },
    sectionTitle: {
      color: theme.text["text-primary"],
      fontFamily: fonts.inter.bold,
      fontSize: scaleDimension(16, true),
      paddingRight: scaleDimension(5, true),
    },
    lessonTitle: {
      color: theme.brand["brand-primary"],
      fontFamily: fonts.inter.bold,
      fontSize: scaleDimension(16, true),
    },
    sectionProgress: {
      marginTop: scaleDimension(8, false),
      marginBottom: scaleDimension(8, false),
      height: scaleDimension(4, false),
      flexDirection: "row",
      borderRadius: scaleDimension(16, true),
      backgroundColor: theme.border["border-200"],
    },
    topicPage: {
      padding: scaleDimension(8, true),
      flex: 1,
    },
    topicTitle: {
      color: theme.text["text-primary"],
      fontFamily: fonts.inter.bold,
      fontSize: scaleDimension(16, true),
      paddingRight: scaleDimension(6, true),
      marginBottom: scaleDimension(8, false),
    },
    topicText: {
      fontFamily: fonts.inter.regular,
      fontSize: scaleDimension(16, true),
      lineHeight: scaleDimension(12, false),
      color: theme.text["text-secondary"],
    },
    topicBackButton: {
      borderRadius: scaleDimension(6, true),
      borderWidth: 1,
      borderColor: theme.border["border-100"],
      backgroundColor: theme.brand["brand-primary"],
      padding: scaleDimension(6, true),
    },
    topicForwardButton: {
      borderRadius: scaleDimension(6, true),
      borderWidth: 1,
      borderColor: theme.border["border-100"],
      backgroundColor: theme.surface["surface-100"],
      padding: scaleDimension(6, true),
    },
    videoPageContainer: {
      flex: 1,
    },
    video: {
      height: "40%",
    },
  });

export default ExploreCourse;
