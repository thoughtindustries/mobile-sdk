import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button, Message } from "../components";
import Success from "./Success";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { UserDetailType, ErrorMessageType } from "../../types";
import * as SecureStore from "expo-secure-store";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";

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
        <View style={AppStyle.container}>
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
              <Text style={AppStyle.label}>First Name</Text>
              <TextInput
                textContentType="name"
                placeholder="First Name"
                onChangeText={(text: string) => {
                  setUserInfo({ ...userInfo, firstName: text });
                }}
                defaultValue={userInfo.firstName}
                style={AppStyle.input}
              />
              <Text style={AppStyle.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={(text: string) => {
                  setUserInfo({ ...userInfo, lastName: text });
                }}
                defaultValue={userInfo.lastName}
                style={AppStyle.input}
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
  prompt: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  keyboardOffset: {
    width: "100%",
  },
  title: {
    fontFamily: "Poppins_400Regular",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },
  button: {
    marginVertical: 100,
  },
});

export default ProfileEdit;
