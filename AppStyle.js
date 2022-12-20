import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 40,
    height: "100%",
    backgroundColor: "#F3F4F6",
  },

  label: {
    fontFamily: "Poppins_700Bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },

  input: {
    fontFamily: "Poppins_400Regular",
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
});
