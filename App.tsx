import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screens from './src/screens';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { StyleSheet, View } from 'react-native';
import {FooterMenu} from './src/components';

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
  <Stack.Navigator initialRouteName="Onboarding" screenOptions={opts}>
    <Stack.Screen name="Offline" component={Screens.Offline} />
    <Stack.Screen name="Onboarding" component={Screens.Onboarding} />
    <Stack.Screen name="Login" component={Screens.Login} />
    <Stack.Screen name="Registration" component={Screens.Registration} />
    <Stack.Screen name="Home" component={FooterMenu} />
    <Stack.Screen name="Explore" component={FooterMenu} />
    <Stack.Screen name="My Learning" component={FooterMenu} />
    <Stack.Screen name="Account" component={FooterMenu} />
  </Stack.Navigator>
</NavigationContainer>;

  return <View style={wrapperStyle.container}>
    <RouterContainer />
  </View>;
};

export default App;