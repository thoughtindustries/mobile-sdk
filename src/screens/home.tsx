import React from "react";
import { StyleSheet, ScrollView, Dimensions, SafeAreaView } from "react-native";
import {
  UserHeader,
  Banner,
  TopCategories,
  Recommendation,
  RecentCourses,
} from "../components";
import { scaleDimension } from "../utils";

const Home = () => {
  return (
    <SafeAreaView>
      <UserHeader />
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        <Banner />
        <TopCategories />
        <Recommendation />
        <RecentCourses />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    marginHorizontal: scaleDimension(30, true),
    height: Dimensions.get("window").height - scaleDimension(110, false),
  },
});

export default Home;
