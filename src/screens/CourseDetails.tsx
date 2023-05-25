import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Linking,
} from "react-native";
import _ from "lodash";
import { Button, ResourceControl, LoadingBanner } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, pageType } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import striptags from "striptags";
import WebView from "react-native-webview";
import { useCourseByIdQuery } from "../graphql";

type MyLearningProps = StackNavigationProp<RootStackParamList, "MyLearning">;

const CourseDetails = () => {
  const navigation = useNavigation<MyLearningProps>();
  const route = useRoute();
  const { cid, asset } = route.params;
  const [variant, setVariant] = useState<number>(0);
  const [fullBody, setFullBody] = useState<Boolean>(false);
  const [showResources, setShowResources] = useState<Boolean>(false);

  const { data, loading } = useCourseByIdQuery({
    variables: {
      id: cid,
    },
  });

  return (
    <View>
      {loading ? (
        <View style={styles.loader}>
          <LoadingBanner />
        </View>
      ) : (
        <View>
          {!fullBody && (
            <View>
              <ImageBackground
                source={{ uri: data?.CourseById.courseGroup?.asset || asset }}
                resizeMode="cover"
              >
                <View style={styles.bannerArea}>
                  <View style={styles.btns}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={36}
                      color="#374151"
                      onPress={() => navigation.goBack()}
                    />
                  </View>
                  <Text style={styles.bannerTitle}>
                    {data?.CourseById?.title}
                  </Text>
                </View>
              </ImageBackground>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.content}
              >
                <Text style={styles.body}>
                  {/* {_.truncate(
                    striptags(_.get(content, "languages[0].body", "")),
                    {
                      length: 500,
                    }
                  )} */}
                  BOOM
                </Text>
                <View style={styles.button}>
                  <Button
                    title="Read Article"
                    onPress={() => setFullBody(true)}
                  />
                </View>
              </ScrollView>
            </View>
          )}
          {/* {!fullBody && (
            <View>
              <View style={{ padding: 32 }}>
                <Text style={styles.body}>
                  {_.truncate(
                    striptags(_.get(content, "languages[0].body", "")),
                    {
                      length: 500,
                    }
                  )}
                </Text>
                <Button
                  title={_.get(
                    ctaLabel,
                    _.get(route, "params.contentTypeLabel", "abc"),
                    "Read Details"
                  )}
                  onPress={() => setFullBody(true)}
                />
              </View>
            </View>
          )} */}
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
    padding: 20,
    paddingBottom: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  button: {
    position: "absolute",
    bottom: 0,
    zIndex: 30,
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
    marginBottom: 180,
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
    borderTopWidth: 1,
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
