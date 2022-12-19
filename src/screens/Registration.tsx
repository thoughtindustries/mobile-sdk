import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button, Message } from "../components";
import AppStyle from "../../AppStyle";
import tiApiObj from "../helpers/TIApi";
import _ from "lodash";
import validator from "validator";
import { TI_INSTANCE_NAME } from "@env";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";

const Registration = () => {
  const [email, setEmail] = React.useState<string>("");
  const [fname, setFName] = React.useState<string>("");
  const [lname, setLName] = React.useState<string>("");
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<any>({ error: "", info: "" });

  type registrationScreenProp = StackNavigationProp<
    RootStackParamList,
    "Registration"
  >;

  const navigation = useNavigation<registrationScreenProp>();

  const goRegistration = () => {
    const udata: { firstName: string; lastName: string; email: string } = {
      firstName: fname,
      lastName: lname,
      email: email,
    };

    if (!validator.isEmail(udata.email)) {
      setMessage({ info: "", error: `Please enter a valid email address!` });
      return false;
    }

    setProcessing(true);

    tiApiObj
      .createUser(udata)
      .then((res) => {
        setProcessing(false);
        setMessage({
          error: "",
          info: `Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`,
        });
        window.setTimeout(() => {
          navigation.navigate("Login");
        }, 3000);
      })
      .catch((err) => {
        setProcessing(false);
        setMessage({ info: "", error: _.get(err, "message", err) });
      });
  };

  return (
    <>
      {!processing && message.info === "" && (
        <View style={AppStyle.container}>
          {message.error !== "" && (
            <Message
              type="error"
              canClose={true}
              message={message.error}
              onHide={() => {
                setMessage({ ...message, error: "" });
              }}
            />
          )}

          <KeyboardAvoidingView
            style={styles.keyboardOffset}
            keyboardVerticalOffset={5}
            behavior={"position"}
          >
            <View style={styles.prompt}>
              <Logo />
              <Text style={styles.title}>Create New Account</Text>
            </View>
            <View>
              <Text style={AppStyle.label}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                placeholder="default@email.com"
                keyboardType="email-address"
                onChangeText={setEmail}
                style={AppStyle.input}
                autoCorrect={false}
              />
              <Text style={AppStyle.label}>First Name</Text>
              <TextInput
                textContentType="name"
                placeholder="First Name"
                onChangeText={setFName}
                style={AppStyle.input}
              />
              <Text style={AppStyle.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={setLName}
                style={AppStyle.input}
              />
              <Button title="Sign up" onPress={goRegistration} />
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
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    marginBottom: 10,
  },
});

export default Registration;
