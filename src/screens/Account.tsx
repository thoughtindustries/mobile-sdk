import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import Utils from "../helpers/Utils";

type AccountScreenProps = StackNavigationProp<RootStackParamList, "Account">;

const Account = () => {
  const navigation = useNavigation<AccountScreenProps>();

  return (
    <View style={AppStyle.container}>
      <View style={accountStyles.prompt}>
        <Text style={accountStyles.title}>Account</Text>
        <Text style={accountStyles.subtitle}>
          Sign In or Create a new account to get started.
        </Text>
      </View>
      <View style={accountStyles.form}>
        <TouchableOpacity onPress={() => {}}>
          <Text>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={accountStyles.form}>
        <TouchableOpacity onPress={() => Utils.logMeOut(navigation)}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const accountStyles = StyleSheet.create({
  prompt: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 60,
  },

  form: {
    width: "100%",
  },

  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6B7280",
    fontFamily: "Poppins_400Regular",
  },
});

export default Account;
