import React,{useState, useEffect} from 'react';
import {ScrollView, View, Text, TextInput, StyleSheet} from 'react-native';
import {Logo,Button, Message} from '../components';
import AppStyle from '../../AppStyle'; 
import tiApiObj from '../helpers/TIApi';
import _ from 'lodash';
import validator from 'validator';
import Success from './Success';
import {TI_INSTANCE_NAME} from '@env';

const Registration = (props) => {
   
   const [email, setEmail] = useState("");
   const [fname, setFName] = useState("");
   const [lname, setLName] = useState("");
   const [processing, setProcessing] = useState(false);
   const [message, setMessage] = useState({error: "", info: ''});


   const goRegistration = () => {
    
        const udata = {
            firstName:fname,
            lastName:lname,
            email:email
        };

        if(!validator.isEmail(udata.email)){
            setMessage({info:"", error: `Please enter a valid email address!`});
            return false;
        }

        setProcessing(true);

        tiApiObj.createUser(udata)
        .then(res => {
            setProcessing(false);
            setMessage({error:"", info:`Welcome to ${TI_INSTANCE_NAME}!\nPlease check you email to complete your registration`});
            window.setTimeout(() => {
                props.navigation.navigate('Login');
            },3000);
        })
        .catch(err => {
            setProcessing(false);
            setMessage({info:"", error: _.get(err,'message',err)})
        })
    

   };

    return <>
        {processing && <Success message="Registration going on, Please wait.. " />}

        {!processing && message.info!=="" && <Success title="Success" message={message.info} />}

        {!processing && message.info==="" && <ScrollView> 
            {message.error!=="" && <Message type="error" canClose={true} message={message.error} onHide={() => {
                setMessage({...message, "error": ""});
                
            }} />}
        
            <View style={AppStyle.container}>
                <View style={loginStyle.section1}>
                    <Logo />
                    <Text style={loginStyle.title}>Create New Account</Text>
                </View>  
                <View style={loginStyle.section2}>
                    <Text style={AppStyle.label}>Email</Text>
                    <TextInput textContentType="text" placeholder='default@email.com' onChangeText={setEmail} style={AppStyle.input} />
                    <Text style={AppStyle.label}>First Name</Text>
                    <TextInput textContentType="text" placeholder='First Name' onChangeText={setFName} style={AppStyle.input} />
                    <Text style={AppStyle.label}>Last Name</Text>
                    <TextInput textContentType="text" placeholder='Last Name' onChangeText={setLName} style={AppStyle.input} />
                    <Button title="Sign up" onPress={goRegistration} />
                </View>      
            </View>
        </ScrollView>}
    </>;
};

const loginStyle = StyleSheet.create({

    container: {
        flex: 1,
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
        fontFamily: "Poppins_400Regular",
        fontWeight: "700",
        fontSize: 24,
        lineHeight: 36,
        textAlign: "center",
        color: "#1F2937",
        marginBottom: 10
    },

    subtitle:{
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        color: "#6B7280"
    },

    link: {
        textAlign: "center",
        fontFamily: "Poppins_400Regular",
        fontWeight: "700",
        color: '#3B1FA3',
        paddingTop: 25
    }

});

export default Registration;