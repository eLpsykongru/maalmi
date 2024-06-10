import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React ,{ useEffect, useState }from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const history = () => {
  const navigation = useNavigation();
  const [selectedTab,setSelectedTab]= useState("Service Requests");

  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          padding: 18,
          justifyContent: "space-between",
          gap: 9,
          activeOpacity: 0.5,
        }}
        onPress={goBack}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text>Back</Text>
      </TouchableOpacity>
      <View>
        <Text
          style={{
            fontWeight: 400,
            fontSize: 36,
            lineHeight: 42,
            color: "#292D32",
            paddingLeft: 21,
            paddingTop: 14,
          }}
        >
          History
        </Text>
        <View
          style={{
            backgroundColor: "#EFF2F5",
            width: 390,
            height: 56,
            flexDirection: "column",
            justifyContent: "flex-end", 
            alignSelf: "center",
            marginTop:9
          }}
        >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "stretch",
                  paddingBottom:17
                }}
              >
                <TouchableOpacity  onPress={() => setSelectedTab("Service Requests")}>
                  <Text style={[
                    styles.textViewFirstNotSelected,
                    selectedTab === "Service Requests" && styles.textViewFirstSelected
                  ]}>Service Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => setSelectedTab("Announcements")}>
                <Text style={[
                    styles.textViewFirstNotSelected,
                    selectedTab === "Announcements" && styles.textViewFirstSelected
                ]}>Announcements</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={() => setSelectedTab("Reports")}>
                <Text style={[
                    styles.textViewFirstNotSelected,
                    selectedTab === "Reports" && styles.textViewFirstSelected
                ]}>Reports</Text>
                </TouchableOpacity>
              </View>
          <View style={{ height: 3, backgroundColor: "#292D32" }} />
        </View>
      </View>
      {/* Tab Content */}
      
    </View>
  );
};

export default history;

const styles = StyleSheet.create({
  textViewFirstNotSelected:{
    color:'#B3BFCB'
  },
  textViewFirstSelected:{
    color:'#292D32'
  }
});
