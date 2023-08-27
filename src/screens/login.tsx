import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Logo, Button, Link, Message } from "../components";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import Success from "./success";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, ErrorMessageType } from "../../types";
import { useLoginMutation } from "../graphql";
import * as SecureStore from "expo-secure-store";
import { createUser, initDB } from "../db/db";
import { useDataContext } from "../context";
import { Eye, EyeOff } from "lucide-react-native";
import { fonts, scaleDimension, theme } from "../utils";

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
    refetchRecentContent,
    refetchCatalogData,
    refetchContentData,
    setInitialState,
    isConnected,
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

  const onSignIn = async () => {
    try {
      if (formValidated()) {
        setInitialState(false);
        setLoading(true);

        if (!isConnected) {
          setResponseError({
            title: "Network Unavailable",
            message: "Please enable Wi-Fi or cellular data and try again.",
          });
          setLoading(false);
          return;
        }

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

            const { data: recentContent, loading: recentContentLoading } =
              await refetchRecentContent();
            const { data: content, loading: contentLoading } =
              await refetchContentData();
            const { data: catalog, loading: catalogLoading } =
              await refetchCatalogData();

            if (
              recentContent &&
              !recentContentLoading &&
              content &&
              !contentLoading &&
              catalog &&
              !catalogLoading
            ) {
              navigation.navigate("HomeScreen");
              setLoading(false);
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setLoading(false);
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
              <Text style={styles(loading).label}>Email</Text>
              <TextInput
                textContentType="emailAddress"
                onChangeText={(value) => handleChange("email", value)}
                placeholder="example@email.com"
                defaultValue={form.email.value}
                style={[
                  styles(loading).input,
                  form.email.error ? styles(loading).errorInput : null,
                ]}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Text style={styles(loading).inlineError}>
                {form.email.error}
              </Text>
              <Text style={styles(loading).label}>Password</Text>
              <View
                style={[
                  styles(loading).input,
                  form.password.error ? styles(loading).errorInput : null,
                ]}
              >
                <TextInput
                  secureTextEntry={!showPassword}
                  onChangeText={(value) => handleChange("password", value)}
                  defaultValue={form.password.value}
                  style={styles(loading).textInput}
                  placeholder="Enter your password here"
                />
                <TouchableOpacity
                  onPress={() => setShowpPassword(!showPassword)}
                  style={styles(loading).showPassword}
                >
                  {showPassword ? (
                    <Eye
                      size={scaleDimension(24, true)}
                      color={theme.text["text-primary"]}
                    />
                  ) : (
                    <EyeOff
                      size={scaleDimension(24, true)}
                      color={theme.text["text-primary"]}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles(loading).inlineError}>
                {form.password.error}
              </Text>
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
      flex: 1,
      justifyContent: "space-evenly",
      padding: scaleDimension(16, false),
      paddingTop: scaleDimension(30, false),
      backgroundColor: loading
        ? theme.brand["brand-primary"]
        : theme.surface["surface-100"],
    },
    prompt: {
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: scaleDimension(24, true),
      lineHeight: scaleDimension(18, false),
      textAlign: "center",
      color: theme.text["text-primary"],
      marginBottom: scaleDimension(6, false),
      fontFamily: fonts.poppins.bold,
    },
    button: {
      marginVertical: scaleDimension(10, false),
    },
    textInput: {
      margin: 0,
      padding: 0,
      width: "93%",
    },
    showPassword: {
      justifyContent: "center",
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
  });

export default Login;
