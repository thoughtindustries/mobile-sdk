import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from "react-native";
import { fonts, scaleDimension, theme } from "../utils";

interface MessageProps {
  title?: string;
  message?: string;
  extraJSX?: JSX.Element;
  onHide?: (event: GestureResponderEvent) => void;
}

const Message = ({
  title = "",
  message = "",
  extraJSX = <></>,
  onHide,
}: MessageProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={true}>
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
    backgroundColor: theme.surface["surface-blurred"],
    height: "100%",
  },
  modalDialog: {
    backgroundColor: theme.surface["surface-100"],
    borderRadius: scaleDimension(5, true),
    margin: scaleDimension(50, true),
    padding: scaleDimension(50, true),
  },
  modalTitle: {
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(20, true),
    lineHeight: scaleDimension(12, false),
  },
  modalMessage: {
    fontFamily: fonts.inter.regular,
    paddingTop: scaleDimension(16, true),
    fontSize: scaleDimension(16, true),
    color: theme.text["text-secondary"],
    lineHeight: scaleDimension(8, false),
    textAlign: "left",
  },
  closeBtn: {
    marginTop: scaleDimension(20, true),
    color: theme.text["text-secondary"],
    fontSize: scaleDimension(16, true),
    alignSelf: "center",
  },
});

export default Message;
