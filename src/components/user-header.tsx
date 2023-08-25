import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import { UserDetailType } from "../../types";
import * as SecureStore from "expo-secure-store";
import { fonts, scaleDimension, theme } from "../utils";

const UserHeader = () => {
  const [userInfo, setUserInfo] = useState<UserDetailType>();

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
      {userInfo?.asset === null || userInfo?.asset === "" ? (
        <Image
          source={require("../../assets/profile.png")}
          style={styles.profilePic}
        />
      ) : (
        <Image source={{ uri: userInfo?.asset }} style={styles.profilePic} />
      )}
      <Text style={styles.name}>
        {`Hi, ${userInfo?.firstName} ${userInfo?.lastName}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.surface["surface-primary"],
    paddingBottom: scaleDimension(10, false),
    marginHorizontal: scaleDimension(32, true),
  },
  name: {
    margin: scaleDimension(5, true),
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(16, false),
  },
  profilePic: {
    width: scaleDimension(50, true),
    height: scaleDimension(50, true),
    marginRight: scaleDimension(10, true),
    borderRadius: 9999,
  },
});

export default UserHeader;
