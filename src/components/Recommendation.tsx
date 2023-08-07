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
import { placeHolderimage } from "../helpers";

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

  const CatalogList = () => (
    <ScrollView
      horizontal={true}
      style={styles.courseContainer}
      showsHorizontalScrollIndicator={false}
    >
      {recommendations?.map((course, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() =>
            navigation.navigate("ContentDetails", {
              cid: course?.displayCourse || "",
              from: "Home",
            })
          }
        >
          <View style={styles.recContentBox}>
            <ImageBackground
              key={idx}
              source={course.asset ? { uri: course.asset } : placeHolderimage}
              resizeMode="contain"
              style={styles.imageBackground}
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
      <View style={styles.courseBox}>
        <Text style={styles.heading}>Recommendations</Text>
      </View>
      <CatalogList />
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
    marginHorizontal: -12,
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
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  courseTitle: {
    color: "#D4D4D8",
    fontWeight: "700",
    fontSize: 16,
    justifyContent: "flex-start",
    lineHeight: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding:15,
  },
  image: {
    borderRadius: 8,
  },
  imageBackground: {
    borderRadius: 10,
  },
});

export default Recommendation;
