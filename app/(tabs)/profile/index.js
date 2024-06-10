import {
  StyleSheet,
  Text,
  View,
  
  Image,
  Button,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";


const index = () => {
  const [userName, setUserName] = useState("");
  const [selectedTab, setSelectedTab] = useState('')
  const navigation = useNavigation();


  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Retrieve userName from AsyncStorage
        const storedUserName = await AsyncStorage.getItem("userName");
        if (storedUserName !== null) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error("Error fetching userName:", error);
      }
    };

    fetchUserName();
  }, []);
  function handleLogout() {
    AsyncStorage.removeItem("authToken");
    navigation.navigate('(authenticate)');
  }
  return (
    <View
      style={{ flex: 1, backgroundColor: "#77ACF1", paddingLeft: 39, paddingTop: 50, justifyContent: "space-between"}}
    >

      <TouchableOpacity
        style={{
          width: 34,
          height: 34,
          backgroundColor: "#EFF2F5",
          borderRadius: 17,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "flex-end",
          marginRight: 35,
        }}
        onPress={navigation.goBack}
      >
        <Feather name="x" size={24} color="black" />
      </TouchableOpacity>
      <View>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 23,
            color: "#000000",
          }}
        >
          Welcome,
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 23,
            color: "#000000",
            marginTop: 25,
          }}
        >
          {userName ? userName : "Guest"}!
        </Text>
      </View>
      <View style={{ flexDirection: "column",  justifyContent: "space-between"  }}>
        
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "home" && styles.selectedTabButton,
            ]}
            onPress={() => setSelectedTab("home") * navigation.navigate("home")}
            onFocus={() => setSelectedTab("home")}
            onBlur={() => setSelectedTab("") }

          >
           
            <Feather name="home" size={24} color={"#FFFFFF"} />
            <Text style={styles.tabButtonText}>Home</Text>
            
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "history" && styles.selectedTabButton,
            ]}
            onPress={() => setSelectedTab("history") * navigation.navigate("history")}
            onFocus={() => setSelectedTab("history")}
            onBlur={() => setSelectedTab("")}
          >
            <Feather name="clock" size={24} color={ "#FFFFFF"} />
            <Text style={styles.tabButtonText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "rate" && styles.selectedTabButton,
            ]}
            onPress={() => setSelectedTab("rate")}
            onFocus={() => setSelectedTab("rate")}
            onBlur={() => setSelectedTab("")}
          >
            <Feather name="star" size={24} color={ "#FFFFFF"} />
            <Text style={styles.tabButtonText}>Rate Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === "signOut" && styles.selectedTabButton,
            ]}
            onPress={() => setSelectedTab("signOut") * handleLogout()}
            onFocus={() => setSelectedTab("signOut")}
            onBlur={() => setSelectedTab("")}
          >
            <Feather name="log-out" size={24} color={ "#FFFFFF"} />
            <Text style={styles.tabButtonText}>Sign Out</Text>
          </TouchableOpacity>

         
        
      </View>

    </View>

  );
};
 
export default index;

const styles = StyleSheet.create({
  tabButton: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 60,
    width: 279,
    padding: 18,
    paddingLeft: 22,
    borderRadius: 18,
    marginBottom: 20,
  },
  selectedTabButton: {
    backgroundColor: "#3EDBF0",
  },
  tabButtonText: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 18,
    color: "#FFFFFF",
    marginLeft: 20,
  },
});
