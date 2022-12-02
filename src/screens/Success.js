import React,{useState,useEffect} from 'react';
import {View, Text, StyleSheet,Image} from 'react-native';
import AppStyle from '../../AppStyle'; 

const Success = (props) => {

   const [loading, setLoading] = useState(false);
   
    return <View style={successStyle.container}>
        <View style={successStyle.section1}>
            <Image source={require("../../assets/logo-white.png")}  style={successStyle.logo} />
            <Text style={successStyle.title}>Welcome</Text>
        </View>
        <View style={successStyle.section2}>
            <Text style={successStyle.circle}></Text>
        </View>
        <View style={successStyle.section1}></View>
    </View>;
};

const successStyle = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        backgroundColor: "#3B1FA3"
    },
    
    section1:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:100
       
    },

    section2:{
        flex:6,
        justifyContent: "center",
        alignItems: "center",
        marginLeft:22,
        marginRight:22
    },

    logo:{
        justifyContent:"center",
        alignItems:"center",
        marginBottom:20 
    },

    circle:{
        backgroundColor: "#ffffff",
        height:50,
        width:50,
        borderRadius: 25,
        alignSelf:"center",
        fontSize: 32
    },

    title: {
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#ffffff",
        marginBottom: 10
    }

});

export default Success;