import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Linking,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LogBox,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EyeOff, ChevronRight } from "lucide-react-native";
import { TI_API_INSTANCE } from "@env";
import { RootStackParamList, UserDetailType } from "../../types";
import * as SecureStore from "expo-secure-store";
import { useDataContext } from "../context";
import { useApolloClient } from "@apollo/client";
import { closeDB } from "../db/db";
import { fonts, scaleDimension, theme } from "../utils";

type AccountScreenProps = StackNavigationProp<RootStackParamList, "Account">;

const Account = () => {
  LogBox.ignoreLogs(["Require cycle:"]);
  const apolloClient = useApolloClient();
  const navigation = useNavigation<AccountScreenProps>();
  const { setInitialState } = useDataContext();
  const [userInfo, setUserInfo] = useState<UserDetailType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    asset: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const info = await SecureStore.getItemAsync("userInfo");
        if (info) {
          setUserInfo(JSON.parse(info));
        }
      } catch (error) {
        console.log("Fetch account info error: ", error);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userInfo");
    await SecureStore.deleteItemAsync("token");
    setInitialState(true);
    await apolloClient.clearStore();
    await closeDB();
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [{ name: "Onboarding" }, { name: "Login" }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.accountInfo}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.profileInfo}>
          {!userInfo.asset && Dimensions.get("window").height > 667 && (
            <Image
              source={require("../../assets/profile.png")}
              style={styles.profileImage}
            />
          )}
          {userInfo.asset && Dimensions.get("window").height > 667 && (
            <Image
              source={{ uri: userInfo.asset }}
              style={styles.profileImage}
            />
          )}

          <Text style={styles.subtitle}>
            {userInfo.firstName} {userInfo.lastName}
          </Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>

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
            <EyeOff
              size={scaleDimension(24, true)}
              color={theme.brand["brand-primary"]}
            />
            <Text style={styles.resetField}>Reset Password</Text>

            <ChevronRight
              size={scaleDimension(24, true)}
              color={theme.text["text-secondary"]}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleLogout()}>
          <Text style={styles.profileEdit}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: theme.surface["surface-100"],
    width: "100%",
    padding: scaleDimension(24, true),
    alignItems: "flex-start",
    flex: 1,
  },
  resetBtn: {
    borderRadius: scaleDimension(8, true),
    paddingTop: scaleDimension(16, true),
    paddingLeft: scaleDimension(16, true),
    paddingRight: scaleDimension(16, true),
    display: "flex",
    flexDirection: "row",
    backgroundColor: theme.surface["surface-200"],
    height: scaleDimension(25, false),
    width: "100%",
  },
  resetField: {
    paddingLeft: scaleDimension(10, true),
    flexGrow: 1,
    textAlign: "left",
  },
  title: {
    marginBottom: Dimensions.get("window").height < 667 ? 20 : 0,
    marginTop: scaleDimension(30, false),
    marginLeft: scaleDimension(30, true),
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "left",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  profileImage: {
    marginBottom: scaleDimension(16, false),
    height: scaleDimension(80, false),
    width: scaleDimension(80, false),
    borderRadius: scaleDimension(130, true),
  },
  subtitle: {
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    marginBottom: scaleDimension(6, true),
    textAlign: "center",
    color: theme.text["text-primary"],
    fontFamily: fonts.poppins.bold,
  },
  userEmail: {
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    color: theme.text["text-secondary"],
    fontFamily: fonts.poppins.regular,
  },
  profileEdit: {
    color: theme.brand["brand-primary"],
    fontFamily: fonts.inter.bold,
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(17, true),
    backgroundColor: theme.interface["ui-quaternary"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.border["border-200"],
    borderRadius: 4,
    paddingVertical: scaleDimension(10, false),
    paddingHorizontal: scaleDimension(24, false),
    marginTop: scaleDimension(12, false),
    marginBottom: scaleDimension(20, false),
  },
  settingTitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(16, false),
    marginBottom: scaleDimension(14, false),
  },
  resetButton: {
    marginBottom: scaleDimension(6, false),
  },
});

export default Account;
