import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';


interface LoaderProps {
    size: number;
  }

const Loader = (props:LoaderProps) => {

    const [size,setSize] = React.useState(new Animated.Value(0));

    const startAnimation = () =>{
        Animated.loop(
            Animated.timing(size, {
              toValue: props.size,
              duration: props.size*10,
              useNativeDriver: false
            })).start();
       };
    
       React.useEffect(startAnimation,[]);

       const style = StyleSheet.create({
           container: {
            width: props.size, 
            height: props.size, 
            backgroundColor:'#cccccc55', 
            borderRadius: props.size, 
            display:'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
        }
    })

       return <>
       <View style={style.container}>
            <Animated.View
                style={{
                    height: size,
                    width: size,
                    borderRadius: props.size,
                    backgroundColor: "#cccccc33"
                }}
            />
        </View>
       </>

};

export default Loader;