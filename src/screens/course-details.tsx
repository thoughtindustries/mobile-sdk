import React, { useState, FC } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Button, LoadingBanner, Hero } from "../components";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ChevronLeft, Menu } from "lucide-react-native";
import { useCourseByIdQuery } from "../graphql";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDataContext } from "../context";
import { fonts, scaleDimension, theme } from "../utils";

type MyLearningProps = StackNavigationProp<RootStackParamList, "CourseDetails">;

const CourseDetails = () => {
  const navigation = useNavigation<MyLearningProps>();
  const route = useRoute<RouteProp<RootStackParamList, "CourseDetails">>();
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
    <Hero asset={asset}>
      <View style={styles.bannerArea}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft
            size={scaleDimension(36, true)}
            color={theme.text["text-primary"]}
          />
        </TouchableOpacity>
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
      <ChevronLeft
        size={scaleDimension(32, true)}
        color={theme.text["text-primary"]}
      />
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
              <Menu size={scaleDimension(32, true)} />
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
              <Button title={`View ${contentTypeLabel}`} onPress={() => null} />
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
    borderTopColor: theme.border["border-100"],
  },
  bannerArea: {
    flex: 1,
    padding: scaleDimension(20, true),
    justifyContent: "space-between",
    fontFamily: fonts.poppins.regular,
  },
  courseDetailsDescription: {
    flex: 6,
    padding: scaleDimension(30, true),
  },
  courseDetailsDescriptionTitle: {
    fontFamily: fonts.poppins.bold,
    marginBottom: scaleDimension(16, true),
  },
  courseDetailsNav: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: scaleDimension(20, true),
    marginTop: scaleDimension(30, false),
    marginBottom: scaleDimension(10, false),
  },
  courseDetailsNavButton: {
    fontSize: scaleDimension(16, true),
    fontFamily: fonts.poppins.regular,
  },
  button: {
    margin: scaleDimension(30, true),
  },
  buttonContainer: {
    flex: 1.5,
  },
  loader: {
    marginTop: scaleDimension(16, false),
    marginHorizontal: scaleDimension(30, true),
  },
  buttons: {
    backgroundColor: theme.interface["ui-quaternary"],
    height: scaleDimension(20, false),
    width: scaleDimension(45, true),
    borderRadius: scaleDimension(10, true),
    padding: 2,
    marginTop: scaleDimension(16, false),
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: scaleDimension(32, true),
    lineHeight: scaleDimension(18, false),
    fontFamily: fonts.poppins.bold,
    color: theme.text["text-100"],
  },
  title: {
    fontSize: scaleDimension(24, true),
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  courseTitle: {
    color: theme.brand["brand-primary"],
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    paddingHorizontal: scaleDimension(16, true),
  },
  body: {
    fontFamily: fonts.inter.regular,
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
  },
  row: {
    backgroundColor: theme.surface["surface-100"],
    paddingTop: scaleDimension(40, true),
    display: "flex",
    flexDirection: "row",
  },
  articleHeading: {
    borderTopWidth: 1,
    borderColor: theme.border["border-100"],
    backgroundColor: theme.surface["surface-100"],
    flexDirection: "row",
    alignItems: "center",
    padding: scaleDimension(20, true),
  },
});

export default CourseDetails;
