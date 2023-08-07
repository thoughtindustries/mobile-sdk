import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
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
  const {height, width} = useWindowDimensions();
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
            resizeMode="contain"
            imageStyle={styles.image}
          >
            <View style={styles.bannerArea}>
              <View style={styles.bannerBlock}>
                <Text style={styles.bannerTitle}>{content?.[0].title}</Text>
                <Text style={styles.bannerText}>{content?.[0].description}</Text>
              </View>
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
    justifyContent: "flex-end",
    fontFamily: "Poppins_400Regular",
  },
  bannerBlock:{
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    marginTop: -80,
    padding:15,

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
    color:"#ffffff",
    
  },
  image: {
    borderRadius: 8,
    justifyContent: 'center',
    flex:1,
    alignItems: 'center',
    width: "100%",
    height:"auto",
    resizeMode:"contain"
    
  },
});

export default Banner;
