import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button, Message } from "../components";
import Success from "./success";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { UserDetailType, ErrorMessageType } from "../../types";
import * as SecureStore from "expo-secure-store";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import { scaleDimension, fonts, theme } from "../utils";

type ProfileEditScreenProps = StackNavigationProp<
  RootStackParamList,
  "ProfileEdit"
>;

const ProfileEdit = () => {
  const navigation = useNavigation<ProfileEditScreenProps>();
  const [userInfo, setUserInfo] = useState<UserDetailType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    asset: "",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<ErrorMessageType>({
    title: "",
    message: "",
  });

  useEffect(() => {
    (async () => {
      const response = await SecureStore.getItemAsync("userInfo");
      if (response) {
        setUserInfo(JSON.parse(response));
      }
    })();
  }, []);

  const handleModalClose = () => {
    setMessage({ title: "", message: "" });
    navigation.navigate("Account");
  };

  const updateProfile = async () => {
    setProcessing(true);
    try {
      const response = await fetch(
        `${TI_API_INSTANCE}/incoming/v2/users/${userInfo.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
          }),
        }
      );
      if (response.ok) {
        setMessage({
          title: "Congrats!",
          message: "Your profile has been successfully updated!",
        });
        await SecureStore.setItemAsync("userInfo", JSON.stringify(userInfo));
      } else {
        setMessage({
          title: "Uh-Oh!",
          message: "It looks like we had a problem processing your request.",
        });
      }
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      setMessage({
        title: "Uh-Oh!",
        message: "It looks like we had a problem processing your request.",
      });
    }
  };

  return (
    <>
      {processing && (
        <Success title="" message="Registration going on, Please wait.. " />
      )}

      {!processing && (
        <View style={styles.container}>
          {(message.title !== "" || message.message !== "") && (
            <Message
              title={message.title}
              message={message.message}
              onHide={() => handleModalClose()}
            />
          )}

          <KeyboardAvoidingView
            style={styles.keyboardOffset}
            keyboardVerticalOffset={5}
            behavior={"position"}
          >
            <View style={styles.prompt}>
              <Logo />
              <Text style={styles.title}>Edit Profile</Text>
            </View>
            <View>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                textContentType="name"
                placeholder="First Name"
                onChangeText={(text: string) => {
                  setUserInfo({ ...userInfo, firstName: text });
                }}
                defaultValue={userInfo.firstName}
                style={styles.input}
              />
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={(text: string) => {
                  setUserInfo({ ...userInfo, lastName: text });
                }}
                defaultValue={userInfo.lastName}
                style={styles.input}
              />
              <View style={styles.button}>
                <Button title="Update" onPress={updateProfile} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: scaleDimension(16, false),
    paddingTop: scaleDimension(30, false),
  },
  input: {
    flexDirection: "row",
    fontFamily: fonts.poppins.regular,
    padding: scaleDimension(10, false),
    paddingLeft: scaleDimension(10, false),
    paddingRight: scaleDimension(10, false),
    borderColor: theme.border["border-200"],
    borderWidth: 1,
    borderRadius: scaleDimension(6, true),
    backgroundColor: theme.surface["surface-100"],
    marginBottom: scaleDimension(2, false),
    fontSize: scaleDimension(16, true),
  },
  label: {
    fontFamily: fonts.poppins.bold,
    color: theme.text["text-primary"],
    marginTop: scaleDimension(10, false),
    marginBottom: scaleDimension(3, false),
    fontSize: scaleDimension(18, true),
  },
  prompt: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleDimension(50, false),
  },
  keyboardOffset: {
    width: "100%",
  },
  title: {
    fontFamily: fonts.poppins.regular,
    fontSize: scaleDimension(24, true),
    lineHeight: scaleDimension(18, false),
    textAlign: "center",
    color: theme.text["text-primary"],
    marginBottom: scaleDimension(10, true),
  },
  button: {
    marginVertical: scaleDimension(50, false),
  },
});

export default ProfileEdit;
