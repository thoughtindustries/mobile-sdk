import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import Utils from "../helpers/Utils";
import { get } from "lodash";
import { SafeAreaView } from "react-native-safe-area-context";

type AccountScreenProps = StackNavigationProp<RootStackParamList, "Account">;

const Account = () => {
  const navigation = useNavigation<AccountScreenProps>();
  const [udata, setUdata] = useState<boolean>(false);
  useEffect(() => {
    Utils.fetch("udata").then(setUdata);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.accountInfo}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.profileInfo}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.profileImage}
          />
          <Text style={styles.subtitle}>
            {get(udata, "firstName", "")} {get(udata, "lastName", "")}
          </Text>
          <Text style={styles.userEmail}>{get(udata, "email", "")}</Text>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.profileEdit}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>Settings</Text>
        <TouchableOpacity onPress={() => Utils.logMeOut(navigation)}>
          <Text style={styles.profileEdit}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  accountInfo: {
    marginTop: 10,
    marginBottom: 60,
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
    padding: 32,
    alignItems: "flex-start",
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
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
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
    marginTop: 20,
    marginBottom: 32,
  },
  settingTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Account;
