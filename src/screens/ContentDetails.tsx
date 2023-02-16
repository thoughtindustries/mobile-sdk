import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView
} from "react-native";
import _ from "lodash";
import { Button, ResourceControl } from "../components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, pageType } from "../../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TabView, SceneMap } from 'react-native-tab-view';

type ContentDetailsScreenProps = StackNavigationProp<
RootStackParamList,
"ContentDetails"
>;

const ContentDetails = () => {

  const navigation = useNavigation<ContentDetailsScreenProps>();
  const [fullBody, setFullBody] = useState<Boolean>(false);
  const initialLayout = { width: Dimensions.get('window').width };
  const reportData: { thumbnail: string; reportTitle: string; author: string }[] = [
    {
      thumbnail: "https://loremflickr.com/640/360",
      reportTitle: "Create a Custom Report",
      author:"Sarah William",
    }
  ];
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'coutline', title: 'Course Outline' },
    { key: 'discussion', title: 'Discussion' },
  ]);

  const CustomReport = () => (
    <>
    {reportData.map((report, idx) => (
      <View style={styles.reportRow}>
        <View style={styles.reportRightBox}>
          <Text style={styles.courseTitle}>{report.reportTitle}</Text>
          <Text style={styles.courseAuthor}>By {report.author}</Text>
        </View>
        <Image
          source={{ uri:report.thumbnail }}
          style={styles.recentImage}
        />
      </View>
      ))}
    </>
  );

  const AboutCourse = () => (
    <>
        <View style={styles.aboutSection}>
          <Text style={styles.courseSubTitle}>About this Course</Text>
          <Text style={styles.courseDesc}>Lorem ipsum dolor sit amet consectetur elit. Architecto accusantium praesentium eius, ut atque fuga culpa sequi.</Text>
        </View>


    </>
  );

  const FirstRoute = () => (
    <View style={[styles.tabContainer, { backgroundColor: '#ff4081' }]} >
      <Text>First Tab Data</Text>
    </View>
  );
  const SecondRoute = () => (
    <View style={[styles.tabContainer, { backgroundColor: '#673ab7' }]}>
            <Text>Second Tab Data</Text>
    </View>
  );

  const renderScene = SceneMap({
    coutline: FirstRoute,
    discussion: SecondRoute,
  });

  return(
    <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
    <View style={styles.page}>
     {!fullBody && (
     <>
     <View style={styles.row}>
       
       <MaterialCommunityIcons
         name="chevron-left"
         size={32}
         color="#FFFFFF"
         style={styles.backIcon}
         onPress={() => setFullBody(false)}
       />
       <Text style={styles.backBtn} onPress={() => setFullBody(false)}>
         Back
       </Text>
     </View>
     </>
     )}
     <CustomReport/>
     <AboutCourse/>
     <TabView
       navigationState={{ index, routes }}
       renderScene={renderScene}
       onIndexChange={setIndex}
       initialLayout={initialLayout}
       style={styles.tabMenu}
     />
 
     </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
    page: {
      marginTop:50,
      paddingLeft:32,
      paddingRight:32,
      backgroundColor: "#F5F5F7",
    },
    row: {
      paddingTop: 0,
      display: "flex",
      flexDirection: "row",
    },
    backIcon: {
      backgroundColor: "#374151",
      borderRadius:8,
      width:32,
      height:32,
    },
    backBtn: {
      paddingTop: 2,
      marginLeft: 10,
      fontSize:20,
    },
    reportRow: {
      display: "flex",
      flexDirection: "row",
      borderBottomColor: "#D1D5DB",
      borderBottomWidth: 1,
      marginBottom: 20,
    },  
    reportRightBox: {
      flexGrow: 1,
      paddingTop: 30,
      paddingBottom: 30,
    },
    courseTitle: {
      fontSize: 20,
      lineHeight: 24,
      textAlign: "left",
      color: "#1F2937",
      fontFamily: "Poppins_700Bold",
    },
    courseAuthor: {
      fontSize: 12,
      lineHeight: 15,
      textAlign: "left",
      color: "#6B7280",
      fontFamily: "Inter_400Regular",
    },
    recentImage: {
      width: 75,
      height:75,
      borderRadius: 8,
      margin: 20,
    },
    aboutSection: {
      paddingTop:10,
    },
    courseSubTitle: {
      fontSize: 12,
      lineHeight: 15,
      textAlign: "left",
      color: "#1F2937",
      fontFamily: "Inter_700Bold",
    },
    courseDesc: {
      fontSize: 15,
      lineHeight: 24,
      textAlign: "left",
      paddingTop:10,
      color: "#6B7280",
      fontFamily: "Poppins_400Regular",
    },
    tabContainer: {
      flex: 1,
    },
    tabMenu: {
      backgroundColor:"red",
      marginTop:30,
    },

});

export default ContentDetails;