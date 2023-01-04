import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Loader } from '../components';

interface Props {
  navigation: any;
}
const SplashScreen = (props:Props) => {
    useEffect(() => {
        window.setTimeout(() => props.navigation.navigate('Onboarding'), 3000);
      }, []);

      return (
        <View style={styles.container}>
        <ImageBackground source={require("../../assets/start-screen.png")} resizeMode="cover" style={styles.image} >
          <View style={styles.loader}>
          <Loader size={50} />
          </View> 
        </ImageBackground>
        </View>
        
      );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  loader:{
    lineHeight: 4,
    textAlign: "center",
    justifyContent: "flex-start",
    alignItems: "center",
  }

});

export default SplashScreen;