import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const Utils = {
  store: (name: string, value: object | string) => {
    value = _.isObject(value) ? JSON.stringify(value) : value;
    return AsyncStorage.setItem(name, value);
  },

  fetch: (name: string) => {
    return AsyncStorage.getItem(name).then((val) => {
      try {
        return JSON.parse(val || "{}");
      } catch (e) {
        return val;
      }
    });
  },

  isLoggedIn: () => {
    return Utils.fetch("udata")
      .then((val) => !_.isEmpty(_.get(val, "email", "")))
      .catch((err) => false);
  },

  checkLogin: (navigation: any) => {
    Utils.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        navigation.navigate("Home");
      }
    });
  },

  logMeOut: (navigation: any) => {
    try {
      AsyncStorage.removeItem("user_dbid")
        .then(() => AsyncStorage.removeItem("udata"))
        .then(() => AsyncStorage.removeItem("logintoken"))
        .then(navigation.navigate("Login"))
        .catch((err) => false);
    } catch (exception) {
      return false;
    }
  },

  topCategoriesArray: [
    "Partner",
    "Enablement",
    "News",
    "Release",
    "Sales Enablement",
  ],

  filterValues: {
    duration: ["1 Hour", "3 - 8 Hours", "9 - 16 Hours", "A couple of days"],
    difficulty: ["Beginner", "Intermediate", "Advanced"],
    tags: ["QuickStart", "Business"],
    myLearningsEvent: [
      "All",
      //"Events",
      //"Completed",
      //"Certifications",
      "Offline",
    ],
  },

  isOffline: () => false,
};

export default Utils;
