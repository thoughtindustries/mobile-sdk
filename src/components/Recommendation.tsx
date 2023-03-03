import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { courseListType, RootStackParamList } from "../../types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import tiGql from "../helpers/TIGraphQL";

import _ from "lodash";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Recommendation = () => {
  const [courses, setCourses] = useState<courseListType[]>([]);
  const navigation = useNavigation<HomeScreenProps>();

  const fetchRecommendedCourses = () => {
    let mycourses: String[] = [];
    tiGql
      .myLearnings({})
      .then((res) => {
        mycourses = res.items
          .filter((c) => c.contentTypeLabel === "Course")
          .map((c) => c.id);
      })
      .then(() => tiGql.fetchCourses({}))
      .then((res) => {
        setCourses(res.filter((c) => !mycourses.includes(c.displayCourse)));
      });
  };

  useEffect(fetchRecommendedCourses, []);

  useEffect(() => console.log(courses), [courses]);

  return (
    <View>
      <View style={styles.courseBox}>
        <Text style={styles.heading}>Recommendations</Text>
      </View>
      <ScrollView horizontal={true} style={styles.courseContainer}>
        {courses.map((course, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              navigation.navigate("ContentDetails", {
                cid: course.displayCourse,
                from: "Home",
              })
            }
          >
            <View style={styles.recContentBox}>
              <ImageBackground
                key={idx}
                source={{ uri: course.asset }}
                resizeMode="cover"
                style={{ borderRadius: 10 }}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.bannerArea}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  bannerArea: {
    height: 282,
    padding: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  courseTitle: {
    color: "#D4D4D8",
    fontWeight: "700",
    fontSize: 16,
    justifyContent: "flex-start",
    lineHeight: 50,
  },
});

export default Recommendation;
