import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { useDataContext } from "../context";
import { placeHolderimage } from "../helpers";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Banner = () => {
  const { recentContent, contentData, catalogData } = useDataContext();
  const navigation = useNavigation<HomeScreenProps>();
  const content = recentContent?.[0]?.id
    ? recentContent
    : contentData?.[0]?.id
    ? contentData
    : catalogData;

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: content?.[0]?.id || "",
            from: "Home",
          })
        }
      >
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={
              content?.[0].asset
                ? {
                    uri: content?.[0].asset,
                  }
                : placeHolderimage
            }
            resizeMode="cover"
            imageStyle={styles.image}
          >
            <View style={styles.bannerArea}>
              <Text style={styles.bannerTitle}>{content?.[0].title}</Text>
              <Text style={styles.bannerText}>{content?.[0].description}</Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 10,
  },
  bannerArea: {
    paddingTop:
      Dimensions.get("window").height < 667
        ? (Dimensions.get("window").height / 440) * 50
        : (Dimensions.get("window").height / 440) * 100,
    padding: 32,
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  bannerTitle: {
    fontSize: (Dimensions.get("window").width / 440) * 24,
    lineHeight: 36,
    fontFamily: "Poppins_700Bold",
    color: "#fff",
  },
  bannerText: {
    fontSize: (Dimensions.get("window").width / 440) * 16,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
    color: "#ccc",
  },
  image: {
    borderRadius: 8,
  },
});

export default Banner;
