import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const Utils = {
  store: (name: string, value: object | string) => {
    value = _.isObject(value) ? JSON.stringify(value) : value;
    return AsyncStorage.setItem(name, value);
  },

  fetch: (name: string) => {
    return AsyncStorage.getItem(name).then((val) => {
      if (!_.isEmpty(val)) {
        return JSON.parse(val);
      } else {
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
      AsyncStorage.removeItem("udata")
        .then(navigation.navigate("Login"))
        .catch((err) => false);
    } catch (exception) {
      return false;
    }
  },
};

export default Utils;
