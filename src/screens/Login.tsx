import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Linking,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from "react-native";
import { Logo, Button, Link, Message } from "../components";
import AppStyle from "../../AppStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import Success from "./Success";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, ErrorMessageType } from "../../types";
import { useLoginMutation } from "../graphql";
import * as SecureStore from "expo-secure-store";
import { createUser, initDB } from "../db/db";
import { useDataContext } from "../context";

type LoginScreenProps = StackNavigationProp<RootStackParamList, "Login">;

interface FormProps {
  email: {
    value: string;
    error?: string;
  };
  password: {
    value: string;
    error?: string;
  };
}

const Login = () => {
  const navigation = useNavigation<LoginScreenProps>();
  const {
    recentContent,
    refetchRecentContent,
    catalogData,
    refetchCatalogData,
    contentData,
    refetchContentData,
  } = useDataContext();
  const [showPassword, setShowpPassword] = useState<boolean>(false);
  const [loginMutation] = useLoginMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [responseError, setResponseError] = useState<ErrorMessageType>({
    title: "",
    message: "",
  });
  const [form, setForm] = useState<FormProps>({
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  });

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setForm({ ...form, email: { ...form.email, value: value, error: "" } });
    } else {
      setForm({
        ...form,
        password: { ...form.password, value: value, error: "" },
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
        password: {
          ...updateForm.password,
        },
      };
    }

    if (form.password.value === "" || form.password.value.length < 6) {
      updateForm = {
        ...updateForm,
        password: {
          ...updateForm.password,
          error:
            "Please enter a password that is at least six characters long.",
        },
      };
    }

    setForm(updateForm);

    return updateForm.email.error === "" && updateForm.password.error === ""
      ? true
      : false;
  };

  useEffect(() => {
    if (recentContent && catalogData && contentData) {
      navigation.navigate("HomeScreen");
      setForm({
        ...form,
        email: { ...form.email, value: "", error: "" },
        password: { ...form.password, value: "", error: "" },
      });
    }
  }, [recentContent, catalogData, contentData]);

  const onSignIn = async () => {
    try {
      if (formValidated()) {
        setLoading(true);
        // Login user
        const { data } = await loginMutation({
          variables: {
            email: form.email.value,
            password: form.password.value,
          },
        });

        if (data) {
          // Retrieve auth token and store
          const token = data.Login;
          await SecureStore.setItemAsync("token", token);

          // Query user's information and store
          const response = await fetch(
            `${TI_API_INSTANCE}/incoming/v2/users/${form.email.value}`,
            {
              method: "GET",
              headers: {
                Authorization: "Bearer " + TI_API_KEY,
              },
            }
          );

          const userInfo = await response.json();
          if (userInfo) {
            await initDB();
            await createUser(userInfo);
            await SecureStore.setItemAsync(
              "userInfo",
              JSON.stringify(userInfo)
            );

            refetchContentData();
            refetchCatalogData();
            refetchRecentContent();
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "401 Unauthorized") {
          setResponseError({
            title: "Invalid email or password.",
            message:
              "If you do not have an account you can register for a new one.",
          });
        }
        if (error.message === "423 Locked") {
          setResponseError({
            title: "Account Locked",
            message:
              "Your account has been disabled. Please contact your account administrator.",
          });
        }
        if (error.message === "User Throttled") {
          setResponseError({
            title: "Too Many Attemps",
            message:
              "You have made too many log in attempts. Please try again in 30 minutes.",
          });
        }
        if (error.message === "Password reset required") {
          setResponseError({
            title: "Reset Required",
            message:
              "To gain access to your account, you will have to reset your password. Please check your email to continue the password reset process. After resetting your password, you'll be able to login.",
          });
        }
        if (error.message === "Email verification required") {
          setResponseError({
            title: "Verify Email",
            message:
              "This account requires validation via email confirmation. An email has been sent to you with instructions to validate your email address. After you cofirm your account, you will be able to sign in and access your learning.",
          });
        }
        if (
          error.message === "Response not successful: Received status code 404"
        ) {
          setResponseError({
            title: "We're Sorry",
            message: "We are unable to process your request at this time.",
          });
        }
      }
    }
  };

  return (
    <View style={styles(loading).container}>
      {loading && (
        <Success title="" message="Trying to login, Please wait... " />
      )}
      {!loading && (
        <View>
          {responseError.title !== "" && (
            <Message
              title={responseError.title}
              message={responseError.message}
              onHide={() => setResponseError({ title: "", message: "" })}
            />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles(loading).prompt}>
              <Logo />
              <Text style={styles(loading).title}>Sign In</Text>
            </View>
            <View>
              <Text style={AppStyle.label}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                onChangeText={(value) => handleChange("email", value)}
                placeholder="example@email.com"
                defaultValue={form.email.value}
                style={
                  form.email.error !== ""
                    ? { ...AppStyle.input, ...AppStyle.errorField }
                    : AppStyle.input
                }
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={AppStyle.inlineError}>{form.email.error}</Text>
              <Text style={AppStyle.label}>Password</Text>
              <View
                style={
                  form.password.error !== ""
                    ? {
                        ...AppStyle.input,
                        ...AppStyle.errorField,
                        flexDirection: "row",
                      }
                    : { ...AppStyle.input, flexDirection: "row" }
                }
              >
                <TextInput
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => handleChange("password", value)}
                  defaultValue={form.password.value}
                  style={styles(loading).textInput}
                  placeholder="Enter your password here"
                />
                <Pressable
                  onPress={() => setShowpPassword(!showPassword)}
                  style={{ justifyContent: "center" }}
                >
                  <MaterialCommunityIcons
                    name={!showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#232323"
                  />
                </Pressable>
              </View>
              <Text style={AppStyle.inlineError}>{form.password.error}</Text>
              <View style={styles(loading).button}>
                <Button title="Sign In" onPress={onSignIn} />
              </View>
              <Link
                title="Forgot Password?"
                onPress={() =>
                  Linking.openURL(`${TI_API_INSTANCE}/learn/forgot`)
                }
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
};

const styles = (loading: boolean) =>
  StyleSheet.create({
    container: {
      ...AppStyle.container,
      backgroundColor: loading ? "#3B1FA3" : "#FFFFFF",
    },
    prompt: {
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: (Dimensions.get("window").width / 440) * 24,
      lineHeight: 36,
      textAlign: "center",
      color: "#1F2937",
      marginBottom: 10,
      fontFamily: "Poppins_700Bold",
    },
    button: {
      marginVertical: 20,
    },
    textInput: {
      margin: 0,
      padding: 0,
      width: "93%",
    },
  });

export default Login;
