import React from 'react';
import {Image, View, Text} from 'react-native';

const UserHeader = (props) => {
    return <View style={{display: 'flex', flexDirection: 'row', margin: 10, marginTop: 50}}>
        <Image source={require('../../assets/user.png')} />
        <Text style={{margin: 5, fontWeight: "700", fontSize: 20, lineHeight: 30}}>Hi, Username</Text>
    </View>
};

export default UserHeader;