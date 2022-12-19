import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const Utils = {
  store: (name: string, value: any) => {
    value = _.isObject(value) ? JSON.stringify(value) : value;
    return AsyncStorage.setItem(name, value);
  },

  fetch: (name: string) => {
    return AsyncStorage.getItem(name).then((val: any) => {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    });
  },
};

export default Utils;
