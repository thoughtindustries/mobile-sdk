import React, { FC, ReactNode } from "react";
import { ImageBackground, StyleSheet } from "react-native";

interface HeroProps {
  asset: string;
  children: ReactNode;
}

const Hero: FC<HeroProps> = ({ asset, children }) => {
  return (
    <ImageBackground
      source={{ uri: asset }}
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
