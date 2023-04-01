import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
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
          {_.isEmpty(profilePic) && Dimensions.get("window").height > 600 && (
            <Image
              source={require("../../assets/profile.png")}
              style={styles.profileImage}
            />
          )}
          {!_.isEmpty(profilePic) && Dimensions.get("window").height > 600 && (
            <Image source={{ uri: profilePic }} style={styles.profileImage} />
          )}

          <Text style={styles.subtitle}>
            {_.get(udata, "firstName", "Blake")}{" "}
            {_.get(udata, "lastName", "Reimer")}
          </Text>
          <Text style={styles.userEmail}>
            {_.get(udata, "email", "sobeksea@gmail")}
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("ProfileEdit")}>
            <Text style={styles.profileEdit}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>Settings</Text>

        <TouchableOpacity
          onPress={() => Linking.openURL(`${TI_API_INSTANCE}/learn/forgot`)}
          style={styles.resetButton}
        >
          <View style={styles.resetBtn}>
            <MaterialCommunityIcons
              name={"eye-off-outline"}
              size={22}
              color="#3B1FA3"
              style={styles.eyeIcon}
            />
            <Text style={styles.resetField}>Reset Password</Text>
            <MaterialCommunityIcons
              style={styles.settingIcon}
              name={"chevron-right"}
              size={25}
              color="#232323"
            />
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
  },
  accountInfo: {
    width: "100%",
  },
  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  settingInfo: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    padding: 24,
    alignItems: "flex-start",
    flex: 1,
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
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 30,
    fontSize: 20,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  profileImage: {
    marginTop: Dimensions.get("window").height < 700 ? 0 : 10,
    marginBottom: 20,
    height: Dimensions.get("window").height < 700 ? 100 : 132,
    width: Dimensions.get("window").height < 700 ? 100 : 132,
    borderRadius: 132,
  },
  subtitle: {
    fontSize: Dimensions.get("window").height < 700 ? 16 : 24,
    lineHeight: 36,
    marginBottom: Dimensions.get("window").height < 700 ? 0 : 12,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  userEmail: {
    fontSize: Dimensions.get("window").height < 700 ? 12 : 16,
    lineHeight: 24,
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
    marginBottom: Dimensions.get("window").height < 700 ? 10 : 24,
  },
  resetButton: {
    marginBottom: Dimensions.get("window").height < 700 ? 0 : 24,
  },
});

export default Account;
