import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
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
    <ScrollView>
      <View style={AppStyle.container}>
        <View style={loginStyle.section1}>
          <Logo />
          <Text style={loginStyle.title}>Sign In</Text>
        </View>
        <View style={loginStyle.section2}>
          <Text style={AppStyle.label}>Email</Text>
          <TextInput
            textContentType="text"
            onChangeText={setEmail}
            placeholder="default@email.com"
            style={AppStyle.input}
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
      </View>
    </ScrollView>
  );
};

const loginStyle = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "column",
  },

  section1: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 100,
  },

  section2: {
    flex: 2,
    justifyContent: "flex-start",
    marginLeft: 22,
    marginRight: 22,
  },

  title: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#6B7280",
  },

  link: {
    textAlign: "center",
    fontWeight: "700",
    color: "#3B1FA3",
    paddingTop: 25,
  },
});

export default Login;
