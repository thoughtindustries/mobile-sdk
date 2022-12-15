import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const Link = (props) => {
    return <TouchableOpacity style={style.link} onPress={props.onPress}>
        <Text style={style.linkText}>{props.title}</Text>
    </TouchableOpacity>;
};

const style = StyleSheet.create({    
    link: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },

    linkText:{
        fontWeight: "700",
        fontSize: 16,
        color: "#3B1FA3"
    }
});

export default Link;



