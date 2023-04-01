import { StyleSheet, Dimensions, PixelRatio } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: (Dimensions.get("window").height / 440) * 16,
    paddingTop: (Dimensions.get("window").height / 440) * 30,
  },

  label: {
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginTop: (Dimensions.get("window").height / 440) * 10,
    marginBottom: (Dimensions.get("window").height / 440) * 3,
    fontSize: (Dimensions.get("window").width / 440) * 16,
  },

  input: {
    fontFamily: "Poppins_400Regular",
    padding: (Dimensions.get("window").height / 440) * 10,
    paddingLeft: (Dimensions.get("window").height / 440) * 10,
    paddingRight: (Dimensions.get("window").height / 440) * 10,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginBottom: PixelRatio.get() * 4,
  },

  inlineError: {
    color: "#DF3131",
    height: 13,
    fontSize: 11,
  },

  errorField: {
    borderColor: "#DF3131",
    color: "#DF3131",
  },
});
