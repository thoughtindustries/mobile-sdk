import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { get } from "lodash";

import Screens from "../screens";

interface FooterMenuProps {
  route: { name: string };
}

const FooterMenu = ({ route }: FooterMenuProps) => {
  const Tab = createBottomTabNavigator();

  const tabs: { title: string; image: any; component: string }[] = [
    {
      title: "Home",
      image: require("./../../assets/footer-home.png"),
      component: "Home",
    },
    {
      title: "Explore",
      image: require("./../../assets/footer-explore-d.png"),
      component: "MyLearning",
    },
    {
      title: "My Learning",
      image: require("./../../assets/footer-mylearning-d.png"),
      component: "Offline",
    },
    {
      title: "Account",
      image: require("./../../assets/footer-account-d.png"),
      component: "MyLearning",
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName={route.name}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 100 },
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
      {tabs.map((table, index) => (
        <Tab.Screen
          key={index}
          name={table.title}
          component={get(Screens, table.component, () => (
            <></>
          ))}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={table.image}
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
