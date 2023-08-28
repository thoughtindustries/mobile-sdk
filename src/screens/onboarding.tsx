import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Logo, Button, Link, Message } from "../components";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { scaleDimension, fonts, theme } from "../utils";
import { useDataContext } from "../context";

type OnboardingScreenProps = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const Onboarding = () => {
  const navigation = useNavigation<OnboardingScreenProps>();
  const { isConnected } = useDataContext();
  const [openModal, setOpenModal] = useState<boolean>(!isConnected);

  return (
    <View style={styles.container}>
      {openModal && (
        <Message
          title="Network Unavailable"
          message="Please enable Wi-Fi or cellular data and try again."
          onHide={() => setOpenModal(false)}
        />
      )}
      <View style={styles.prompt}>
        <Logo />
        <Text style={styles.title}>Let's Get Started</Text>
        <Text style={styles.subtitle}>
          Sign In or Create a new account to get started.
        </Text>
      </View>
      <View style={styles.form}>
        <View style={styles.button}>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
        <Link
          title="Create new account!"
          onPress={() => navigation.navigate("Registration")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: scaleDimension(16, false),
    paddingTop: scaleDimension(30, false),
  },
  prompt: {
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "100%",
  },
  title: {
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-primary"],
    marginBottom: scaleDimension(5, false),
    fontFamily: fonts.poppins.bold,
  },
  subtitle: {
    fontSize: scaleDimension(16, true),
    lineHeight: scaleDimension(12, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    fontFamily: fonts.poppins.regular,
  },
  button: {
    marginVertical: scaleDimension(10, false),
  },
});

export default Onboarding;
