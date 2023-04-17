import React, { useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Loader } from "../components";
import dbObj from "../helpers/Db";
import AppStyle from "../../AppStyle";
import * as SecureStore from "expo-secure-store";

interface Props {
  navigation: any;
}

const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    dbObj.init().then(() => console.log("Database initiated..."));
    setTimeout(async () => {
      const response = await SecureStore.getItemAsync("userInfo");
      response
        ? navigation.navigate("HomeScreen")
        : navigation.navigate("Onboarding");
    }, 5000);
  }, []);

  return (
    <View style={{ ...AppStyle.container, backgroundColor: "#3B1FA3" }}>
      <ImageBackground
        source={require("../../assets/start-screen.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.loader}>
          <Loader size={50} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    lineHeight: 4,
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default SplashScreen;
