import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Link } from "../components";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type TopCategoriesProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

const TopCategories = () => {
  const navigation = useNavigation<TopCategoriesProps>();
  const categories: string[] = [
    "Partner",
    "Enablement",
    "News",
    "Release",
    "Sales Enablement",
  ];

  return (
    <View>
      <View style={styles.topCatBox}>
        <Text style={styles.heading}>Top Categories</Text>
        <Link
          title="See All"
          onPress={() => navigation.navigate("TopCategories")}
        />
      </View>
      <ScrollView
        horizontal={true}
        style={styles.catContainer}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.catBox}>
            <Text style={styles.catTitle}>{cat}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topCatBox: {
    marginTop: (Dimensions.get("window").height / 440) * 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    marginTop: 15,
    fontSize: (Dimensions.get("window").width / 400) * 16,
    lineHeight: 24,
    fontFamily: "Poppins_700Bold",
    color: "#000",
  },
  catContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
  },
  catTitle: {
    color: "#1f2937",
    fontWeight: "400",
    fontSize: (Dimensions.get("window").width / 440) * 16,
    lineHeight: 24,
    paddingVertical: (Dimensions.get("window").width / 440) * 14,
    paddingHorizontal: (Dimensions.get("window").width / 440) * 14,
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
});

export default TopCategories;
