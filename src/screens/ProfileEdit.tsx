import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button } from "../components";
import Success from "./Success";
import AppStyle from "../../AppStyle";
import tiApiObj from "../helpers/TIApi";
import { get } from "lodash";
import { TI_INSTANCE_NAME } from "@env";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

const ProfileEdit = () => {
  const [fname, setFName] = useState<string>("");
  const [lname, setLName] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<any>({ error: "", info: "" });
  const [inlineMsg, setInlineMsg] = useState<any>({ field: "", message: "" });

  type ProfileEditScreenProps = StackNavigationProp<
    RootStackParamList,
    "ProfileEdit"
  >;

  const navigation = useNavigation<ProfileEditScreenProps>();

  const goUpdate = () => {
    const udata: { firstName: string; lastName: string } = {
      firstName: fname,
      lastName: lname,
    };

    setProcessing(true);

    tiApiObj
      .createUser(udata)
      .then(() => {
        setProcessing(false);
        setMessage({
          error: "",
          info: `Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`,
        });
        window.setTimeout(() => {
          setMessage({ info: "", error: "" });
          navigation.navigate("Login");
        }, 3000);
      })
      .catch((err) => {
        setProcessing(false);
        setMessage({ info: "", error: get(err, "message", err) });
      });
  };

  const ShowRegistrationError: any = () => {
    let modalTitle = "Email in use";
    let modalMessage =
      "Sorry, that email address is already in use. Please try another one or log in if you already have an account.";
    return (
      <Modal animationType="slide" transparent={true} visible={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalDialog}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Button
              title="Log into existing account"
              onPress={() => navigation.navigate("Login")}
            />
            <TouchableOpacity
              onPress={() => setMessage({ error: "", info: "" })}
            >
              <Text style={styles.closeBtn}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      {processing && (
        <Success title="" message="Registration going on, Please wait.. " />
      )}

      {!processing && message.info !== "" && (
        <Success title="Success" message={message.info} />
      )}

      {!processing && message.info === "" && (
        <View style={AppStyle.container}>
          {message.error !== "" && <ShowRegistrationError />}

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
                onChangeText={setFName}
                defaultValue={fname}
                style={AppStyle.input}
              />
              <Text style={AppStyle.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={setLName}
                defaultValue={lname}
                style={AppStyle.input}
              />
              <Button title="Update" onPress={goUpdate} />
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

  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18242Ebb",
    height: "100%",
  },

  modalDialog: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    margin: 40,
    padding: 40,
  },

  modalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },

  modalMessage: {
    fontFamily: "Inter_400Regular",
    paddingTop: 16,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 15,
    textAlign: "left",
  },

  closeBtn: {
    color: "#6B7280",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default ProfileEdit;
