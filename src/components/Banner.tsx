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

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Banner = () => {
  const { recentContent, catalogData } = useDataContext();
  const navigation = useNavigation<HomeScreenProps>();

  const showSummary = (
    description: string | undefined,
    length: number
  ): string | undefined => {
    const words = description?.split(" ");
    const truncatedWords = words?.splice(0, length);
    const summary = truncatedWords?.join(" ");
    return summary;
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: recentContent?.[0]?.id || catalogData?.[0]?.id || "",
            from: "Home",
          })
        }
      >
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{
              uri: recentContent?.[0]?.asset || catalogData?.[0]?.asset,
            }}
            resizeMode="cover"
            imageStyle={styles.image}
          >
            <View style={styles.bannerArea}>
              <Text style={styles.bannerTitle}>
                {recentContent?.[0]?.title || catalogData?.[0]?.title}
              </Text>
              <Text style={styles.bannerText}>
                {`${showSummary(
                  recentContent?.[0]?.description ||
                    catalogData?.[0]?.description,
                  12
                )}...`}
              </Text>
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
