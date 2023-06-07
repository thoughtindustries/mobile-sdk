import { useEffect, useState } from "react";
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
import { LogBox } from "react-native";
import { FooterMenu } from "./src/components";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { ApolloProvider } from "@apollo/client";
import { makeApolloClient } from "./src/tooling/helium-mobile-server/src";
import { PageWrapper, StackNavigation } from "./src/tooling/renderer/src";
import { DataProvider } from "./src/context";

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

  const apolloClient = makeApolloClient();
  const Stack = createNativeStackNavigator();

  return (
    <ApolloProvider client={apolloClient}>
      <PageWrapper
        styles={{
          backgroundColor: "#F3F4F6",
        }}
      >
        <DataProvider>
          <StackNavigation styles={{ backgroundColor: "#F3F4F6" }}>
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
          </StackNavigation>
        </DataProvider>
      </PageWrapper>
    </ApolloProvider>
  );
};

export default App;
