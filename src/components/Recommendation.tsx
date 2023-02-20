import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Recommendation = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const recommendedCourse: { thumbnail: string; coursename: string }[] = [
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name1",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
  ];
  return (
    <View>
      <View style={styles.courseBox}>
        <Text style={styles.heading}>Recommendations</Text>
      </View>
      <ScrollView horizontal={true} style={styles.courseContainer}>
        {recommendedCourse.map((course, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() =>
              navigation.navigate("ContentDetails", {
                cid: "b9645873-39c6-455e-ba0b-7f15934245c7",
              })
            }
          >
            <View style={styles.recContentBox}>
              <ImageBackground
                key={idx}
                source={{ uri: course.thumbnail }}
                resizeMode="cover"
                style={{ borderRadius: 10 }}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={styles.bannerArea}>
                  <Text style={styles.courseTitle}>{course.coursename}</Text>
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
