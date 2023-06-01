import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { Logo, Button, Message } from "../components";
import Success from "./Success";
import AppStyle from "../../AppStyle";
import tiApiObj from "../helpers/TIApi";
import { TI_INSTANCE_NAME } from "@env";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, ErrorMessageType } from "../../types";

type RegistrationScreenProps = StackNavigationProp<
  RootStackParamList,
  "Registration"
>;

interface FormProps {
  email: {
    value: string;
    error?: string;
  };
  firstName: {
    value: string;
    error?: string;
  };
  lastName: {
    value: string;
    error?: string;
  };
}

const Registration = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<ErrorMessageType>({
    title: "",
    message: "",
  });
  const [message, setMessage] = useState<any>("");
  const navigation = useNavigation<RegistrationScreenProps>();
  const [form, setForm] = useState<FormProps>({
    email: { value: "", error: "" },
    firstName: { value: "", error: "" },
    lastName: { value: "", error: "" },
  });

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setForm({ ...form, email: { ...form.email, value: value, error: "" } });
    } else if (field === "firstName") {
      setForm({
        ...form,
        firstName: { ...form.firstName, value: value, error: "" },
      });
    } else {
      setForm({
        ...form,
        lastName: { ...form.lastName, value: value, error: "" },
      });
    }
  };

  const formValidated = () => {
    const emailRegex =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    let updateForm = form;

    if (form.email.value === "" || !emailRegex.test(form.email.value)) {
      updateForm = {
        ...updateForm,
        email: {
          ...updateForm.email,
          error: "Please enter a valid email (example@gmail.com).",
        },
      };
    }

    if (form.firstName.value === "") {
      updateForm = {
        ...updateForm,
        firstName: {
          ...updateForm.firstName,
          error: "Please enter your first name.",
        },
      };
    }

    if (form.lastName.value === "") {
      updateForm = {
        ...updateForm,
        lastName: {
          ...updateForm.lastName,
          error: "Please enter your last name.",
        },
      };
    }

    setForm(updateForm);

    return updateForm.email.error === "" &&
      updateForm.firstName.error === "" &&
      updateForm.lastName.error === ""
      ? true
      : false;
  };

  const Register = async () => {
    if (formValidated()) {
      try {
        setProcessing(true);

        await tiApiObj.createUser({
          email: form.email.value,
          firstName: form.firstName.value,
          lastName: form.lastName.value,
        });

        setMessage(
          `Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`
        );
        setProcessing(false);

        setTimeout(() => {
          navigation.navigate("Login");
        }, 3000);
      } catch (error) {
        console.log("Registration Error: ", error);
        setProcessing(false);
        if (
          error ===
          "A user already exists with the external customer ID provided."
        ) {
          setResponseError({
            title: "Email In Use",
            message:
              "Sorry, that email address is already in use. Please try another one or log in if you already have an account.",
          });
        }
        if (error === "Response not successful: Received status code 404") {
          setResponseError({
            title: "We're Sorry",
            message: "We are unable to process your request at this time.",
          });
        }
      }
    }
  };

  return (
    <View style={styles(message, processing).container}>
      {processing && (
        <Success title="" message="Registration going on, Please wait.. " />
      )}

      {!processing && message !== "" && (
        <Success
          title="Success!"
          message={`Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`}
        />
      )}

      {!processing && message === "" && (
        <View>
          {responseError.title !== "" && (
            <Message
              title={responseError.title}
              message={responseError.message}
              onHide={() => setResponseError({ title: "", message: "" })}
            />
          )}

          <KeyboardAvoidingView
            style={styles(message, processing).keyboardOffset}
            keyboardVerticalOffset={5}
            behavior={"position"}
          >
            <View style={styles(message, processing).prompt}>
              <Logo />
              <Text style={styles(message, processing).title}>
                Create New Account
              </Text>
            </View>
            <View>
              <Text style={AppStyle.label}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                placeholder="example@email.com"
                keyboardType="email-address"
                onChangeText={(value) => handleChange("email", value)}
                defaultValue={form.email.value}
                style={
                  form.email.error !== ""
                    ? { ...AppStyle.input, ...AppStyle.errorField }
                    : AppStyle.input
                }
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={AppStyle.inlineError}>{form.email.error}</Text>
              <Text style={AppStyle.label}>First Name</Text>
              <TextInput
                textContentType="name"
                placeholder="First Name"
                onChangeText={(value) => handleChange("firstName", value)}
                defaultValue={form.firstName.value}
                style={
                  form.firstName.error !== ""
                    ? { ...AppStyle.input, ...AppStyle.errorField }
                    : AppStyle.input
                }
              />
              <Text style={AppStyle.inlineError}>{form.firstName.error}</Text>
              <Text style={AppStyle.label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={(value) => handleChange("lastName", value)}
                defaultValue={form.lastName.value}
                style={
                  form.lastName.error !== ""
                    ? { ...AppStyle.input, ...AppStyle.errorField }
                    : AppStyle.input
                }
              />
              <Text style={AppStyle.inlineError}>{form.lastName.error}</Text>
              <Button title="Sign up" onPress={Register} />
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const styles = (message: string, processing: boolean) =>
  StyleSheet.create({
    container: {
      ...AppStyle.container,
      backgroundColor: processing || message !== "" ? "#3B1FA3" : "#FFFFFF",
    },
    prompt: {
      justifyContent: "center",
      alignItems: "center",
    },
    keyboardOffset: {
      width: "100%",
    },
    title: {
      fontSize: (Dimensions.get("window").width / 440) * 24,
      lineHeight: 36,
      textAlign: "center",
      color: "#1F2937",
      marginBottom: 10,
      fontFamily: "Poppins_700Bold",
    },
  });

export default Registration;
