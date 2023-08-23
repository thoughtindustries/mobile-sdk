import React from "react";
import { StyleSheet, ScrollView, Dimensions, SafeAreaView } from "react-native";
import {
  UserHeader,
  Banner,
  TopCategories,
  Recommendation,
  RecentCourses,
} from "../components";

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
    marginHorizontal: 30,
    height: Dimensions.get("window").height - 220,
  },
});

export default Home;
