import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import {
  UserHeader,
  Banner,
  TopCategories,
  Recommendation,
  RecentCourses,
} from "../components";

const Home = () => {
  return (
    <ScrollView
      style={styles.page}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
    >
      <UserHeader />
      <Banner />
      <TopCategories />
      <Recommendation />
      <RecentCourses />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Home;
