import { useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { Loader } from "../components";
import * as SecureStore from "expo-secure-store";

const SplashScreen = ({ navigation }: any) => {
  const { height } = useWindowDimensions();
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
    <View style={[styles.container, { height }]}>
      <ImageBackground
        source={require("../../assets/splash.png")}
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
  container: {
    backgroundColor: "#3B1FA3",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default SplashScreen;
