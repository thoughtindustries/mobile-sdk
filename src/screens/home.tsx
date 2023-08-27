import React from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  View,
} from "react-native";
import {
  UserHeader,
  Banner,
  TopCategories,
  Recommendation,
  RecentCourses,
  Offline,
} from "../components";
import { scaleDimension } from "../utils";
import { useDataContext } from "../context";

const Home = () => {
  const { isConnected } = useDataContext();
  return (
    <SafeAreaView>
      <UserHeader />
      {!isConnected ? (
        <View
          style={{
            height:
              Dimensions.get("window").height - scaleDimension(170, false),
            justifyContent: "center",
          }}
        >
          <Offline />
        </View>
      ) : (
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
          <Banner />
          <TopCategories />
          <Recommendation />
          <RecentCourses />
        </ScrollView>
      )}
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
