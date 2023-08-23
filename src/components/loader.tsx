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

  return (
    <View
      style={[
        style.container,
        { height: size, width: size, borderRadius: size },
      ]}
    >
      <Animated.View
        style={[
          style.loader,
          {
            height: init,
            width: init,
            borderRadius: size,
          },
        ]}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "#cccccc55",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    backgroundColor: "#cccccc33",
  },
});

export default Loader;
