import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { UserHeader, Link } from "../components";
import { truncate } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import tiGql from "../helpers/TIGraphQL";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Home = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const [categories, setCategories] = React.useState<string[]>([]);

  const fetchTopCategories = () => {
    tiGql.getTopCategories().then(setCategories).catch(console.log);
  };

  React.useEffect(fetchTopCategories, []);

  const recommendedCourse: { thumbnail: string; coursename: string }[] = [
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name1",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
    {
      thumbnail: "https://loremflickr.com/640/360",
      coursename: "Course Name2",
    },
  ];

  let bannerText: string =
    "You need a way to manage your customer relationships, and contacts. You will learn how to build a customized database that will allow you to document and store customer data, look up prior orders, and generate reports such as product price lists, order totals and customer satisfaction.";
  bannerText = truncate(bannerText, { length: 70 });

  const Banner = () => (
    <View style={styles.bannerContainer}>
      <ImageBackground
        source={require("../../assets/dashboard-banner.png")}
        resizeMode="cover"
      >
        <View style={styles.bannerArea}>
          <Text style={styles.bannerTitle}>Become a Master: </Text>
          <Text style={styles.bannerTitle}>Sales Database</Text>
          <Text style={styles.bannerText}>{bannerText}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const TopCategories = () => {
    return (
      <View>
        <View style={styles.topCatBox}>
          <Text style={styles.heading}>Top Categories</Text>
          <Link
            title="See All"
            onPress={() => navigation.navigate("TopCategories")}
          />
        </View>
        <ScrollView horizontal={true} style={styles.catContainer}>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.catBox}>
              <Text style={styles.catTitle}>{cat}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const Recommendation = () => {
    return (
      <View>
        <View style={styles.courseBox}>
          <Text style={styles.heading}>Recommendation</Text>
        </View>
        <ScrollView horizontal={true} style={styles.courseContainer}>
          {recommendedCourse.map((course, idx) => (
            <View style={styles.recContentBox}>
              <ImageBackground
                key={idx}
                source={{ uri: course.thumbnail }}
                resizeMode="cover"
              >
                <View style={styles.bannerArea}>
                  <Text style={styles.courseTitle}>{course.coursename}</Text>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <UserHeader />
      <Banner />
      <TopCategories />
      <Recommendation />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },

  bannerContainer: {
    borderRadius: 10,
  },

  bannerArea: {
    height: 282,
    padding: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },

  bannerTitle: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: "700",
    color: "#fff",
  },

  bannerText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: "#ccc",
  },

  topCatBox: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  heading: {
    marginTop: 15,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: "#000",
  },

  catContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },

  courseContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },

  catBox: {
    backgroundColor: "#f9fafv",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: 8,
    alignItems: "center",
    minWidth: 104,
    margin: 4,
  },

  courseBox: {
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  recContentBox: {
    backgroundColor: "#f9fafv",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: 8,
    width: 260,
    height: 280,
    margin: 12,
  },

  catTitle: {
    color: "#1f2937",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 24,
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 5,
    paddingRight: 5,
  },
  courseTitle: {
    color: "#1f2937",
    fontWeight: "400",
    fontSize: 14,
    justifyContent: "flex-start",
    lineHeight: 50,
  },
});

export default Home;
