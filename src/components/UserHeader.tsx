import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet, Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";

interface UserDetailProps {
  firstName: string;
  lastName: string;
  asset: string;
}

const UserHeader = () => {
  const [userInfo, setUserInfo] = useState<UserDetailProps>({
    firstName: "",
    lastName: "",
    asset: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await SecureStore.getItemAsync("userInfo");
        if (info) {
          setUserInfo(JSON.parse(info));
        }
      } catch (error) {
        console.log("Fetch user info error: ", error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      {userInfo.asset === null || userInfo.asset === "" ? (
        <Image source={require("../../assets/user.png")} />
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
    paddingTop: 50,
    paddingBottom: 20,
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
