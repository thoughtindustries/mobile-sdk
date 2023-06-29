import React, { useState, FC } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, LoadingBanner, Hero } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useCourseByIdQuery } from "../graphql";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDataContext } from "../context";

type MyLearningProps = StackNavigationProp<RootStackParamList, "MyLearning">;

const CourseDetails = () => {
  const navigation = useNavigation<MyLearningProps>();
  const route = useRoute();
  const { cid, asset, contentTypeLabel } = route.params;
  const [showPage, setShowPage] = useState<boolean>(false);

  const { data: courseData, loading: courseDataLoading } = useCourseByIdQuery({
    variables: {
      id: cid,
    },
  });

  const { catalogData } = useDataContext();
  const [catalogCourse] = useState(
    catalogData?.find((course) => course.id === cid)
  );

  const CourseDetailsBanner: FC = () => (
    <Hero asset={courseData?.CourseById.courseGroup?.asset || asset}>
      <View style={styles.bannerArea}>
        <View style={styles.buttons}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={36}
            color="#374151"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={styles.bannerTitle}>
          {courseData?.CourseById?.title || catalogCourse?.title}
        </Text>
      </View>
    </Hero>
  );

  const CourseDetailsDescription: FC = () => (
    <View style={styles.courseDetailsDescription}>
      <Text
        style={styles.courseDetailsDescriptionTitle}
      >{`About this ${contentTypeLabel}`}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.body}>
          {courseData?.CourseById.courseGroup?.description ||
            catalogCourse?.description}
        </Text>
      </ScrollView>
    </View>
  );

  const CourseDetailsNav: FC = () => (
    <TouchableOpacity
      style={styles.courseDetailsNav}
      onPress={() => setShowPage(false)}
    >
      <MaterialCommunityIcons name="chevron-left" size={32} color="#374151" />
      <Text style={styles.courseDetailsNavButton}>Back</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {courseDataLoading ? (
        <View style={styles.loader}>
          <LoadingBanner />
        </View>
      ) : showPage ? (
        <View style={styles.page}>
          <CourseDetailsNav />
          <View style={styles.articleHeading}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="menu" size={32} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.courseTitle}>
              {courseData?.CourseById.title || catalogCourse?.title}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.subContainer}>
          <CourseDetailsBanner />
          <View style={styles.buttonContainer}>
            <CourseDetailsDescription />
            <View style={styles.divide} />
            <View style={styles.button}>
              <Button
                title={`View ${contentTypeLabel}`}
                onPress={() => setShowPage(true)}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  page: {
    backgroundColor: "white",
  },
  divide: {
    borderTopWidth: 2,
    borderTopColor: "#E5E7EB",
  },
  bannerArea: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    fontFamily: "Poppins_400Regular",
  },
  courseDetailsDescription: {
    flex: 6,
    padding: 30,
  },
  courseDetailsDescriptionTitle: {
    fontFamily: "Poppins_700Bold",
    marginBottom: 16,
  },
  courseDetailsNav: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  courseDetailsNavButton: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  button: {
    margin: 30,
  },
  buttonContainer: {
    flex: 1.5,
  },
  loader: {
    marginTop: 30,
    marginHorizontal: 30,
  },
  buttons: {
    backgroundColor: "#F9FAFB",
    height: 40,
    width: 40,
    borderRadius: 10,
    padding: 2,
    marginTop: 30,
  },
  bannerTitle: {
    fontSize: 32,
    lineHeight: 36,
    fontFamily: "Poppins_700Bold",
    color: "#D4D4D8",
  },
  title: {
    fontSize: 20,
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  courseTitle: {
    color: "#3B1FA3",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 24,
    color: "#6B7280",
  },
  row: {
    backgroundColor: "#fff",
    paddingTop: 40,
    display: "flex",
    flexDirection: "row",
  },
  articleHeading: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
});

export default CourseDetails;
