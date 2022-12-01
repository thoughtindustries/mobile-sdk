import { StyleSheet } from 'react-native';

export default StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        backgroundColor: "#F3F4F6"
    },

    button: {
        backgroundColor: "#3B1FA3",
        width: 300
    },

    label:{
       fontFamily: "Poppins",
       fontWeight:"700",
       color: "#000",
       marginTop: 20,
       marginBottom:10
    },

    input:{
        fontFamily: "Poppins",
        padding:5,
        paddingLeft:10,
        paddingRight:10,
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 5
    }

});