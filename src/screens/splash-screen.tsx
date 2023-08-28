import { useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Loader } from "../components";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";
import { useDataContext } from "../context";

const SplashScreen = ({ navigation }: any) => {
  const { setIsConnected } = useDataContext();
  useEffect(() => {
    (async () => {
      const { isInternetReachable, isConnected } =
        await Network.getNetworkStateAsync();
      setIsConnected(isInternetReachable);
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
    <ImageBackground
      source={require("../../assets/splash.png")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.loader}>
        <Loader size={50} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    textAlign: "center",
    alignItems: "center",
  },
});

export default SplashScreen;
