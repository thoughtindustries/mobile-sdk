import React, { useEffect, useState, FC } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Linking,
  Dimensions,
} from "react-native";
import _ from "lodash";
import { Button, ResourceControl, LoadingBanner, Hero } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, pageType } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import striptags from "striptags";
import WebView from "react-native-webview";
import { useCourseByIdQuery, usePagesQuery } from "../graphql";
import { TouchableOpacity } from "react-native-gesture-handler";

type MyLearningProps = StackNavigationProp<RootStackParamList, "MyLearning">;

const CourseDetails = () => {
  const navigation = useNavigation<MyLearningProps>();
  const route = useRoute();
  const { cid, asset } = route.params;
  const [variant, setVariant] = useState<number>(0);
  const [showPage, setShowPage] = useState<boolean>(false);
  const [showResources, setShowResources] = useState<boolean>(false);

  const { data: courseData, loading: courseDataLoading } = useCourseByIdQuery({
    variables: {
      id: cid,
    },
  });

  const { data: pageData, loading: pageDataLoading } = usePagesQuery({
    variables: {
      identifiers: ["52a124e9-b5c7-4068-925d-3d9908ef7d6f"],
    },
  });

  const CourseDetailsBanner: FC = () => (
    <Hero asset={courseData?.CourseById.courseGroup?.asset || asset}>
      <View style={styles.bannerArea}>
        <View style={styles.btns}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={36}
            color="#374151"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={styles.bannerTitle}>{courseData?.CourseById?.title}</Text>
      </View>
    </Hero>
  );

  const CourseDetailsDescription: FC = () => (
    <View
      style={{
        flex: 6,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={{ fontWeight: "700", marginBottom: 16 }}>
          About this Article
        </Text>
        <Text style={styles.body}>
          {courseData?.CourseById.courseGroup?.description}
        </Text>
      </ScrollView>
    </View>
  );

  const CourseDetailsNav: FC = () => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft: 20,
        marginTop: 60,
        marginBottom: 20,
      }}
      onPress={() => setShowPage(false)}
    >
      <MaterialCommunityIcons name="chevron-left" size={32} color="#374151" />
      <Text style={{ fontSize: 16, fontFamily: "Poppins_400Regular" }}>
        Back
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {courseDataLoading ? (
        <View style={styles.loader}>
          <LoadingBanner />
        </View>
      ) : showPage ? (
        <View>
          <CourseDetailsNav />
          <View style={styles.articleHeading}>
            <Text
              style={{
                color: "#3B1FA3",
                fontFamily: "Poppins_700Bold",
                padding: 20,
                backgroundColor: "#F3F4F6",
              }}
            >
              {courseData?.CourseById.title}
            </Text>
            {/* <View style={{ ...styles.row, paddingTop: 0 }}>
              <ResourceControl
                data={content}
                variant={variant}
                onChange={setVariant}
              />
              <Text style={styles.headingText}>
                {_.get(content, `languages[${variant}].label`, "Article Title")}
              </Text>
            </View>  */}
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CourseDetailsBanner />
          <View style={{ flex: 1.5 }}>
            <CourseDetailsDescription />
            <View style={{ borderTopWidth: 2, borderTopColor: "#E5E7EB" }} />
            <View style={styles.button}>
              <Button title="Read Article" onPress={() => setShowPage(true)} />
            </View>
          </View>
          {/* {fullBody && (
            <>
              <View style={styles.row}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={36}
                  color="#374151"
                  onPress={() => setFullBody(false)}
                />
                <Text style={styles.backBtn} onPress={() => setFullBody(false)}>
                  Back
                </Text>
              </View>

              <View style={styles.articleHeading}>
                <View style={{ ...styles.row, paddingTop: 0 }}>
                  <ResourceControl
                    data={content}
                    variant={variant}
                    onChange={setVariant}
                  />
                  <Text style={styles.headingText}>
                    {_.get(
                      content,
                      `languages[${variant}].label`,
                      "Article Title"
                    )}
                  </Text>
                </View>
              </View>
            </>
          )}
          {fullBody && (
            <View style={{ padding: 20 }}>
              {_.get(route, "params.contentTypeLabel", "Article") ==
                "Article" && (
                <Text style={styles.articleDetails}>
                  {striptags(_.get(content, `languages[${variant}].body`, ""))}
                </Text>
              )}
              {_.get(route, "params.contentTypeLabel", "Video") == "Video" &&
                _.get(content, "videoAsset", "na") !== "na" && (
                  <>
                    <Text style={styles.title}>
                      {_.get(
                        content,
                        `languages[${variant}].title`,
                        "Article Title"
                      )}
                    </Text>
                    <Text style={styles.subtitle}>
                      {_.get(
                        content,
                        `languages[${variant}].subtitle`,
                        "Article Title"
                      )}
                    </Text>
                    <WebView
                      source={{
                        uri: `https://fast.wistia.com/embed/medias/${content.videoAsset}`,
                      }}
                      style={{ marginTop: 20, height: 200 }}
                    />

                    <Text style={styles.articleDetails}>
                      {_.truncate(
                        striptags(
                          _.get(content, `languages[${variant}].body`, "")
                        ),
                        {
                          length: 120,
                        }
                      )}
                    </Text>

                    {_.get(
                      content,
                      `languages[${variant}].externalUrlCallToAction`,
                      ""
                    ) !== "" && (
                      <Button
                        title="View More"
                        onPress={() =>
                          Linking.openURL(
                            _.get(
                              content,
                              `languages[${variant}].externalUrlCallToAction`,
                              ""
                            )
                          )
                        }
                      />
                    )}

                    <Text style={styles.articleDetails}>
                      {_.truncate(
                        striptags(
                          _.get(content, `languages[${variant}].copyright`, "")
                        ),
                        {
                          length: 100,
                        }
                      )}
                    </Text>
                  </>
                )}
            </View>
          )} */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerArea: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    margin: 30,
    flex: 1,
  },
  content: {
    padding: 30,
  },
  loader: {
    marginTop: 30,
    marginHorizontal: 30,
  },
  btns: {
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
  articleDetails: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 16,
  },
  backBtn: {
    paddingTop: 7,
    marginLeft: 0,
  },
  articleHeading: {
    borderTopWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  headingText: {
    color: "#3B1FA3",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
  },
  searching: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: "#3B1FA3",
    borderRadius: 10,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  searchingText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Poppins_700Bold",
    padding: 20,
  },
});

export default CourseDetails;
