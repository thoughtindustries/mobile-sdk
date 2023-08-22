import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import { UserDetailType } from "../../types";
import * as SecureStore from "expo-secure-store";

const UserHeader = () => {
  const [userInfo, setUserInfo] = useState<UserDetailType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    asset: "",
    roleKey: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    telephone: "",
    externalCustomerId: "",
    lang: "",
    ref1: "",
    ref2: "",
    ref3: "",
    ref4: "",
    ref5: "",
    ref6: "",
    ref7: "",
    ref8: "",
    ref9: "",
    ref10: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const info = await SecureStore.getItemAsync("userInfo");
        if (info) {
          setUserInfo(JSON.parse(info));
        }
      } catch (error) {
        console.log("Fetch user info error: ", error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {userInfo.asset === null || userInfo.asset === "" ? (
        <Image
          source={require("../../assets/profile.png")}
          style={{ height: 40, width: 40 }}
        />
      ) : (
        <Image source={{ uri: userInfo.asset }} style={styles.profilePic} />
      )}
      <Text style={styles.name}>
        {`Hi, ${userInfo.firstName} ${userInfo.lastName}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingTop: 60,
    paddingBottom: 20,
    marginHorizontal: 30,
  },

  name: {
    margin: 5,
    fontFamily: "Poppins_700Bold",
    fontSize: (Dimensions.get("window").width / 440) * 20,
    lineHeight: 30,
  },
  profilePic: {
    width: (Dimensions.get("window").width / 440) * 40,
    height: (Dimensions.get("window").width / 440) * 40,
    marginRight: (Dimensions.get("window").width / 440) * 10,
    borderRadius: 9999,
  },
});

export default UserHeader;
