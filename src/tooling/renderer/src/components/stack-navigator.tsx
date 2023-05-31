import { FC } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProps } from "./types";

const Stack = createNativeStackNavigator();

const StackNavigation: FC<StackNavigationProps> = ({ children, styles }) => {
  const theme = {
    ...DefaultTheme,
    styles,
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName=""
        screenOptions={{ headerShown: false }}
      >
        {children}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
