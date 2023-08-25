import React, { useState, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { theme } from "../utils";

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
    backgroundColor: theme.surface["surface-300"],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    backgroundColor: theme.surface["surface-400"],
  },
});

export default Loader;
