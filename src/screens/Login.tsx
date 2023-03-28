import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Logo, Button, Link, ErrorModal } from "../components";
import AppStyle from "../../AppStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TI_API_INSTANCE } from "@env";
import validator from "validator";
import { get } from "lodash";
import tiGql from "../helpers/TIGraphQL";
import tiApi from "../helpers/TIApi";
import dbObj from "../helpers/Db";
import Utils from "../helpers/Utils";
import Success from "./Success";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { useLoginMutation } from "../graphql";
import * as SecureStore from "expo-secure-store";

type LoginScreenProps = StackNavigationProp<RootStackParamList, "Login">;

const Login = () => {
  const navigation = useNavigation<LoginScreenProps>();
  const [showPassword, setShowpPassword] = useState<boolean>(false);
  const [formValidation, setFormValidation] = useState<{
    email?: string;
    password?: string;
  }>({
    email: "",
    password: "",
  });
  const [loginMutation, { loading }] = useLoginMutation();
  const [error, setError] = useState<string>("");
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setFormValidation({
        email: "",
        password: formValidation.password,
      });
      setCredentials({ ...credentials, email: value });
    } else {
      setCredentials({ ...credentials, password: value });
      setFormValidation({
        email: formValidation.email,
        password: "",
      });
    }
  };

  const formValidated = () => {
    const emailRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    if (
      credentials.email === "" ||
      (credentials.email !== "" &&
        !emailRegex.test(credentials.email) &&
        (credentials.password === "" || credentials.password.length < 6))
    ) {
      setFormValidation({
        email: "Please enter a valid email address.",
        password:
          "Please enter a password that is at least six characters long.",
      });

      return false;
    }

    if (
      credentials.email === "" ||
      (credentials.email !== "" && !emailRegex.test(credentials.email))
    ) {
      setFormValidation({
        email: "Please enter a valid email address.",
        password: "",
      });

      return false;
    }

    if (credentials.password === "" || credentials.password.length < 6) {
      setFormValidation({
        email: "",
        password:
          "Please enter a password that is at least six characters long.",
      });

      return false;
    }

    return true;
  };

  const onSignIn = async () => {
    setError("");
    try {
      if (formValidated()) {
        const { data } = await loginMutation({
          variables: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        const token = data?.Login;
        await SecureStore.setItemAsync("token", token || "");

        navigation.navigate("HomeScreen");
      }
    } catch ({ message }) {
      if (message === "401 Unauthorized") {
        setError("Invalid email or password.");
      }
      if (message === "423 Locked") {
        setError(
          "Your account has been disabled. Please contact your account administrator."
        );
      }
      if (message === "User Throttled") {
        setError(
          "You have made too many log in attempts. Please try again in 30 minutes."
        );
      }
      if (message === "Password reset required") {
        setError(
          "To gain access to your account, you will have to reset your password. Please check your email to continue the password reset process. After resetting your password, you'll be able to login."
        );
      }
      if (message === "Email verification required") {
        setError(
          "This account requires validation via email confirmation. An email has been sent to you with instructions to validate your email address. After you cofirm your account, you will be able to sign in and access your learning."
        );
      }
    }
    // const params: { email: string; password: string } = {
    //   email: credentials.email,
    //   password: credentials.password,
    // };
    // if (!validator.isEmail(params.email)) {
    //   setInlineMsg({
    //     field: "email",
    //     message: `Please enter a valid email (example@gmail.com)`,
    //   });
    //   return false;
    // }
    // setProcessing(true);
    // tiGql
    //   .goLogin(params)
    //   .then((token) => Utils.store("logintoken", { token: token })) //== got login token, save it locally
    //   .then(() => tiApi.userDetails(params.email)) //== fetch user data of logged in user
    //   .then((udata) => Utils.store("udata", udata)) //== save user data locally
    //   .then(() => dbObj.userLookup(params.email))
    //   .then((id: Number) => Utils.store("user_dbid", { id: id }))
    //   .then(() => {
    //     setProcessing(false);
    //     navigation.navigate("HomeScreen");
    //   }) //== navigate to home
    //   .catch((err) => {
    //     setProcessing(false);
    //     setMessage({ info: "", error: get(err, "message", err) });
    //   });
  };

  return (
    <>
      {loading && (
        <Success title="" message="Trying to login, Please wait.. " />
      )}
      {!loading && (
        <ScrollView>
          {error !== "" && (
            <ErrorModal
              error={error}
              message={
                "If you do not have an account you can register for a new one."
              }
              title={"Register for new account"}
              route="Registration"
            />
          )}
          <View style={AppStyle.container}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={5}
              behavior={"position"}
            >
              <View style={styles.prompt}>
                <Logo />
                <Text style={styles.title}>Sign In</Text>
              </View>
              <View>
                <Text style={AppStyle.label}>Email</Text>
                <TextInput
                  textContentType="emailAddress"
                  onChangeText={(value) => handleChange("email", value)}
                  placeholder="example@email.com"
                  defaultValue={credentials.email}
                  style={
                    formValidation.email !== ""
                      ? { ...AppStyle.input, ...AppStyle.errorField }
                      : AppStyle.input
                  }
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <Text style={AppStyle.inlineError}>{formValidation.email}</Text>
                <Text style={AppStyle.label}>Password</Text>
                <View
                  style={
                    formValidation.password !== ""
                      ? {
                          ...AppStyle.input,
                          ...AppStyle.errorField,
                          flexDirection: "row",
                        }
                      : { ...AppStyle.input, flexDirection: "row" }
                  }
                >
                  <TextInput
                    secureTextEntry={!showPassword}
                    onChangeText={(value) => handleChange("password", value)}
                    defaultValue={credentials.password}
                    style={{ margin: 0, padding: 0, width: "93%" }}
                    placeholder="Enter your password here"
                  />
                  <Pressable
                    onPress={() => setShowpPassword(!showPassword)}
                    style={{ justifyContent: "center" }}
                  >
                    <MaterialCommunityIcons
                      name={!showPassword ? "eye-off" : "eye"}
                      size={22}
                      color="#232323"
                    />
                  </Pressable>
                </View>
                <Text style={AppStyle.inlineError}>
                  {formValidation.password}
                </Text>
                <Button title="Sign In" onPress={onSignIn} />
                <Link
                  title="Forgot Password?"
                  onPress={() =>
                    Linking.openURL(`${TI_API_INSTANCE}/learn/forgot`)
                  }
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  prompt: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 60,
  },

  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
  },
});

export default Login;
