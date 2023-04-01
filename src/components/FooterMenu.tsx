import React from "react";
import { Dimensions, PixelRatio } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Home, ExploreCatalog, MyLearnings, Account } from "../screens";

const FooterMenu = ({ route }: { route: { name: string } }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName={route.name}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height:
            Dimensions.get("window").height < 700
              ? (Dimensions.get("window").height / 440) * 55
              : (Dimensions.get("window").height / 440) * 45,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarItemStyle: {
          borderRadius: 6,
          margin: (Dimensions.get("window").width / 414) * 10,
        },
        tabBarLabelStyle: {
          marginBottom: (Dimensions.get("window").width / 414) * 10,
          marginTop: (Dimensions.get("window").width / 414) * -8,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#6B7280",
        tabBarActiveBackgroundColor: "#3B1FA3",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={(Dimensions.get("window").width / 414) * size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreCatalog}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="magnify"
              color={color}
              size={(Dimensions.get("window").width / 414) * size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Learning"
        component={MyLearnings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="school"
              color={color}
              size={(Dimensions.get("window").width / 414) * size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={(Dimensions.get("window").width / 414) * size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default FooterMenu;
