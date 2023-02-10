import React, { useState } from "react";

import { View, Text, StyleSheet, Pressable } from "react-native";

import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { topicType } from "../../types";

import Utils from "../helpers/Utils";

import _ from "lodash";

const ResourceControl = (props: { data: topicType[] }) => {
  const [show, setShow] = useState<boolean>(false);
  const [variant, setVariant] = useState<number>(0);
  
  const ResourceModal = () => {
    return (
      <View style={styles.resContainer}>
        <View style={styles.resSubContainer}>
          <MaterialCommunityIcons
            name="close"
            size={25}
            color="#1F2937"
            onPress={() => setShow(false)}
            style={{ marginBottom: 20 }}
          />
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={22}
              color="#6B7280"
            />
            <Text style={styles.variant}>VARIANT</Text>
          </View>

          <Picker selectedValue={variant}
            onValueChange={(itemValue, itemIndex) =>
            setVariant(itemValue)
          }>
            {_.get(props,'data.languages',[]).map((lang,idx) => <Picker.Item label={lang.label} value={idx} />)}
          </Picker>
        </View>
      </View>
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
  resContainer: {
    backgroundColor: "#00000066",
    position: "absolute",
    height: 1000,
    width: "100%",
  },
  resSubContainer: {
    padding: 24,
    paddingTop: 15,
    backgroundColor: "#F1F3F5",
    height: 1000,
    width: "70%",
    zIndex: 200
  },
  variant: {
    paddingLeft: 10,
    fontSize: 18,
    color: "#6B7280",
    fontFamily: "Poppins_400Regular",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default ResourceControl;
