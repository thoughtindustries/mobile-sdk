import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Onboarding, Login, Registration, Success} from './src/screens';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { StyleSheet, View } from 'react-native';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';


const Stack = createNativeStackNavigator();

const App = () => {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Initialize Apollo Client
  const appclient = new ApolloClient({
    uri: 'localhost:3000/graphql',
    cache: new InMemoryCache()
  });

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background:'#F3F4F6'
    },
  };

  const wrapperStyle = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      flexDirection: "column",
      backgroundColor: "#F3F4F6",
      fontFamily: "Poppins_400Regular"
    }
  });

  const opts={headerShown: false};

  const RouterContainer = () => <NavigationContainer theme={MyTheme}>
  <Stack.Navigator initialRouteName="Onboarding" screenOptions={opts}>
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Registration" component={Registration} />
    <Stack.Screen name="Success" component={Success} />
  </Stack.Navigator>
</NavigationContainer>;

  return <View style={wrapperStyle.container}>
    <ApolloProvider client={appclient}>
        <RouterContainer />
    </ApolloProvider>
  </View>;
};

export default App;