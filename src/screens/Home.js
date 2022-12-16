import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { UserHeader, Link } from "../components";
import _ from "lodash";

const Home = (props) => {
  const categories = [
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Category 5",
  ];

  let bannerText =
    "You need a way to manage your customer relationships, and contacts. You will learn how to build a customized database that will allow you to document and store customer data, look up prior orders, and generate reports such as product price lists, order totals and customer satisfaction.";
  bannerText = _.truncate(bannerText, { length: 70 });

  const Banner = () => (
    <View style={style.bannerContainer}>
      <ImageBackground
        source={require("../../assets/dashboard-banner.png")}
        resizeMode="cover"
      >
        <View style={style.bannerArea}>
          <Text style={style.bannerTitle}>Become a Master: </Text>
          <Text style={style.bannerTitle}>Sales Database</Text>
          <Text style={style.bannerText}>{bannerText}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  const TopCategories = () => {
    return (
      <View>
        <View style={style.topCatBox}>
          <Text style={style.heading}>Top Categories</Text>
          <Link
            title="See All"
            onPress={() => props.navigation.navigate("Top Categories")}
          />
        </View>
        <ScrollView horizontal={true} style={style.catContainer}>
          {categories.map((cat, idx) => (
            <View key={idx} style={style.catBox}>
              <Text style={style.catTitle}>{cat}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={style.page}>
      <UserHeader />
      <Banner />
      <TopCategories />
    </View>
  );
};

const style = StyleSheet.create({
  page: {
    margin: 20,
  },

  bannerContainer: {
    borderRadius: 10,
  },

  bannerArea: {
    height: 282,
    padding: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins-Light",
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

  catBox: {
    backgroundColor: "#f9fafv",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#d1d5db",
    borderRadius: 8,
    width: 104,
    alignItems: "center",
    margin: 4,
  },

  catTitle: {
    color: "#1f2937",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 50,
  },
});

export default Home;
