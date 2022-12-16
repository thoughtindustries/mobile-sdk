import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button, Link } from "../components";
import AppStyle from "../../AppStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TI_API_INSTANCE } from "@env";
//import { gql, useMutation } from '@apollo/client';

const Login = (props) => {
  const [email, setEmail] = useState();
  const [passwd, setPasswd] = useState();

  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  /*
    const query = gql`
        mutation Login(
            $email: String!,
            $password: String!
        ) {
            Login(
            email: $email,
            password: $password
            )
        }`;

    const [Login, { loading, error }] = useMutation(query, {
        onCompleted: data => {
            console.log(data.Login);
        }
    });
  */
  const onSignIn = (e) => {
    const params = {
      email: email,
      password: passwd,
    };

    props.navigation.navigate("Home");

    //console.log(params);

    //Login(params);
  };

  return (
    <View style={AppStyle.container}>
      <KeyboardAvoidingView
        style={styles.keyboardOffset}
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
            textContentType="text"
            onChangeText={setEmail}
            placeholder="default@email.com"
            style={AppStyle.input}
            keyboardType="email-address"
            autoCapitalize={false}
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
