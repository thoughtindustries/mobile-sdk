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
import { useDataContext } from "../context";
import { placeHolderImage, scaleDimension, fonts, theme } from "../utils";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Recommendation = () => {
  const { catalogData, contentData } = useDataContext();
  const navigation = useNavigation<HomeScreenProps>();
  const recommendations = catalogData?.filter(
    (catalogItem) =>
      !contentData?.some(
        (contentItem) => contentItem.id === catalogItem.displayCourse
      )
  );

  const handleNav = (courseId: string) => {
    navigation.navigate("ContentDetails", {
      cid: courseId,
      from: "Home",
    });
  };

  const CatalogList = () => (
    <ScrollView
      horizontal={true}
      style={styles.courseContainer}
      showsHorizontalScrollIndicator={false}
    >
      {recommendations?.map((course, idx) => (
        <TouchableOpacity
          style={styles.recContentBox}
          key={idx}
          onPress={() => handleNav(course.displayCourse || "")}
        >
          <View>
            <ImageBackground
              key={idx}
              source={course.asset ? { uri: course.asset } : placeHolderImage}
              resizeMode="cover"
              imageStyle={styles.image}
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
      <View style={styles.sectionName}>
        <Text style={styles.heading}>Recommendations</Text>
      </View>
      <CatalogList />
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
    borderStyle: "solid",
    borderColor: theme.border["border-100"],
    margin: scaleDimension(12, true),
    height: scaleDimension(150, false),
    width: scaleDimension(300, true),
  },
  bannerArea: {
    height: "100%",
    padding: scaleDimension(32, true),
    justifyContent: "flex-end",
    fontFamily: fonts.poppins.regular,
  },
  courseTitle: {
    color: theme.text["text-inverse"],
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(8, false),
    paddingBottom: scaleDimension(5, false),
  },
  image: {
    borderRadius: scaleDimension(6, true),
    height: "100%",
    width: "100%",
  },
});

export default Recommendation;
