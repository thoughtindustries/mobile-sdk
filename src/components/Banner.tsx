import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { truncate } from "lodash";

let bannerText: string =
  "You need a way to manage your customer relationships, and contacts. You will learn how to build a customized database that will allow you to document and store customer data, look up prior orders, and generate reports such as product price lists, order totals and customer satisfaction.";
bannerText = truncate(bannerText, { length: 70 });

const Banner = () => (
  <View style={styles.bannerContainer}>
    <ImageBackground
      source={require("../../assets/dashboard-banner.png")}
      resizeMode="cover"
      imageStyle={{ borderRadius: 8 }}
    >
      <View style={styles.bannerArea}>
        <Text style={styles.bannerTitle}>Become a Master: </Text>
        <Text style={styles.bannerTitle}>Sales Database</Text>
        <Text style={styles.bannerText}>{bannerText}</Text>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
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
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  bannerText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
    color: "#ccc",
  },
});

export default Banner;
