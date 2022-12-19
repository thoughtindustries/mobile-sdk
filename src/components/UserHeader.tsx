import {useState, useEffect} from 'react';
import {Image, View, Text} from 'react-native';
import Utils from '../helpers/Utils';
import _ from 'lodash';

const UserHeader = () => {

    const [udata,setUdata] = useState(false);

    useEffect(() => {
        Utils.fetch('udata')
        .then(setUdata);
    },[]);
    return <View style={{display: 'flex', flexDirection: 'row', margin: 10, marginTop: 50}}>
        <Image source={require('../../assets/user.png')} />
        <Text style={{margin: 5, fontWeight: "700", fontSize: 20, lineHeight: 30}}>Hi, {_.get(udata,'firstName', '')} {_.get(udata,'lastName', '')}</Text>
    </View>
};

export default UserHeader;