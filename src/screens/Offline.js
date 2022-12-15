import React from 'react';
import {useNetInfo} from "@react-native-community/netinfo";
import {View, Text,Image,StyleSheet} from 'react-native';
import {Button} from '../components';
import AppStyle from '../../AppStyle';
import _ from 'lodash';

const Offline = () => {

    const netInfo = useNetInfo();

    return <View style={AppStyle.container}>
        <View style={offStyle.section1}>
            <Image source={require("../../assets/wifix.png")}  style={offStyle.networkOff} />
            <Text style={offStyle.title}>You are currently offline</Text>
            <Text style={offStyle.subtitle}>Get all your offline files here.</Text>
        </View>
        <View style={offStyle.section2}>
            <Button title="Offline Mode"  />
        </View>
    </View>;
};

const offStyle = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
    },

    section1:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto"
       
    },

    section2:{
        flex:1,
        justifyContent: "flex-start",
        marginLeft:22,
        marginRight:22
    },

    title: {
        fontWeight: "700",
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#1F2937",
        marginBottom: 10
    },

    subtitle:{
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        color: "#6B7280"
    },

    networkOff: {
        textAlign: "center",
        fontWeight: "700",
        color: '#3B1FA3',
        paddingTop: 25
    }

});

export default Offline;