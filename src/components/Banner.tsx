import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import _ from "lodash";
import striptags from "striptags";
import tiGql from "../helpers/TIGraphQL";
import { userRecentContentType } from "../../types";

const Banner = () => {
  const [featured, setFeatured] = useState<userRecentContentType[]>([]);

  const fetchFeaturedCourses = () => {
    tiGql.fetchRecentCourses(1).then(setFeatured);
  };

  useEffect(fetchFeaturedCourses, []);

  return (
    <View style={styles.bannerContainer}>
      <ImageBackground
        source={{ uri: _.get(featured, "0.asset", "") }}
        resizeMode="cover"
        imageStyle={{ borderRadius: 8 }}
      >
        <View style={styles.bannerArea}>
          <Text style={styles.bannerTitle}>
            {_.get(featured, "0.title", "")}
          </Text>
          <Text style={styles.bannerText}>
            {_.truncate(striptags(_.get(featured, "0.description", "")), {
              length: 70,
            })}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

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
