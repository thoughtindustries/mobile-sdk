import React, { useState } from "react";

import { View, Text, StyleSheet, Linking } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { topicType } from "../../types";

import Utils from "../helpers/Utils";

import _ from "lodash";

import { SelectList } from "react-native-dropdown-select-list";

const ResourceControl = (props: {
  data: topicType[];
  variant: number;
  onChange: (a: number) => void;
}) => {
  const [show, setShow] = useState<boolean>(false);

  const ResourceModal = () => {
    const getOption = (lang: { label: string }, idx: number) => ({
      key: idx,
      value: _.get(lang, "label", ""),
    });

    const renderResource = (url: string) => {
      return (
        <View style={styles.resourceContainer}>
          <View style={styles.row}>
            <MaterialCommunityIcons
              name="file-outline"
              size={20}
              color="#3B1FA3"
            />
            <Text style={styles.link} onPress={() => Linking.openURL(url)}>
              View/Download
            </Text>
          </View>
        </View>
      );
    };

    const RenderResources = () => {
      const resource: {
        pdfAssetUrl: string;
        pdfAssetSecondaryUrl: string;
      } = _.get(props, `data.languages.${props.variant}`, {
        pdfAssetUrl: "",
        pdfAssetSecondaryUrl: "",
      });
      return (
        <View>
          {!_.isEmpty(resource.pdfAssetUrl) &&
            renderResource(resource.pdfAssetUrl)}

          {!_.isEmpty(resource.pdfAssetSecondaryUrl) &&
            renderResource(resource.pdfAssetSecondaryUrl)}
        </View>
      );
    };

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

          <SelectList
            setSelected={props.onChange}
            defaultOption={getOption(
              _.get(props, `data.languages.${props.variant}`, { label: "" }),
              props.variant
            )}
            search={false}
            data={_.get(props, "data.languages", []).map(getOption)}
            fontFamily="Poppins_400Regular"
            boxStyles={{ marginTop: 10, marginBottom: 10 }}
          />

          <View style={styles.row}>
            <MaterialCommunityIcons
              name="flag-outline"
              size={22}
              color="#6B7280"
            />
            <Text style={styles.variant}>RESOURCES</Text>
          </View>

          <RenderResources />
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
    zIndex: 200,
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

  resourceContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 4,
    padding: 5,
  },

  link: {
    fontSize: 16,
    color: "#3B1FA3",
    fontFamily: "Poppins_400Regular",
    marginTop: 3,
    marginLeft: 5,
  },
});

export default ResourceControl;
