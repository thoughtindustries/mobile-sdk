import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import Screens from "../screens";

const FooterMenu = (props) => {
  const Tab = createBottomTabNavigator();

  const tabs = [
    {
      title: "Home",
      image: require("./../../assets/footer-home.png"),
      component: "Home",
    },
    {
      title: "Explore",
      image: require("./../../assets/footer-explore-d.png"),
      component: "MyLearnings",
    },
    {
      title: "My Learning",
      image: require("./../../assets/footer-mylearning-d.png"),
      component: "Offline",
    },
    {
      title: "Account",
      image: require("./../../assets/footer-account-d.png"),
      component: "MyLearnings",
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName={props.route.name}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70 },
        tabBarItemStyle: {
          margin: 10,
          padding: 3,
          borderRadius: 6,
          marginLeft: 10,
          marginRight: 10,
        },
        tabBarLabelStyle: { marginTop: 3 },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#6B7280",
        tabBarActiveBackgroundColor: "#3B1FA3",
      }}
    >
      {tabs.map((t, idx) => (
        <Tab.Screen
          key={idx}
          name={t.title}
          component={Screens[t.component]}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={t.image}
                style={{ tintColor: color, width: size, height: size }}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default FooterMenu;
