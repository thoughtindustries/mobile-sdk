import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Button = (props) => {
    return <TouchableOpacity
        style={style.button}
        onPress={props.onPress}
        >
        <Text style={style.buttonText}>{props.title}</Text>
    </TouchableOpacity>;
};

const style = StyleSheet.create({    
    button: {
        marginTop:20,
        marginBottom: 20,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#3B1FA3",
        borderRadius: 4
    },

    buttonText:{
        fontFamily: "Poppins",
        fontWeight: "700",
        color: "#ffffff"
    }
});

export default Button;



