import React from "react";
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
import _ from "lodash";
import { useUserContentItemsQuery, useCatalogContentQuery } from "../graphql";
import { GlobalTypes } from "../graphql";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Recommendation = () => {
  const { data: contentData } = useUserContentItemsQuery();
  const { data: catalogData } = useCatalogContentQuery({
    variables: {
      sortColumn: GlobalTypes.SortColumn.Title,
      sortDirection: GlobalTypes.SortDirection.Asc,
      page: 1,
      labels: [],
      values: [],
      contentTypes: "Course",
    },
  });
  const navigation = useNavigation<HomeScreenProps>();

  const CourseList = () => (
    <ScrollView
      horizontal={true}
      style={styles.courseContainer}
      showsHorizontalScrollIndicator={false}
    >
      {catalogData?.CatalogContent?.contentItems?.map((course, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() =>
            navigation.navigate("ContentDetails", {
              cid: course.id,
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
  );

  const ContentList = () => (
    <ScrollView
      horizontal={true}
      style={styles.courseContainer}
      showsHorizontalScrollIndicator={false}
    >
      {contentData?.UserContentItems?.filter(
        (item) => item.contentTypeLabel === "Course"
      ).map((course, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() =>
            navigation.navigate("ContentDetails", {
              cid: course.displayCourse ? course.displayCourse : "",
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
  );

  return (
    <View>
      <View style={styles.courseBox}>
        <Text style={styles.heading}>Recommendations</Text>
      </View>
      {contentData?.UserContentItems?.length !== 0 ? (
        <ContentList />
      ) : (
        <CourseList />
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
