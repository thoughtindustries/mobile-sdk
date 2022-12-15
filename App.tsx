import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Onboarding, Offline,Login, Registration, Success} from './src/screens';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { StyleSheet, View } from 'react-native';


const Stack = createNativeStackNavigator();

const App = () => {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  
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
      flexDirection: "column",
      backgroundColor: "#F3F4F6",
      fontFamily: "Poppins_400Regular"
    }
  });

  const opts={headerShown: false};

  const RouterContainer = () => <NavigationContainer theme={MyTheme}>
  <Stack.Navigator initialRouteName="Offline" screenOptions={opts}>
    <Stack.Screen name="Offline" component={Offline} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Registration" component={Registration} />
  </Stack.Navigator>
</NavigationContainer>;

  return <View style={wrapperStyle.container}>
    <RouterContainer />
  </View>;
};

export default App;