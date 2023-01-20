import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Logo, Button, Link, Message } from "../components";
import AppStyle from "../../AppStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TI_API_INSTANCE } from "@env";
import validator from "validator";
import { get } from "lodash";
import tiGql from "../helpers/TIGraphQL";
import tiApi from "../helpers/TIApi";
import Utils from "../helpers/Utils";
import Success from "./Success";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

type LoginScreenProps = StackNavigationProp<RootStackParamList, "Login">;

const Login = () => {
  const navigation = useNavigation<LoginScreenProps>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<any>({ error: "", info: "" });
  const [inlineMsg, setInlineMsg] = useState<any>({ field: "", message: "" });

  useEffect(() => {
    if (inlineMsg.field === "email") {
      setInlineMsg({ field: "", message: "" });
    }
  }, [email]);

  const onSignIn = () => {
    const params: { email: string; password: string } = {
      email: email,
      password: password,
    };

    if (!validator.isEmail(params.email)) {
      setInlineMsg({
        field: "email",
        message: `Please enter a valid email (example@gmail.com)`,
      });
      return false;
    }

    setProcessing(true);
    tiGql
      .goLogin(params)
      .then((token) => Utils.store("logintoken", { token: token })) //== got login token, save it locally
      .then(() => tiApi.userDetails(params.email)) //== fetch user data of logged in user
      .then((udata) => Utils.store("udata", udata)) //== save user data locally
      .then(() => {
        setProcessing(false);
        navigation.navigate("Home");
      }) //== navigate to home
      .catch((err) => {
        setProcessing(false);
        setMessage({ info: "", error: get(err, "message", err) });
      });
  };

  React.useEffect(() => Utils.checkLogin(navigation), []);

  const ShowError = (): JSX.Element => {
    let modalTitle = "Error Occurred";
    let modalMessage = message.error;
    return (
      <Message
        type="error"
        title={modalTitle}
        message={modalMessage}
        onHide={() => setMessage({ info: "", error: "" })}
      />
    );
  };

  return (
    <>
      {processing && (
        <Success title="" message="Trying to login, Please wait.. " />
      )}
      {!processing && (
        <ScrollView>
          {message.error !== "" && <ShowError />}
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
                  onChangeText={setEmail}
                  placeholder="example@email.com"
                  defaultValue={email}
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
                    onChangeText={setPassword}
                    defaultValue={password}
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
