import React, { useState, useEffect } from "react";
import { View, Text, Linking, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TI_API_INSTANCE } from "@env";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../../types";
import Utils from "../helpers/Utils";
import _ from "lodash";

import GestureRecognizer from "react-native-swipe-gestures";

type AccountScreenProps = StackNavigationProp<RootStackParamList, "Account">;

const Account = () => {
  const navigation = useNavigation<AccountScreenProps>();

  const onSwipe = (gestureName: string) => {
    switch (gestureName) {
      case "SWIPE_RIGHT":
        navigation.navigate("My Learning");
        break;
    }
  };

  const [udata, setUdata] = useState<boolean>(false);

  useEffect(() => {
    Utils.fetch("udata").then(setUdata);
  }, []);

  const profilePic = _.get(udata, "asset", "");

  return (
    <GestureRecognizer onSwipe={onSwipe} style={styles.container}>
      <View style={styles.accountInfo}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.profileInfo}>
          {_.isEmpty(profilePic) && <Image source={require("../../assets/profile.png")} />}
          {!_.isEmpty(profilePic) && <Image source={{ uri: profilePic }} style={styles.profileImage} />}

          <Text style={styles.subtitle}>
            {_.get(udata, "firstName", "")} {_.get(udata, "lastName", "")}
          </Text>
          <Text style={styles.userEmail}>{_.get(udata, "email", "")}</Text>

          <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")}>
            <Text style={styles.profileEdit}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>Settings</Text>

        <TouchableOpacity onPress={() => Linking.openURL(`${TI_API_INSTANCE}/learn/forgot`)}>
          <View style={styles.resetBtn}>
            <MaterialCommunityIcons name={"eye-off-outline"} size={22} color="#3B1FA3" style={styles.eyeIcon} />
            <Text style={styles.resetField}>Reset Password</Text>
            <MaterialCommunityIcons style={styles.settingIcon} name={"chevron-right"} size={25} color="#232323" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Utils.logMeOut(navigation)}>
          <Text style={styles.profileEdit}>Log out</Text>
        </TouchableOpacity>
      </View>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
  },
  accountInfo: {
    marginTop: 10,
    marginBottom: 90,
    padding: 32,
    flex: 1,
    width: "100%",
  },
  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  settingInfo: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 24,
    alignItems: "flex-start",
  },
  resetBtn: {
    borderRadius: 8,
    paddingTop: 16,
    paddingLeft: 15,
    paddingRight: 15,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F5F5F7",
    height: 50,
    width: "100%",
  },
  eyeIcon: {
    width: 22,
    marginTop: -1,
  },
  resetField: {
    paddingLeft: 10,
    flexGrow: 1,
    textAlign: "left",
  },
  settingIcon: {
    width: 22,
    marginTop: -3,
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
  },
  profileImage: {
    marginTop: 10,
    marginBottom: 20,
    width: 132,
    height: 132,
    borderRadius: 132,
  },
  subtitle: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  userEmail: {
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 16,
    color: "#6B7280",
    fontFamily: "Poppins_400Regular",
  },
  profileEdit: {
    color: "#3B1FA3",
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 17,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 16,
    marginBottom: 32,
  },
  settingTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
});

export default Account;
