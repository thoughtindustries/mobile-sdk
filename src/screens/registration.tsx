import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Logo, Button, Message } from "../components";
import Success from "./success";
import { TI_INSTANCE_NAME } from "@env";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, ErrorMessageType } from "../../types";
import { scaleDimension, fonts, theme, registerUser } from "../utils";

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

        await registerUser(
          form.email.value,
          form.firstName.value,
          form.lastName.value
        );

        setMessage(
          `Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`
        );
        setProcessing(false);

        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 2,
              routes: [{ name: "Onboarding" }, { name: "Login" }],
            })
          );
        }, 3000);
      } catch (error: any) {
        setProcessing(false);
        if (
          error.message ===
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
        <Success title="" message="Registration in progress! Please wait.. " />
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
              <Text style={styles(message, processing).label}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                placeholder="example@email.com"
                keyboardType="email-address"
                onChangeText={(value) => handleChange("email", value)}
                defaultValue={form.email.value}
                style={
                  form.email.error !== ""
                    ? {
                        ...styles(message, processing).input,
                        ...styles(message, processing).errorInput,
                      }
                    : styles(message, processing).input
                }
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={styles(message, processing).inlineError}>
                {form.email.error}
              </Text>
              <Text style={styles(message, processing).label}>First Name</Text>
              <TextInput
                textContentType="name"
                placeholder="First Name"
                onChangeText={(value) => handleChange("firstName", value)}
                defaultValue={form.firstName.value}
                style={
                  form.firstName.error !== ""
                    ? {
                        ...styles(message, processing).input,
                        ...styles(message, processing).errorInput,
                      }
                    : styles(message, processing).input
                }
              />
              <Text style={styles(message, processing).inlineError}>
                {form.firstName.error}
              </Text>
              <Text style={styles(message, processing).label}>Last Name</Text>
              <TextInput
                textContentType="name"
                placeholder="Last Name"
                onChangeText={(value) => handleChange("lastName", value)}
                defaultValue={form.lastName.value}
                style={
                  form.lastName.error !== ""
                    ? {
                        ...styles(message, processing).input,
                        ...styles(message, processing).errorInput,
                      }
                    : styles(message, processing).input
                }
              />
              <Text style={styles(message, processing).inlineError}>
                {form.lastName.error}
              </Text>
              <View style={styles(message, processing).button}>
                <Button title="Sign up" onPress={Register} />
              </View>
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
      flex: 1,
      justifyContent: "space-evenly",
      padding: scaleDimension(16, false),
      paddingTop: scaleDimension(30, false),
      backgroundColor:
        processing || message
          ? theme.brand["brand-primary"]
          : theme.surface["surface-100"],
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
    errorInput: {
      borderColor: theme.border["border-error"],
      color: theme.border["border-error"],
    },
    inlineError: {
      color: theme.border["border-error"],
      height: scaleDimension(6, false),
      fontSize: scaleDimension(14, true),
    },
    prompt: {
      justifyContent: "center",
      alignItems: "center",
    },
    keyboardOffset: {
      width: "100%",
    },
    title: {
      fontSize: scaleDimension(24, true),
      lineHeight: scaleDimension(18, false),
      textAlign: "center",
      color: theme.text["text-primary"],
      marginBottom: scaleDimension(10, true),
      fontFamily: fonts.poppins.bold,
    },
    button: {
      marginVertical: scaleDimension(10, false),
    },
  });

export default Registration;
