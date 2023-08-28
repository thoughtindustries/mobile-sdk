import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

interface LoaderProps {
  size: number;
}

const Loader = ({ size }: LoaderProps) => {
  const [init] = useState(new Animated.Value(0));

  useEffect(() => {
    (() => {
      Animated.loop(
        Animated.timing(init, {
          toValue: size,
          duration: size * 10,
          useNativeDriver: false,
        })
      ).start();
    })();
  }, []);

  const style = StyleSheet.create({
    container: {
      width: size,
      height: size,
      backgroundColor: "#cccccc55",
      borderRadius: size,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <View style={style.container}>
      <Animated.View
        style={{
          height: init,
          width: init,
          borderRadius: size,
          backgroundColor: "#cccccc33",
        }}
      />
    </View>
  );
};

export default Loader;
