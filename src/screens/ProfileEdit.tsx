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
import tiApiObj from "../helpers/TIApi";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { UserDetailType } from "../../types";
import Utils from "../helpers/Utils";

const ProfileEdit = () => {
  const [udata, setUdata] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<any>({ error: "", info: "" });

  type ProfileEditScreenProps = StackNavigationProp<
    RootStackParamList,
    "ProfileEdit"
  >;

  const navigation = useNavigation<ProfileEditScreenProps>();

  const loadStoredUserData = () => {
    Utils.fetch("udata").then((val) =>
      setUdata(_.pick(val, ["id", "firstName", "lastName", "email"]))
    );
  };

  useEffect(loadStoredUserData, []);

  const goUpdate = () => {
    setProcessing(true);

    tiApiObj
      .updateUser(udata)
      .then((res: UserDetailType | string) => {
        setProcessing(false);
        setMessage({
          error: _.isString(res) ? res : "",
          info: _.isObject(res) ? "User updated successfully" : "",
        });
        return Utils.store("udata", res).then(loadStoredUserData);
      })
      .catch((err) => {
        setProcessing(false);
        setMessage({ info: "", error: _.get(err, "message", err) });
      });
  };

  return (
    <>
      {processing && (
        <Success title="" message="Registration going on, Please wait.. " />
      )}

      {!processing && (
        <View style={AppStyle.container}>
          {(message.error !== "" || message.info !== "") && (
            <Message
              type={message.error !== "" ? "error" : "info"}
              title={message.info !== "" ? "Profile Edit" : "Error Occurred"}
              message={message.info !== "" ? message.info : message.error}
              onHide={() => setMessage({ info: "", error: "" })}
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
                  setUdata({ ...udata, firstName: text });
                }}
                defaultValue={udata.firstName}
                style={AppStyle.input}
              />
              <Text style={AppStyle.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={(text: string) => {
                  setUdata({ ...udata, lastName: text });
                }}
                defaultValue={udata.lastName}
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
});

export default ProfileEdit;
