import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,

} from "react-native";
import _ from "lodash";
import { Button, ResourceControl } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, pageType } from "../../types";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const ExploreCourse = () => {

  const [fullBody, setFullBody] = useState<Boolean>(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>

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
            <View style={{ ...styles.row, paddingTop: 0 }}>
              <Text style={styles.headingText}>
               This is lesson content
              </Text>
            </View>
          </View>
        </>
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
});

export default ExploreCourse;
