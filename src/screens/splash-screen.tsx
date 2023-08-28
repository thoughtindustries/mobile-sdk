import React, { useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Loader } from "../components";
import AppStyle from "../../AppStyle";
import * as SecureStore from "expo-secure-store";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    (async () => {
      const user = await SecureStore.getItemAsync("userInfo");
      const timer = setTimeout(() => {
        user
          ? navigation.navigate("HomeScreen")
          : navigation.navigate("Onboarding");
      }, 3000);

      return () => clearTimeout(timer);
    })();
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
