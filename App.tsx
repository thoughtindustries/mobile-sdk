import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Screens from "./src/screens";
import { StyleSheet, View } from "react-native";
import { FooterMenu } from "./src/components";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";

const Stack = createNativeStackNavigator();

const App = () => {
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

  const client = new ApolloClient({
    uri: `${TI_API_INSTANCE}/helium?apiKey=${TI_API_KEY}`,
    cache: new InMemoryCache(),
  });

  const opts = { headerShown: false };

  const RouterContainer = () => (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={opts}>
        <Stack.Screen name="SplashScreen" component={Screens.SplashScreen} />
        <Stack.Screen
          name="Onboarding"
          component={Screens.Onboarding}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Registration" component={Screens.Registration} />
        <Stack.Screen name="Login" component={Screens.Login} />
        <Stack.Screen
          name="HomeScreen"
          component={FooterMenu}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="TopCategories" component={Screens.Offline} />
        <Stack.Screen name="CourseDetails" component={Screens.CourseDetails} />
        <Stack.Screen name="ExploreCourse" component={Screens.ExploreCourse} />
        <Stack.Screen
          name="ContentDetails"
          component={Screens.ContentDetails}
        />
        <Stack.Screen name="Explore" component={FooterMenu} />
        <Stack.Screen name="My Learning" component={FooterMenu} />
        <Stack.Screen name="Account" component={FooterMenu} />
        <Stack.Screen name="ProfileEdit" component={Screens.ProfileEdit} />
        <Stack.Screen name="Offline" component={Screens.Offline} />
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
