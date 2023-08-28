import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { useDataContext } from "../context";
import {
  fonts,
  placeHolderImage,
  scaleDimension,
  theme,
  truncateString,
} from "../utils";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const RecentCourses = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const { contentData } = useDataContext();

  const handleNav = (courseId: string) => {
    navigation.navigate("ContentDetails", {
      cid: courseId,
      from: "Home",
    });
  };

  return (
    <View>
      {contentData?.length !== 0 && (
        <View>
          <View style={styles.sectionName}>
            <Text style={styles.heading}>Recently Launched Courses</Text>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.courseContainer}
            showsHorizontalScrollIndicator={false}
          >
            {contentData?.map((course, idx) => (
              <TouchableOpacity
                style={styles.recContentBox}
                key={idx}
                onPress={() => handleNav(course.id)}
              >
                <View key={idx}>
                  <View style={styles.courseThumbnail}>
                    <Image
                      key={idx}
                      source={
                        course.asset ? { uri: course.asset } : placeHolderImage
                      }
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.contentArea}>
                    <Text style={styles.recCourseTitle}>{course.title}</Text>
                    <Text style={styles.courseDes}>
                      {truncateString(course.description || "", 30)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionName: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    marginTop: scaleDimension(16, true),
    fontSize: scaleDimension(8, false),
    lineHeight: scaleDimension(14, false),
    fontFamily: fonts.poppins.bold,
    color: theme.text["text-primary"],
  },
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    padding: scaleDimension(5, true),
    marginLeft: scaleDimension(-12, true),
  },
  recContentBox: {
    backgroundColor: theme.surface["surface-200"],
    borderStyle: "solid",
    borderColor: theme.border["border-100"],
    margin: scaleDimension(12, true),
    height: scaleDimension(150, false),
    width: scaleDimension(300, true),
  },
  courseThumbnail: {
    width: "100%",
    height: "50%",
  },
  contentArea: {
    padding: scaleDimension(32, true),
    fontFamily: fonts.poppins.regular,
  },
  recCourseTitle: {
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(8, false),
    paddingBottom: scaleDimension(5, false),
  },
  courseDes: {
    color: theme.text["text-secondary"],
    fontSize: scaleDimension(7, false),
    fontFamily: fonts.inter.regular,
    lineHeight: scaleDimension(9, false),
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: scaleDimension(6, true),
    borderTopRightRadius: scaleDimension(6, true),
  },
});

export default RecentCourses;
