import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Logo, Button, Link } from "../components";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import Utils from "../helpers/Utils";

type OnboardingScreenProps = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const Onboarding = () => {
  const navigation = useNavigation<OnboardingScreenProps>();

  // useEffect(() => Utils.checkLogin(navigation), []);

  return (
    <View style={AppStyle.container}>
      <View style={styles.prompt}>
        <Logo />
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>
          Sign In or Create a new account to get started.
        </Text>
      </View>
      <View style={styles.form}>
        <Button title="Sign In" onPress={() => navigation.navigate("Login")} />
        <Link
          title="Create new account!"
          onPress={() => navigation.navigate("Registration")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Onboarding;
