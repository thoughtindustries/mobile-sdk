import React,{useState} from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';
import {Loader} from '../components'; 
import _ from 'lodash';

const Success = (props) => {
  return <View style={successStyle.container}>
      <View style={successStyle.section1}>
        <Image
          source={require("../../assets/logo-white.png")}
          style={successStyle.logo}
        />
        {_.get(props, "title", "") !== "" && (
          <Text style={successStyle.title}>{props.title}</Text>
        )}
        {props.message.split("\n").map((msg, idx) => (
          <Text key={idx} style={successStyle.message}>
            {msg}
          </Text>
        ))}
      </View>
      <View style={successStyle.section2}>
        <Loader size={50} />
        </View>
        
    </View>;
};

const successStyle = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#3B1FA3"
    },
    
    section1:{
        flex:2,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:100,
        marginBottom: 100
    },

    section2:{
        flex:3,
        justifyContent: "flex-start",
        alignItems: "center",
        marginLeft:22,
        marginRight:22
    },

    logo:{
        justifyContent:"center",
        alignItems:"center",
        marginBottom:20 
    },

    title: {
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#ffffff",
        marginBottom: 10
    },
    
    message: {
        textAlign: "center",
        fontSize: 16,
        lineHeight: 24,
        color: "#ffffff",
        margin: 60,
        marginTop: 10,
        marginBottom: 10
    }

});

export default Success;