import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import _ from "lodash";

interface MessageProps {
  type?: string;
  title?: string;
  message?: string;
  extraJSX?: JSX.Element;
  onHide?: Function;
}

const Message = ({
  type = "info",
  title = "",
  message = "",
  extraJSX = <></>,
  onHide,
}: MessageProps) => {
  const icon: { success: NodeRequire; error: NodeRequire } = {
    success: require("../../assets/success.png"),
    error: require("../../assets/error.png"),
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalDialog}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          {extraJSX}
          <TouchableOpacity onPress={onHide}>
            <Text style={styles.closeBtn}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18242Ebb",
    height: "100%",
  },

  modalDialog: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    margin: 40,
    padding: 40,
  },

  modalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },

  modalMessage: {
    fontFamily: "Inter_400Regular",
    paddingTop: 16,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 15,
    textAlign: "left",
  },

  closeBtn: {
    marginTop: 20,
    color: "#6B7280",
    fontSize: 14,
    alignSelf: "center",
  },
});

export default Message;
