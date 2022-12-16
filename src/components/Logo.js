import React from 'react';
import {Image,StyleSheet} from 'react-native';

const Logo = () => (
  <Image source={require("../../assets/logo.png")} style={style.logo} />
);

const style = StyleSheet.create({
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default Logo;