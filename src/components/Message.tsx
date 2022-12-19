import React from "react";
import { Modal, StyleSheet, Text, Pressable, View, Image } from "react-native";
import _ from 'lodash';

interface MessageProps {
  canClose:boolean;
  type:string;
  message:string;
  onHide(): void;
}

const Message = ({canClose, type,message, onHide}:MessageProps) => {
  const icon: any = {
    success: require('../../assets/success.png'),
    error: require('../../assets/error.png'),
  };

  

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onHide}
      >
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {canClose && <Pressable style={styles.buttonClose} onPress={onHide}>
              <Text style={styles.textClose}>X</Text>
            </Pressable>}
            {!_.isEmpty(type) && <Image source={icon[type]} style={styles.icon} />}
            <Text style={styles.modalText}>{message}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "#fdf7e2",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonClose: {
    borderRadius: 30,
    padding: 0,
    elevation: 2,
    backgroundColor:"#000000",
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: -5,
    marginRight: -10
  },
  textClose: {
    width:30,
    height:30,
    lineHeight: 30,
    color:"white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center"
  },
  icon:{
    width: 50,
    height: 50,
    marginBottom: 20
  }
});

export default Message;