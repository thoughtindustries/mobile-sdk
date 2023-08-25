import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Home as HomeIcon,
  Search,
  GraduationCap,
  User,
} from "lucide-react-native";
import { Home, ExploreCatalog, MyLearnings, Account } from "../screens";
import { scaleDimension, theme } from "../utils";

const FooterMenu = ({ route }: { route: { name: string } }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={route.name}
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: theme.text["text-inverse"],
        tabBarInactiveTintColor: theme.text["text-secondary"],
        tabBarActiveBackgroundColor: theme.brand["brand-primary"],
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={scaleDimension(size, true)} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreCatalog}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Search color={color} size={scaleDimension(size, true)} />
          ),
        }}
      />
      <Tab.Screen
        name="My Learning"
        component={MyLearnings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <GraduationCap color={color} size={scaleDimension(size, true)} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={scaleDimension(size, true)} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: scaleDimension(55, false),
    justifyContent: "center",
    alignItems: "center",
  },
  tabBarItemStyle: {
    borderRadius: scaleDimension(6, true),
    margin: scaleDimension(10, true),
  },
  tabBarLabelStyle: {
    marginBottom: scaleDimension(10, true),
    marginTop: scaleDimension(-8, true),
  },
});

export default FooterMenu;
