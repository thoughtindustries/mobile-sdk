import React from "react";
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
import { Logo, Button, Link, Message } from "../components";
import AppStyle from "../../AppStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TI_API_INSTANCE } from "@env";
import validator from "validator";
import _ from "lodash";
import tiGql from "../helpers/TIGraphQL";
import tiApi from "../helpers/TIApi";
import Utils from "../helpers/Utils";
import Success from "./Success";
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from "../../types";

type loginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {

  const navigation = useNavigation<loginScreenProp>();
  const [email, setEmail] = React.useState<string>('');
  const [passwd, setPasswd] = React.useState<string>('');

  const [isPasswordSecure, setIsPasswordSecure] = React.useState<boolean>(true);
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<any>({ error: "", info: "" });

  const onSignIn = () => {
    const params:any = {
      email: email,
      password: passwd,
    };

    if (!validator.isEmail(params.email)) {
      setMessage({ info: "", error: `Please enter a valid email address!` });
      return false;
    }

    setProcessing(true);
    tiGql
      .goLogin(params)
      .then(token => Utils.store("logintoken", token)) //== got login token, save it locally
      .then(() => tiApi.userDetails(params.email)) //== fetch user data of logged in user
      .then((udata) => Utils.store("udata", udata)) //== save user data locally
      .then(() => navigation.navigate("Home")) //== navigate to home
      .catch((err) => {
        setProcessing(false);
        setMessage({ info: "", error: _.get(err, "message", err) });
      });
  };

  return (<>
    {processing && <Success message="Trying to login, Please wait.. " />}
    {!processing && <ScrollView>
      {message.error!=="" && <Message type="error" canClose={true} message={message.error} onHide={() => {
          setMessage({...message, "error": ""});
      }} />}
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
              placeholder="default@email.com"
              style={AppStyle.input}
              keyboardType="email-address"
              autoCorrect={false}
            />
            <Text style={AppStyle.label}>Password</Text>
            <View style={{ ...AppStyle.input, flexDirection: "row" }}>
              <TextInput
                secureTextEntry={isPasswordSecure}
                onChangeText={setPasswd}
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
              onPress={() => Linking.openURL(`${TI_API_INSTANCE}/learn/forgot`)}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>}
  </>);
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
