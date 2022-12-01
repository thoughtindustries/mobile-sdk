import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Logo,Button,Link} from '../components';
import AppStyle from '../../AppStyle';

const Onboarding = (props) => {
    return <View style={AppStyle.container}>
        <View style={obStyle.section1}>
            <Logo />
            <Text style={obStyle.title}>Let's Get Started</Text>
            <Text style={obStyle.subtitle}>Sign In or Create a new account to get started.</Text>
        </View>
        <View style={obStyle.section2}>
            <Button title="Sign In" onPress={() => props.navigation.navigate("Login")} />
            <Link title="Create new account!" onPress={() => props.navigation.navigate("Registration")} />
        </View>
    </View>;
};

const obStyle = StyleSheet.create({

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

export default Onboarding;