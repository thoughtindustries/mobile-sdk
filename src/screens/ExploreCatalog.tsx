import React from "react";
import { UserHeader, Link } from "../components";
import { truncate } from "lodash";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { SearchBar, SearchBarProps } from 'react-native-elements';
import { 
    View, 
    Image, 
    Text, 
    StyleSheet,
} from "react-native";




const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>;\
const ExploreCatalog = () => {
    const [value, setValue] = React.useState("");
    const Search = () => (
        <View>
            import * as React from "react";
import { SearchBar } from "@rneui/base";

export default () => {
 
  return (
    <SearchBar
      platform="default"
      containerStyle={{}}
      inputContainerStyle={{}}
      inputStyle={{}}
      leftIconContainerStyle={{}}
      rightIconContainerStyle={{}}
      loadingProps={{}}
      onChangeText={newVal => setValue(newVal)}
      onClearText={() => console.log(onClearText())}
      placeholder="Type query here..."
      placeholderTextColor="#888"
      cancelButtonTitle="Cancel"
      cancelButtonProps={{}}
      onCancel={() => console.log(onCancel())}
      value={value}
    />
  );
}
        </View>
    );

    

    return (
        <View><Text>Welocme To Explore Catalog Page</Text></View>
    );

}

const styles = StyleSheet.create({
    page: {
      marginTop: 20,
      marginLeft: 20,
      marginRight: 20,
    },
  
    bannerContainer: {
      borderRadius: 10,
    },
  
    bannerArea: {
      height: 282,
      padding: 32,
      justifyContent: "flex-end",
      fontFamily: "Poppins_400Regular",
    },
  
    bannerTitle: {
      fontSize: 24,
      lineHeight: 36,
      fontFamily: "Poppins_700Bold",
      color: "#fff",
    },
  
    bannerText: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins_400Regular",
      color: "#ccc",
    },
  
    topCatBox: {
      marginTop: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  
    heading: {
      marginTop: 15,
      fontSize: 16,
      lineHeight: 24,
      fontFamily: "Poppins_700Bold",
      color: "#000",
    },
  
    catContainer: {
      display: "flex",
      flexDirection: "row",
      padding: 5,
    },
  
    courseContainer: {
      display: "flex",
      flexDirection: "row",
      padding: 5,
    },
  
    catBox: {
      backgroundColor: "#f9fafv",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#d1d5db",
      borderRadius: 8,
      alignItems: "center",
      minWidth: 104,
      margin: 4,
    },
  
    courseBox: {
      marginTop: 5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
  
    recContentBox: {
      backgroundColor: "#FAFAFA",
      borderStyle: "solid",
      borderColor: "#E5E7EB",
      width: 260,
      margin: 12,
    },
  
    catTitle: {
      color: "#1f2937",
      fontWeight: "400",
      fontSize: 14,
      lineHeight: 24,
      paddingTop: 13,
      paddingBottom: 13,
      paddingLeft: 5,
      paddingRight: 5,
    },
    courseTitle: {
      color: "#D4D4D8",
      fontWeight: "700",
      fontSize: 16,
      justifyContent: "flex-start",
      lineHeight: 50,
    },
    recCourseTitle: {
      color: "#1F2937",
      fontWeight: "700",
      fontSize: 16,
      lineHeight: 50,
    },
    courseDes: {
      color: "#6B7280",
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 18,
    },
    courseThumbnail: {
      width: 260,
      height: 150,
    },
    contentArea: {
      padding: 32,
      fontFamily: "Poppins_400Regular",
    },
  });

export default ExploreCatalog;