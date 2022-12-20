import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import Utils from "../helpers/Utils";
import { get } from "lodash";

const UserHeader = () => {
  const [udata, setUdata] = useState<boolean>(false);

  useEffect(() => {
    Utils.fetch("udata").then(setUdata);
  }, []);
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/user.png")} />
      <Text style={styles.name}>
        Hi, {get(udata, "firstName", "")} {get(udata, "lastName", "")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingTop: 50,
    paddingBottom: 20,
  },

  name: {
    margin: 5,
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    lineHeight: 30,
  },
});

export default UserHeader;
