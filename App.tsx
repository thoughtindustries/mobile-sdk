import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Onboarding,
  SplashScreen,
  Registration,
  Login,
  Offline,
  CourseDetails,
  ExploreCourse,
  ContentDetails,
  ProfileEdit,
} from "./src/screens";
import { StyleSheet, View, LogBox } from "react-native";
import { FooterMenu } from "./src/components";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import * as SecureStore from "expo-secure-store";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";

const App = () => {
  LogBox.ignoreLogs(["Require cycle:"]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#F3F4F6",
    },
  };

  const wrapperStyle = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: "#F3F4F6",
      fontFamily: "Poppins_400Regular",
    },
  });

  const httpLink = createHttpLink({
    uri: `${TI_API_INSTANCE}/helium?apiKey=${TI_API_KEY}`,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await SecureStore.getItemAsync("token");
    return {
      headers: {
        ...headers,
        authToken: token,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const Stack = createNativeStackNavigator();

  const RouterContainer = () => (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="
      "
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Registration" component={Registration} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="HomeScreen"
          component={FooterMenu}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="TopCategories" component={Offline} />
        <Stack.Screen name="CourseDetails" component={CourseDetails} />
        <Stack.Screen name="ExploreCourse" component={ExploreCourse} />
        <Stack.Screen name="ContentDetails" component={ContentDetails} />
        <Stack.Screen name="Explore" component={FooterMenu} />
        <Stack.Screen name="My Learning" component={FooterMenu} />
        <Stack.Screen name="Account" component={FooterMenu} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="Offline" component={Offline} />
      </Stack.Navigator>
    </NavigationContainer>
  );

  return (
    <ApolloProvider client={client}>
      <View style={wrapperStyle.container}>
        <RouterContainer />
      </View>
    </ApolloProvider>
  );
};

export default App;
