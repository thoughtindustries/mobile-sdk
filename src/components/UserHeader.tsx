import React, { useState, useEffect } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import Utils from "../helpers/Utils";
import _ from "lodash";
import { UserDetailType } from "../../types";

const UserHeader = () => {
  const [udata, setUdata] = useState<UserDetailType | boolean>(false);

  useEffect(() => {
    Utils.fetch("udata").then(setUdata);
  }, []);

  const profilePic = _.get(udata, "asset", "");
  return (
    <View style={styles.container}>
      {_.isEmpty(profilePic) && (
        <Image source={require("../../assets/user.png")} />
      )}
      {!_.isEmpty(profilePic) && (
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      )}
      <Text style={styles.name}>
        Hi, {_.get(udata, "firstName", "")} {_.get(udata, "lastName", "")}
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
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default UserHeader;
