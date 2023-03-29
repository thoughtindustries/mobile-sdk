import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { UserHeader, Banner, TopCategories, Recommendation, RecentCourses } from "../components";

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

import GestureRecognizer from "react-native-swipe-gestures";

const Home = () => {
  type HomeScreenProps = StackNavigationProp<RootStackParamList, "HomeScreen">;
  const navigation = useNavigation<HomeScreenProps>();

  const onSwipe = (gestureName: string) => {
    //console.log("swipped", gestureName);
    switch (gestureName) {
      case "SWIPE_LEFT":
        navigation.navigate("Explore");
        break;
    }
  };

  return (
    <GestureRecognizer onSwipe={onSwipe}>
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
        <UserHeader />
        <Banner />
        <TopCategories />
        <Recommendation />
        <RecentCourses />
      </ScrollView>
    </GestureRecognizer>
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
