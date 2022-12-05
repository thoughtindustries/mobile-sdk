import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {Onboarding, Login, Registration, Success} from './src/screens';
import { useFonts } from 'expo-font';
const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Poppins': require('./assets/fonts/Poppins-Light.ttf'),
  });

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background:'#F3F4F6'
    },
  };
  const opts={headerShown: false};
  return <NavigationContainer theme={MyTheme}>
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={opts}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registration" component={Registration} />
      <Stack.Screen name="Success" component={Success} />
    </Stack.Navigator>
  </NavigationContainer>;
};

export default App;