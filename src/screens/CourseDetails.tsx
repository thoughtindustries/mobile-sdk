import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from "react-native";
import _ from "lodash";
import { Button } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, topicType } from "../../types";
import tiGql from "../helpers/TIGraphQL";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import striptags from "striptags";

type MyLearningProps = StackNavigationProp<RootStackParamList, "MyLearning">;

const CourseDetails = () => {
  const navigation = useNavigation<MyLearningProps>();
  const route = useRoute();
  const [content, setContent] = useState<topicType[]>([]);
  const [fullBody, setFullBody] = useState<Boolean>(false);
  let cid = _.get(route, "params.cid", "");

  const fetchCourseDetails = () => {
    tiGql.fetchCourseDetails(cid).then(setContent).catch(console.log);
  };

  useEffect(fetchCourseDetails, [cid]);

  const ctaLabel = {
    Article: "Read Article",
    Video: "Open Video",
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
      {!fullBody && (
        <ImageBackground
          source={{ uri: _.get(route, "params.asset", "") }}
          resizeMode="cover"
        >
          <View style={styles.bannerArea}>
            <View style={styles.btns}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={36}
                color="#374151"
                onPress={() => navigation.navigate("My Learning")}
              />
            </View>
            <Text style={styles.bannerTitle}>
              {_.get(route, "params.title", "")}
            </Text>
          </View>
        </ImageBackground>
      )}
      {!fullBody && (
        <>
          <View style={{ padding: 32 }}>
            <Text style={styles.body}>
              {_.truncate(striptags(_.get(content, "body", "")), {
                length: 200,
              })}
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
        </>
      )}
      {fullBody && (
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
            <Text style={styles.headingText}>
              {_.get(route, "params.title", "Article Title")}
            </Text>
          </View>
        </>
      )}
      {fullBody && (
        <View style={{ padding: 20 }}>
          {_.get(route, "params.contentTypeLabel", "Article") == "Article" && (
            <Text style={styles.articleDetails}>
              {striptags(_.get(content, "body", ""))}
            </Text>
          )}
          {_.get(route, "params.contentTypeLabel", "Video") == "Video" && (
            <Text style={styles.articleDetails}>{JSON.stringify(content)}</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {},

  bannerArea: {
    padding: 20,
    paddingBottom: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
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
});

export default CourseDetails;
