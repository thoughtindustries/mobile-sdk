import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Dimensions,
} from "react-native";
import _ from "lodash";
import striptags from "striptags";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import {
  useUserRecentContentQuery,
  useCatalogContentQuery,
  GlobalTypes,
} from "../graphql";

type HomeScreenProps = StackNavigationProp<RootStackParamList, "Home">;

const Banner = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const { data: recentContentData } = useUserRecentContentQuery({
    variables: { limit: 1 },
  });

  const { data: catalogData } = useCatalogContentQuery({
    variables: {
      sortColumn: GlobalTypes.SortColumn.Title,
      sortDirection: GlobalTypes.SortDirection.Asc,
      page: 1,
      labels: [],
      values: [],
      contentTypes: "Course",
    },
  });

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("ContentDetails", {
            cid:
              recentContentData?.UserRecentContent[0]?.id ||
              catalogData?.CatalogContent?.contentItems?.[0]?.id ||
              "",
            from: "Home",
          })
        }
      >
        <View style={styles.bannerContainer}>
          <ImageBackground
            source={{
              uri:
                recentContentData?.UserRecentContent[0]?.asset ||
                catalogData?.CatalogContent?.contentItems?.[0]?.asset,
            }}
            resizeMode="cover"
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.bannerArea}>
              <Text style={styles.bannerTitle}>
                {recentContentData?.UserRecentContent[0]?.title ||
                  catalogData?.CatalogContent?.contentItems?.[0].title}
              </Text>
              <Text style={styles.bannerText}>
                {_.truncate(
                  striptags(
                    recentContentData?.UserRecentContent[0]?.description || ""
                  ),
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
});

export default Banner;
