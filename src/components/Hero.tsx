import React, { FC, ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { placeHolderimage } from "../helpers";

interface HeroProps {
  asset: string;
  children: ReactNode;
}

const Hero: FC<HeroProps> = ({ asset, children }) => {
  return (
    <ImageBackground
      source={asset ? { uri: asset } : placeHolderimage}
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
