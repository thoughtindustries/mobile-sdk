import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import _ from "lodash";
import striptags from "striptags";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { useUserRecentContentQuery } from "../graphql";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Banner = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const { data, loading, error } = useUserRecentContentQuery({
    variables: { limit: 1 },
  });

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid: data?.UserRecentContent[0].id,
            from: "Home",
          })
        }
      >
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{ uri: data?.UserRecentContent[0].asset }}
            resizeMode="cover"
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.bannerArea}>
              <Text style={styles.bannerTitle}>
                {data?.UserRecentContent[0].title}
              </Text>
              <Text style={styles.bannerText}>
                {_.truncate(
                  striptags(data?.UserRecentContent[0].description || ""),
                  {
                    length: 70,
                  }
                )}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </Pressable>
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
