import React from "react";
import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import {
  UserHeader,
  Banner,
  TopCategories,
  Recommendation,
  RecentCourses,
} from "../components";

const Home = () => {
  return (
    <View>
      <UserHeader />
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        <Banner />
        <TopCategories />
        <Recommendation />
        <RecentCourses />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    marginHorizontal: 30,
    height: Dimensions.get("window").height - 220,
    Width:"100%"
  },
});

export default Home;
