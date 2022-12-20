import React, {useState, useEffect} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AppStyle from "../../AppStyle";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import Utils from "../helpers/Utils";
import { get } from "lodash";

type AccountScreenProps = StackNavigationProp<RootStackParamList, "Account">;

const Account = () => {
  const navigation = useNavigation<AccountScreenProps>();
  const [udata, setUdata] = useState<boolean>(false);
  useEffect(() => {
    Utils.fetch("udata").then(setUdata);
  }, []);

  return (
    <View style={accountStyles.container}>
      <View style={accountStyles.accountInfo}>
        <Text style={accountStyles.title}>Account</Text>
        <View style={accountStyles.profileInfo}>
        <Image
          source={require("../../assets/profile.png")}
          style={accountStyles.profileImage}
        />
          <Text style={accountStyles.subtitle}>
          {get(udata, "firstName", "")} {get(udata, "lastName", "")}
          </Text>
          <Text style={accountStyles.userEmail}>{get(udata, "email", "")}</Text>
          
          <TouchableOpacity onPress={() => {}}>
            <Text style={accountStyles.profileEdit}>Edit</Text>
          </TouchableOpacity>
        
        </View>
 
      </View>
      <View style={accountStyles.settingInfo}>
        <Text style={accountStyles.settingTitle}>Settings</Text>
        <TouchableOpacity onPress={() => Utils.logMeOut(navigation)}>
          <Text style={accountStyles.profileEdit}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const accountStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  accountInfo: {
    marginTop: 10,
    marginBottom: 60,
    padding:32,
    flex:1,
    width:"100%",
  },
  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  settingInfo: {
    flex:1,
    backgroundColor:"#FFFFFF",
    width:"100%",
    paddingBottom:32,
    paddingTop:32,
    alignItems:"flex-start",
    paddingLeft:32,
    paddingRight:32,
  },

  title: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: "left",
    color: "#1F2937",
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
  },
  profileImage: {
    marginTop:10,
    marginBottom: 20,
    width:132,
    height:132,
  },
  subtitle: {
    fontSize: 24,
    fontWeight:"700",
    lineHeight: 36,
    textAlign: "center",
    color: "#1F2937",
    fontFamily: "Poppins_400Regular",
  },
  userEmail: {
    fontSize: 16,
    fontWeight:"400",
    lineHeight: 24,
  },
  profileEdit: {
    color:"#3B1FA3",
    fontWeight:"700",
    fontSize:14,
    lineHeight:17,
    backgroundColor:"#F9FAFB",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: 4,
    paddingTop:16,
    paddingBottom:16,
    paddingLeft:32,
    paddingRight:32,
    marginTop:20,
    marginBottom:32,
    
  },
  settingTitle: {
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 24,
  },
  
});

export default Account;
