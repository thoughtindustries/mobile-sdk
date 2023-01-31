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

  const fetchCourseDetails = () => {
    tiGql
      .fetchCourseDetails(_.get(route, "params.cid", ""))
      .then(setContent)
      .catch(console.log);
  };

  useEffect(fetchCourseDetails, []);

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
                length: 475,
              })}
            </Text>
            <Button title="Read Article" onPress={() => setFullBody(true)} />
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
            <Text>Back</Text>
          </View>

          <View>
            <Text>{_.get(content, "label", "Article Title")}</Text>
          </View>
        </>
      )}
      {fullBody && (
        <View style={{ padding: 20 }}>
          <Text>{striptags(_.get(content, "body", ""))}</Text>
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
});

export default CourseDetails;
