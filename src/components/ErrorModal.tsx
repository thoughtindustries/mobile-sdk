import React, { useEffect, useState } from "react";
import { Modal, Text, View, Pressable, StyleSheet } from "react-native";
import Button from "./Button";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";

interface ErrorModalProps {
  error: string;
  message: string;
  title: string;
  route: string | null;
}

const ErrorModal = ({ error, message, title, route }: ErrorModalProps) => {
  const [show, setShow] = useState<boolean>(message !== "");
  const navigation = useNavigation<any>();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
      onRequestClose={() => {
        setShow(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.message}>{message}</Text>
          <Button
            title={title}
            onPress={() => {
              navigation.navigate(route);
              setShow(false);
            }}
          />
          <Pressable onPress={() => setShow(false)}>
            <Text style={styles.modalClose}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    padding: 40,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  message: {
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalClose: {
    color: "#6B7280",
    fontWeight: "700",
  },
  error: {
    ...AppStyle.label,
    alignSelf: "flex-start",
  },
});

export default ErrorModal;
