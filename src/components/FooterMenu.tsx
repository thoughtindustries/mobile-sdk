import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get } from "lodash";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Screens from "../screens";

const FooterMenu = ({ route }: { route: { name: string } }) => {
  const Tab = createBottomTabNavigator();

  const tabs: { title: string; component: string }[] = [
    {
      title: "Home",
      component: "Home",
    },
    {
      title: "Explore",
      component: "ExploreCatalog",
    },
    {
      title: "My Learning",
      component: "MyLearnings",
    },
    {
      title: "Account",
      component: "Account",
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
              <MaterialCommunityIcons
                name={
                  table.title === "Home"
                    ? "home"
                    : table.title === "Explore"
                    ? "magnify"
                    : table.title === "My Learning"
                    ? "school"
                    : "account"
                }
                color={color}
                size={size}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default FooterMenu;
