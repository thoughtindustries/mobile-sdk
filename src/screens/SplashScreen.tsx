import React, { useEffect } from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Loader } from "../components";
import dbObj from "../helpers/Db";
import Utils from "../helpers/Utils";

interface Props {
  navigation: any;
}

const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    dbObj.init().then(() => console.log("Database initiated..."));
    setTimeout(() => Utils.checkLogin(navigation), 5000);
  }, []);

  return (
    <View style={styles.container}>
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
  container: {
    flex: 1,
  },
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
