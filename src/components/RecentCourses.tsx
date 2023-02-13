import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";

const RecentCourses = () => {
  const rececntLaunchCourse: {
    thumbnail: string;
    coursename: string;
    description: string;
  }[] = [
    {
      thumbnail: "https://placebear.com/640/360",
      coursename: "Course Name1",
      description:
        "Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.",
    },
    {
      thumbnail: "https://placebear.com/640/360",
      coursename: "Course Name2",
      description:
        "Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.",
    },
    {
      thumbnail: "https://placebear.com/640/360",
      coursename: "Course Name2",
      description:
        "Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.",
    },
    {
      thumbnail: "https://placebear.com/640/360",
      coursename: "Course Name2",
      description:
        "Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.",
    },
    {
      thumbnail: "https://placebear.com/640/360",
      coursename: "Course Name2",
      description:
        "Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.",
    },
  ];

  return (
    <View>
      <View style={styles.courseBox}>
        <Text style={styles.heading}>Recently Launched Courses</Text>
      </View>
      <ScrollView horizontal={true} style={styles.courseContainer}>
        {rececntLaunchCourse.map((course, idx) => (
          <View key={idx} style={styles.recContentBox}>
            <View style={styles.courseThumbnail}>
              <Image
                key={idx}
                source={{ uri: course.thumbnail }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
            <View style={styles.contentArea}>
              <Text style={styles.recCourseTitle}>{course.coursename}</Text>
              <Text style={styles.courseDes}>{course.description}</Text>
            </View>
          </View>
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
    lineHeight: 50,
  },
  courseDes: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
});

export default RecentCourses;
