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
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);
  const [inlineMsg, setInlineMsg] = useState<any>({ field: "", message: "" });
  const [loginMutation, { loading }] = useLoginMutation();
  const [error, setError] = useState<string>("");

  const onSignIn = async () => {
    try {
      const { data } = await loginMutation({
        variables: { email: credentials.email, password: credentials.password },
      });

      const token = data?.Login;
      await SecureStore.setItemAsync("token", token || "");

      navigation.navigate("HomeScreen");
    } catch ({ message }) {
      setError(message);
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
          {error !== "" && <ErrorModal message={error} />}
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
                  onChangeText={(value) => {
                    setCredentials({ ...credentials, email: value });
                  }}
                  placeholder="example@email.com"
                  defaultValue={credentials.email}
                  style={
                    inlineMsg.field === "email"
                      ? { ...AppStyle.input, ...AppStyle.errorField }
                      : AppStyle.input
                  }
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <Text style={AppStyle.inlineError}>{inlineMsg.message}</Text>
                <Text style={AppStyle.label}>Password</Text>
                <View style={{ ...AppStyle.input, flexDirection: "row" }}>
                  <TextInput
                    secureTextEntry={isPasswordSecure}
                    onChangeText={(value) => {
                      setCredentials({ ...credentials, password: value });
                    }}
                    defaultValue={credentials.password}
                    placeholder="Enter your password here"
                    style={{ margin: 0, padding: 0, width: "93%" }}
                  />
                  <Pressable
                    onPress={() => setIsPasswordSecure(!isPasswordSecure)}
                    style={{ justifyContent: "center" }}
                  >
                    <MaterialCommunityIcons
                      name={isPasswordSecure ? "eye-off" : "eye"}
                      size={22}
                      color="#232323"
                    />
                  </Pressable>
                </View>
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
