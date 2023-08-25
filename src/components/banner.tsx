import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Screens } from "../../types";
import { useDataContext } from "../context";
import {
  truncateString,
  placeHolderImage,
  scaleDimension,
  theme,
  fonts,
} from "../utils";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Banner = () => {
  const { recentContent, contentData, catalogData } = useDataContext();
  const navigation = useNavigation<HomeScreenProps>();
  const content = recentContent?.[0]?.id
    ? recentContent
    : contentData?.[0]?.id
    ? contentData
    : catalogData;

  const handleBannerPress = () => {
    const cid = content?.[0]?.id || "";
    navigation.navigate(Screens.ContentDetails, { cid, from: Screens.Home });
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleBannerPress()}>
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={
              content?.[0].asset
                ? {
                    uri: content?.[0].asset,
                  }
                : placeHolderImage
            }
            resizeMode="cover"
            imageStyle={styles.image}
          >
            <View style={styles.bannerArea}>
              <Text style={styles.bannerTitle}>{content?.[0].title}</Text>
              {content?.[0].description && (
                <Text style={styles.bannerText}>
                  {truncateString(content[0].description, 30)}
                </Text>
              )}
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: scaleDimension(10, false),
  },
  bannerArea: {
    paddingTop: scaleDimension(100, false),
    padding: scaleDimension(20, false),
    justifyContent: "flex-end",
    fontFamily: fonts.poppins.regular,
  },
  bannerTitle: {
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(24, false),
    fontFamily: fonts.poppins.bold,
    color: theme.text["text-inverse"],
  },
  bannerText: {
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    fontFamily: fonts.poppins.regular,
    color: theme.text["text-inverse"],
  },
  image: {
    borderRadius: scaleDimension(8, true),
  },
});

export default Banner;
