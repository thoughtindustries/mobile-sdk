import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Link } from ".";
import { fonts, scaleDimension, theme } from "../utils";

const TopCategories = () => {
  const categories: string[] = [
    "Partner",
    "Enablement",
    "News",
    "Release",
    "Sales Enablement",
  ];

  return (
    <View>
      <View style={styles.heading}>
        <Text style={styles.title}>Top Categories</Text>
        <Link title="See All" onPress={() => null} />
      </View>
      <ScrollView
        horizontal={true}
        style={styles.container}
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.category}>{category}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginTop: scaleDimension(8, false),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    marginTop: scaleDimension(16, true),
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    fontFamily: fonts.poppins.bold,
    color: theme.text["text-primary"],
  },
  container: {
    display: "flex",
    flexDirection: "row",
    marginLeft: scaleDimension(-2, true),
  },
  category: {
    color: theme.text["text-primary"],
    fontFamily: fonts.inter.regular,
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    paddingVertical: scaleDimension(14, true),
    paddingHorizontal: scaleDimension(14, true),
  },
  card: {
    backgroundColor: theme.surface["surface-200"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.border["border-200"],
    borderRadius: scaleDimension(8, true),
    alignItems: "center",
    minWidth: scaleDimension(120, true),
    margin: scaleDimension(4, true),
  },
});

export default TopCategories;
