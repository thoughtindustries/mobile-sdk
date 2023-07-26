import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { useDataContext } from "../context";
import { placeHolderimage } from "../helpers";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const RecentCourses = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const { contentData } = useDataContext();

  return (
    <View>
      {contentData?.length !== 0 && (
        <View>
          <View style={styles.courseBox}>
            <Text style={styles.heading}>Recently Launched Courses</Text>
          </View>
          <ScrollView
            horizontal={true}
            style={styles.courseContainer}
            showsHorizontalScrollIndicator={false}
          >
            {contentData?.map((course, idx) => (
              <Pressable
                key={idx}
                onPress={() =>
                  navigation.navigate("ContentDetails", {
                    cid: course.id,
                    from: "Home",
                  })
                }
              >
                <View key={idx} style={styles.recContentBox}>
                  <View style={styles.courseThumbnail}>
                    <Image
                      key={idx}
                      source={
                        course.asset ? { uri: course.asset } : placeHolderimage
                      }
                      style={styles.image}
                    />
                  </View>
                  <View style={styles.contentArea}>
                    <Text style={styles.recCourseTitle}>{course.title}</Text>
                    <Text style={styles.courseDes}>{course.description}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  courseBox: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    marginTop: 15,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  courseContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  recContentBox: {
    backgroundColor: "#FAFAFA",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    width: 260,
    margin: 12,
    height: 300,
  },
  courseTitle: {
    color: "#D4D4D8",
    fontWeight: "700",
    fontSize: 16,
    justifyContent: "flex-start",
    lineHeight: 50,
  },
  courseThumbnail: {
    width: 260,
    height: 150,
  },
  contentArea: {
    padding: 32,
    fontFamily: "Poppins_400Regular",
  },
  recCourseTitle: {
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 16,
    paddingBottom: 10,
  },
  courseDes: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
});

export default RecentCourses;
