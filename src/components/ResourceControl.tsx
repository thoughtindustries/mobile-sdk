import React, { useState } from "react";

import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { topicType } from "../../types";

import Utils from "../helpers/Utils";

const ResourceControl = (props: { data: topicType[] }) => {
  const [show, setShow] = useState<boolean>(false);
  const ResourceModal = () => {
    return (
      <Modal transparent={true} visible={true}>
        <View style={styles.resContainer}>
          <Text style={styles.filterHeading}>VARIANT</Text>
        </View>
      </Modal>
    );
  };
  return (
    <>
      <MaterialCommunityIcons
        name="menu"
        size={36}
        color="#3B1FA3"
        style={{ padding: 10, paddingRight: 0 }}
        onPress={() => setShow(true)}
      />
      {show && <ResourceModal />}
    </>
  );
};

const styles = StyleSheet.create({
  filterbtn: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 10,
    width: 50,
    height: 50,
    marginLeft: 5,
    alignSelf: "center",
  },

  resContainer: {
    backgroundColor: "#F1F3F5",
    height: "90%",
    width: "70%",
    marginTop: 52,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  filterHeading: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },

  filterBox: {
    borderBottomWidth: 1,
    padding: 20,
    paddingTop: 0,
    borderBottomColor: "#D1D5DB",
  },

  filterTitle: {
    fontSize: 16,
    lineHeight: 24,
    paddingTop: 16,
    color: "#1F2937",
    fontFamily: "Poppins_400Regular",
  },

  clearbtn: {
    flexGrow: 1,
    margin: 2,
  },

  clearbtntxt: {
    color: "#3B1FA3",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  applybtn: {
    flexGrow: 1,
    backgroundColor: "#3B1FA3",
    borderRadius: 4,
    margin: 2,
    marginRight: 15,
  },

  applybtntxt: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Inter_700Bold",
  },

  sortDir: {
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
  },
  sortDirSelected: {
    fontSize: 14,
    width: "50%",
    margin: 2,
    lineHeight: 30,
    textAlign: "center",
    backgroundColor: "#3B1FA3",
    color: "#fff",
    fontFamily: "Inter_700Bold",
    borderRadius: 5,
  },
});

export default ResourceControl;
