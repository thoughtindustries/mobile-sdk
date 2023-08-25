import { Dimensions } from "react-native";

export const scaleDimension = (baseValue: number, scaleByWidth: boolean) => {
  const referenceValue: number = 440;
  return (
    (baseValue / referenceValue) *
    (scaleByWidth
      ? Dimensions.get("screen").width
      : Dimensions.get("screen").height)
  );
};
