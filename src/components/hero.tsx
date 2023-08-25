import React, { FC, ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { placeHolderImage } from "../utils";

interface HeroProps {
  asset: string;
  children: ReactNode;
}

const Hero = ({ asset, children }: HeroProps) => {
  return (
    <ImageBackground
      source={asset ? { uri: asset } : placeHolderImage}
      resizeMode="cover"
      style={styles.hero}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  hero: {
    flex: 1,
  },
});

export default Hero;
