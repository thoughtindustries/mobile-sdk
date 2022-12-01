import React,{useState} from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet, Pressable} from 'react-native';
import {Logo,Button} from '../components';
import AppStyle from '../../AppStyle'; 

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Registration = (props) => {
   const [isPasswordSecure, setIsPasswordSecure] = useState(true);
   const [isPasswordSecure2, setIsPasswordSecure2] = useState(true);

    return <ScrollView>
        <View style={AppStyle.container}>
            <View style={loginStyle.section1}>
                <Logo />
                <Text style={loginStyle.title}>Create New Account</Text>
            </View>  
            <View style={loginStyle.section2}>
                <Text style={AppStyle.label}>Email</Text>
                <TextInput textContentType="text" placeholder='default@email.com' style={AppStyle.input} />
                <Text style={AppStyle.label}>Password</Text>
                <View style={{...AppStyle.input, flexDirection:"row"}}>
                    <TextInput secureTextEntry={isPasswordSecure} placeholder='Enter your password here' style={{margin:0, padding:0, width: "93%"}} />
                    <Pressable onPress={() => setIsPasswordSecure(!isPasswordSecure)} style={{justifyContent: "center"}}>
                        <MaterialCommunityIcons name={isPasswordSecure ? "eye-off" : "eye"} size={22} color="#232323" />
                    </Pressable>
                </View>
                <Text style={AppStyle.label}>Confirm Password</Text>
                <View style={{...AppStyle.input, flexDirection:"row"}}>
                    <TextInput secureTextEntry={isPasswordSecure2} placeholder='Enter your password here' style={{margin:0, padding:0, width: "93%"}} />
                    <Pressable onPress={() => setIsPasswordSecure2(!isPasswordSecure2)} style={{justifyContent: "center"}}>
                        <MaterialCommunityIcons name={isPasswordSecure2 ? "eye-off" : "eye"} size={22} color="#232323" />
                    </Pressable>
                </View>
                <Button title="Sign up" onPress={() => props.navigation.navigate('Success')} />
            </View>      
        </View>
    </ScrollView>;
};

const loginStyle = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column"
    },

    section1:{
        flex:2,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop:100
       
    },

    section2:{
        flex:2,
        justifyContent: "flex-start",
        marginLeft:22,
        marginRight:22
    },

    title: {
        fontFamily: "Poppins",
        fontWeight: "700",
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#1F2937",
        marginBottom: 10
    },

    subtitle:{
        fontFamily: "Poppins",
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        color: "#6B7280"
    },

    link: {
        textAlign: "center",
        fontFamily: "Poppins",
        fontWeight: "700",
        color: '#3B1FA3',
        paddingTop: 25
    }

});

export default Registration;